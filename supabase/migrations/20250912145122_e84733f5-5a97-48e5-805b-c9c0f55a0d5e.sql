-- Create enum types for artwork and commission categories
CREATE TYPE artwork_category AS ENUM ('original_painting', 'digital_art', 'print', 'illustration');
CREATE TYPE artwork_medium AS ENUM ('oil', 'acrylic', 'watercolor', 'digital', 'pencil', 'charcoal', 'mixed_media');
CREATE TYPE artwork_style AS ENUM ('portrait', 'landscape', 'abstract', 'still_life', 'contemporary', 'realism');
CREATE TYPE commission_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE consultation_status AS ENUM ('requested', 'scheduled', 'completed', 'cancelled');

-- Create artwork table for all art pieces
CREATE TABLE public.artwork (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category artwork_category NOT NULL,
  medium artwork_medium,
  style artwork_style,
  dimensions TEXT, -- e.g., "24x36 inches"
  price DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  image_urls TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commission packages table
CREATE TABLE public.commission_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., "Portrait Package"
  description TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  category artwork_category NOT NULL,
  style artwork_style,
  includes TEXT[], -- Array of what's included
  turnaround_days INTEGER, -- Estimated completion time
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create commission requests table
CREATE TABLE public.commission_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  package_id UUID REFERENCES public.commission_packages(id),
  custom_requirements TEXT,
  reference_images TEXT[], -- Array of uploaded reference image URLs
  voice_note_url TEXT, -- URL to uploaded voice note
  estimated_price DECIMAL(10,2),
  status commission_status DEFAULT 'pending',
  notes TEXT, -- Admin notes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultation bookings table
CREATE TABLE public.consultation_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  preferred_time TEXT, -- Customer's preferred time description
  project_description TEXT,
  status consultation_status DEFAULT 'requested',
  scheduled_datetime TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.artwork ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to artwork and packages
CREATE POLICY "Artwork is viewable by everyone" 
ON public.artwork 
FOR SELECT 
USING (true);

CREATE POLICY "Commission packages are viewable by everyone" 
ON public.commission_packages 
FOR SELECT 
USING (true);

-- Create policies for commission requests (customers can create, admin can view all)
CREATE POLICY "Anyone can create commission requests" 
ON public.commission_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view their own commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (true);

-- Create policies for consultation bookings
CREATE POLICY "Anyone can create consultation bookings" 
ON public.consultation_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view consultation bookings" 
ON public.consultation_bookings 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_artwork_updated_at
  BEFORE UPDATE ON public.artwork
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_packages_updated_at
  BEFORE UPDATE ON public.commission_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_requests_updated_at
  BEFORE UPDATE ON public.commission_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_bookings_updated_at
  BEFORE UPDATE ON public.consultation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample commission packages
INSERT INTO public.commission_packages (name, description, base_price, category, style, includes, turnaround_days, image_url) VALUES 
('Portrait Package - Basic', 'Custom portrait in your preferred medium', 150.00, 'original_painting', 'portrait', ARRAY['Initial sketch', 'One revision', 'High-resolution scan'], 14, null),
('Portrait Package - Premium', 'Detailed custom portrait with multiple revisions', 300.00, 'original_painting', 'portrait', ARRAY['Multiple sketches', 'Three revisions', 'Framing options', 'High-resolution scan'], 21, null),
('Landscape Commission', 'Custom landscape painting from your photos', 250.00, 'original_painting', 'landscape', ARRAY['Initial concept', 'Two revisions', 'Certificate of authenticity'], 28, null),
('Digital Art Commission', 'Custom digital artwork and prints', 100.00, 'digital_art', 'contemporary', ARRAY['Digital file', 'Print-ready format', 'One revision'], 10, null);

-- Insert some sample artwork
INSERT INTO public.artwork (title, description, category, medium, style, dimensions, price, is_featured, image_urls) VALUES 
('Sunset Dreams', 'A vibrant landscape capturing the golden hour', 'original_painting', 'oil', 'landscape', '16x20 inches', 180.00, true, ARRAY['/placeholder-artwork1.jpg']),
('Portrait Study #3', 'Contemporary portrait exploring light and shadow', 'original_painting', 'acrylic', 'portrait', '12x16 inches', 120.00, false, ARRAY['/placeholder-artwork2.jpg']),
('Digital Serenity', 'Modern digital composition', 'digital_art', 'digital', 'abstract', 'Digital - Various sizes', 45.00, true, ARRAY['/placeholder-artwork3.jpg']),
('Botanical Illustration', 'Detailed watercolor study', 'illustration', 'watercolor', 'realism', '9x12 inches', 85.00, false, ARRAY['/placeholder-artwork4.jpg']);