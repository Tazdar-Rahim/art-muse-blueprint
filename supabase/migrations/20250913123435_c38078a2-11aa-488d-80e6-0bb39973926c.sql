-- Create admin policies for artwork table
CREATE POLICY "Authenticated users can insert artwork" 
ON public.artwork 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update artwork" 
ON public.artwork 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete artwork" 
ON public.artwork 
FOR DELETE 
TO authenticated 
USING (true);

-- Create admin policies for commission_packages table  
CREATE POLICY "Authenticated users can insert commission packages" 
ON public.commission_packages 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update commission packages" 
ON public.commission_packages 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete commission packages" 
ON public.commission_packages 
FOR DELETE 
TO authenticated 
USING (true);

-- Create admin policies for commission_requests table
CREATE POLICY "Authenticated users can update commission requests" 
ON public.commission_requests 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete commission requests" 
ON public.commission_requests 
FOR DELETE 
TO authenticated 
USING (true);

-- Create admin policies for consultation_bookings table  
CREATE POLICY "Authenticated users can update consultation bookings" 
ON public.consultation_bookings 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete consultation bookings" 
ON public.consultation_bookings 
FOR DELETE 
TO authenticated 
USING (true);