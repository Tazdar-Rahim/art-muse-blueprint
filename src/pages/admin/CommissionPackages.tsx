import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BackButton } from '@/components/ui/back-button';

interface CommissionPackage {
  id: string;
  name: string;
  description: string;
  category: string;
  style: string | null;
  base_price: number;
  turnaround_days: number | null;
  includes: string[] | null;
  image_url: string | null;
  is_active: boolean | null;
}

const CommissionPackages = () => {
  const [packages, setPackages] = useState<CommissionPackage[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CommissionPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    style: '',
    base_price: '',
    turnaround_days: '',
    includes: '',
    image_url: '',
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('commission_packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch packages',
        variant: 'destructive',
      });
    } else {
      setPackages(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const includes = formData.includes
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const packageData = {
      name: formData.name,
      description: formData.description,
      category: formData.category as 'original_painting' | 'digital_art' | 'print' | 'illustration',
      style: formData.style as 'portrait' | 'landscape' | 'abstract' | 'still_life' | 'contemporary' | 'realism' | null,
      base_price: parseFloat(formData.base_price),
      turnaround_days: formData.turnaround_days ? parseInt(formData.turnaround_days) : null,
      includes: includes.length > 0 ? includes : null,
      image_url: formData.image_url || null,
      is_active: formData.is_active,
    };

    let result;
    if (editingPackage) {
      result = await supabase
        .from('commission_packages')
        .update(packageData)
        .eq('id', editingPackage.id);
    } else {
      result = await supabase
        .from('commission_packages')
        .insert([packageData]);
    }

    if (result.error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingPackage ? 'update' : 'create'} package`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Package ${editingPackage ? 'updated' : 'created'} successfully`,
      });
      setIsDialogOpen(false);
      resetForm();
      fetchPackages();
    }
  };

  const handleEdit = (pkg: CommissionPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      category: pkg.category,
      style: pkg.style || '',
      base_price: pkg.base_price.toString(),
      turnaround_days: pkg.turnaround_days?.toString() || '',
      includes: pkg.includes?.join(', ') || '',
      image_url: pkg.image_url || '',
      is_active: pkg.is_active !== false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('commission_packages')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete package',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Package deleted successfully',
      });
      fetchPackages();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      style: '',
      base_price: '',
      turnaround_days: '',
      includes: '',
      image_url: '',
      is_active: true,
    });
    setEditingPackage(null);
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-handwritten font-bold">Commission Packages</h1>
          <p className="text-muted-foreground">Manage your commission service packages</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPackage ? 'Edit' : 'Add'} Package</DialogTitle>
              <DialogDescription>
                {editingPackage ? 'Update' : 'Create new'} commission package
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original_painting">Original Painting</SelectItem>
                      <SelectItem value="digital_art">Digital Art</SelectItem>
                      <SelectItem value="print">Print</SelectItem>
                      <SelectItem value="illustration">Illustration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Select value={formData.style} onValueChange={(value) => setFormData({...formData, style: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                      <SelectItem value="impressionist">Impressionist</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price (₹) *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="turnaround_days">Turnaround Days</Label>
                <Input
                  id="turnaround_days"
                  type="number"
                  value={formData.turnaround_days}
                  onChange={(e) => setFormData({...formData, turnaround_days: e.target.value})}
                  placeholder="e.g., 14"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the package..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="includes">Includes (comma-separated)</Label>
                <Textarea
                  id="includes"
                  value={formData.includes}
                  onChange={(e) => setFormData({...formData, includes: e.target.value})}
                  placeholder="e.g., Digital files, Print copy, Revision rounds"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active Package</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPackage ? 'Update' : 'Create'} Package
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle className="text-lg">{pkg.name}</CardTitle>
              <CardDescription>{pkg.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xl font-bold text-amber-600">₹{pkg.base_price}</p>
                {pkg.turnaround_days && (
                  <p className="text-sm text-muted-foreground">{pkg.turnaround_days} days turnaround</p>
                )}
                <p className="text-sm">{pkg.description}</p>
                <div className="flex gap-2 text-xs pt-2">
                  <span className={`px-2 py-1 rounded ${
                    pkg.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pkg.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommissionPackages;