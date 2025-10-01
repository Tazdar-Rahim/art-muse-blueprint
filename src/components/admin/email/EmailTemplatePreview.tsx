import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmailTemplatePreviewProps {
  template: any;
  onClose: () => void;
}

export function EmailTemplatePreview({ template, onClose }: EmailTemplatePreviewProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name} - Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-sm text-muted-foreground mb-1">Subject:</p>
            <p className="font-medium">{template.subject}</p>
          </div>

          <div className="border rounded-lg p-6 bg-muted/30">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: template.html_content }}
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Category:</strong> {template.category}</p>
            <p><strong>Trigger:</strong> {template.description}</p>
            {template.variables && (
              <p><strong>Variables:</strong> {Object.keys(template.variables).join(', ')}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
