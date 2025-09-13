import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { addFeaturedArtworks } from '../scripts/add-featured-artworks';
import { Plus, CheckCircle } from 'lucide-react';

export const AddFeaturedArtworks: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { toast } = useToast();

  const handleAddArtworks = async () => {
    setIsAdding(true);
    
    try {
      const result = await addFeaturedArtworks();
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Featured winter artworks have been added to your collection.',
        });
        setIsAdded(true);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add featured artworks',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while adding artworks',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (isAdded) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Artworks Added!</CardTitle>
          </div>
          <CardDescription>
            10 featured winter watercolor artworks have been successfully added to your collection.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Add Featured Artworks</CardTitle>
        <CardDescription>
          Add 10 beautiful winter watercolor paintings to your artwork collection as featured pieces.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This will add:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>10 winter-themed watercolor paintings</li>
              <li>Priced between ₹2,200 - ₹5,000</li>
              <li>All marked as featured artworks</li>
              <li>Professional descriptions and details</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleAddArtworks} 
            disabled={isAdding}
            className="w-full"
          >
            {isAdding ? (
              'Adding Artworks...'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Featured Artworks
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};