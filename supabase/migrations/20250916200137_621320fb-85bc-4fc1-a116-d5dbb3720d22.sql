-- Create wishlist table for persisting user wishlists
CREATE TABLE public.wishlists (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  artwork_id uuid NOT NULL REFERENCES public.artwork(id) ON DELETE CASCADE,
  artwork_title text NOT NULL,
  artwork_price numeric,
  artwork_image_url text,
  artwork_category text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, artwork_id)
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist access
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wishlist items" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can view all wishlist items
CREATE POLICY "Admins can view all wishlist items" 
ON public.wishlists 
FOR SELECT 
USING (is_admin());

-- Create index for better performance
CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_artwork_id ON public.wishlists(artwork_id);