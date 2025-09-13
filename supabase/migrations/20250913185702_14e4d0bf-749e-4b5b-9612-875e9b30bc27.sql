-- Create storage bucket for artwork images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artwork-images', 'artwork-images', true);

-- Create RLS policies for artwork images bucket
CREATE POLICY "Anyone can view artwork images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'artwork-images');

CREATE POLICY "Authenticated users can upload artwork images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'artwork-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update artwork images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'artwork-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete artwork images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'artwork-images' AND auth.uid() IS NOT NULL);