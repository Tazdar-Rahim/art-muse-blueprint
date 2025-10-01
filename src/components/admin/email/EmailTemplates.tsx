import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, RotateCcw, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplateEditor } from './EmailTemplateEditor';
import { EmailTemplatePreview } from './EmailTemplatePreview';

export function EmailTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const toggleTemplateMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) => {
      const { error } = await supabase
        .from('email_templates')
        .update({ is_enabled: isEnabled })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({ title: 'Template updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update template', variant: 'destructive' });
    },
  });

  const resetTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const template = templates?.find((t) => t.id === id);
      if (!template) throw new Error('Template not found');

      const { error } = await supabase
        .from('email_templates')
        .update({
          subject: template.default_subject,
          html_content: template.default_html_content,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({ title: 'Template reset to default' });
    },
    onError: () => {
      toast({ title: 'Failed to reset template', variant: 'destructive' });
    },
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Authentication': return 'bg-blue-500/10 text-blue-500';
      case 'Orders': return 'bg-green-500/10 text-green-500';
      case 'Commissions': return 'bg-purple-500/10 text-purple-500';
      case 'Consultations': return 'bg-orange-500/10 text-orange-500';
      case 'Admin': return 'bg-red-500/10 text-red-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading templates...</div>;
  }

  const groupedTemplates = templates?.reduce((acc: any, template: any) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {});

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groupedTemplates || {}).map(([category, categoryTemplates]: [string, any]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Badge className={getCategoryColor(category)}>{category}</Badge>
              <span className="text-sm text-muted-foreground">
                ({categoryTemplates.length} templates)
              </span>
            </h3>
            
            <div className="grid gap-3">
              {categoryTemplates.map((template: any) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{template.name}</h4>
                        {!template.is_enabled && (
                          <Badge variant="outline" className="text-xs">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Subject:</strong> {template.subject}
                      </p>
                      {template.variables && (
                        <p className="text-xs text-muted-foreground">
                          <strong>Variables:</strong> {Object.keys(template.variables).join(', ')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.is_enabled}
                        onCheckedChange={(checked) =>
                          toggleTemplateMutation.mutate({ id: template.id, isEnabled: checked })
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resetTemplateMutation.mutate(template.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isEditing && selectedTemplate && (
        <EmailTemplateEditor
          template={selectedTemplate}
          onClose={() => {
            setIsEditing(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {previewTemplate && (
        <EmailTemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </>
  );
}
