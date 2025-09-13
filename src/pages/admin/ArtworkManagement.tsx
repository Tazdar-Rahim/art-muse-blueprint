import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/ui/file-upload';
import { AddFeaturedArtworks } from '@/components/AddFeaturedArtworks';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { uploadMultipleFiles } from '@/lib/storage';
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Artwork {
  id: string;
  title: string;
  description: string | null;
  category: string;
  medium: string | null;
  style: string | null;
  price: number | null;
  dimensions: string | null;
  image_urls: string[] | null;
  is_featured: boolean | null;
  is_available: boolean | null;
}

const ArtworkManagement = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    style: '',
    price: '',
    dimensions: '',
    image_urls: [] as string[],
    is_featured: false,
    is_available: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    const { data, error } = await supabase
      .from('artwork')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch artworks',
        variant: 'destructive',
      });
    } else {
      setArtworks(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    let imageUrls = [...formData.image_urls];

    // Upload new files if any
    if (uploadedFiles.length > 0) {
      try {
        const uploadResults = await uploadMultipleFiles(
          uploadedFiles,
          'artwork-images',
          `artwork-${Date.now()}`
        );

        const successfulUploads = uploadResults.filter(result => !result.error);
        const failedUploads = uploadResults.filter(result => result.error);

        if (failedUploads.length > 0) {
          toast({
            title: 'Partial Upload Error',
            description: `${failedUploads.length} image(s) failed to upload`,
            variant: 'destructive',
          });
        }

        // Add successful upload URLs
        imageUrls = [...imageUrls, ...successfulUploads.map(result => result.url)];
      } catch (error) {
        toast({
          title: 'Upload Error',
          description: 'Failed to upload images',
          variant: 'destructive',
        });
        setIsUploading(false);
        return;
      }
    }

    const artworkData = {
      title: formData.title,
      description: formData.description || null,
      category: formData.category as 'original_painting' | 'digital_art' | 'print' | 'illustration',
      medium: formData.medium as 'oil' | 'acrylic' | 'watercolor' | 'digital' | 'pencil' | 'charcoal' | 'mixed_media' | null,
      style: formData.style as 'portrait' | 'landscape' | 'abstract' | 'still_life' | 'contemporary' | 'realism' | null,
      price: formData.price ? parseFloat(formData.price) : null,
      dimensions: formData.dimensions || null,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
      is_featured: formData.is_featured,
      is_available: formData.is_available,
    };

    let result;
    if (editingArtwork) {
      result = await supabase
        .from('artwork')
        .update(artworkData)
        .eq('id', editingArtwork.id);
    } else {
      result = await supabase
        .from('artwork')
        .insert([artworkData]);
    }

    setIsUploading(false);

    if (result.error) {
      toast({
        title: 'Error',
        description: `Failed to ${editingArtwork ? 'update' : 'create'} artwork`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Artwork ${editingArtwork ? 'updated' : 'created'} successfully`,
      });
      setIsDialogOpen(false);
      resetForm();
      fetchArtworks();
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description || '',
      category: artwork.category,
      medium: artwork.medium || '',
      style: artwork.style || '',
      price: artwork.price?.toString() || '',
      dimensions: artwork.dimensions || '',
      image_urls: artwork.image_urls || [],
      is_featured: artwork.is_featured || false,
      is_available: artwork.is_available !== false,
    });
    setUploadedFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('artwork')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete artwork',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Artwork deleted successfully',
      });
      fetchArtworks();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      medium: '',
      style: '',
      price: '',
      dimensions: '',
      image_urls: [],
      is_featured: false,
      is_available: true,
    });
    setUploadedFiles([]);
    setEditingArtwork(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-handwritten font-bold">Artwork Management</h1>
          <p className="text-muted-foreground">Manage your artwork collection</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArtwork ? 'Edit' : 'Add'} Artwork</DialogTitle>
              <DialogDescription>
                {editingArtwork ? 'Update' : 'Create new'} artwork details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                  <Label htmlFor="medium">Medium</Label>
                  <Select value={formData.medium} onValueChange={(value) => setFormData({...formData, medium: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oil">Oil</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="acrylic">Acrylic</SelectItem>
                      <SelectItem value="pencil">Pencil</SelectItem>
                      <SelectItem value="charcoal">Charcoal</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                    placeholder="e.g., 24x36 inches"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the artwork..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_upload">Images</Label>
                <FileUpload
                  onFilesChange={setUploadedFiles}
                  onUrlsChange={(urls) => setFormData({...formData, image_urls: urls})}
                  existingUrls={formData.image_urls}
                  maxFiles={5}
                />
                {formData.image_urls.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.image_urls.length} image(s) selected
                  </p>
                )}
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                  />
                  <Label htmlFor="is_available">Available</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : (editingArtwork ? 'Update' : 'Create')} Artwork
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUploading}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Add Featured Artworks Component */}
      {artworks.length === 0 && (
        <div className="flex justify-center">
          <AddFeaturedArtworks />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <Card key={artwork.id}>
            <CardHeader>
              <CardTitle className="text-lg">{artwork.title}</CardTitle>
              <CardDescription>{artwork.category}</CardDescription>
            </CardHeader>
            <CardContent>
              {artwork.image_urls && artwork.image_urls.length > 0 && (
                <div className="mb-4">
                  <img
                    src={artwork.image_urls[0]}
                    alt={artwork.title}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {artwork.image_urls.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +{artwork.image_urls.length - 1} more image(s)
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                {artwork.price && (
                  <p className="text-xl font-bold text-amber-600">₹{artwork.price}</p>
                )}
                {artwork.dimensions && (
                  <p className="text-sm text-muted-foreground">{artwork.dimensions}</p>
                )}
                <div className="flex gap-2 text-xs">
                  {artwork.is_featured && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">Featured</span>
                  )}
                  <span className={`px-2 py-1 rounded ${
                    artwork.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {artwork.is_available ? 'Available' : 'Sold'}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(artwork)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(artwork.id)}>
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

export default ArtworkManagement;