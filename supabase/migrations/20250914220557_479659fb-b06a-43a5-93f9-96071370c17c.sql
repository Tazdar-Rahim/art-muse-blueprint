-- Phase 1: CRITICAL SECURITY FIXES

-- 1. Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Create security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 3. Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- 4. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert user roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (public.is_admin());

-- 5. Fix CRITICAL RLS policies for customer data protection

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view their own commission requests" ON public.commission_requests;
DROP POLICY IF EXISTS "Anyone can view consultation bookings" ON public.consultation_bookings;

-- Create secure policies for commission_requests
CREATE POLICY "Admins can view all commission requests" 
ON public.commission_requests 
FOR SELECT 
USING (public.is_admin());

-- Create secure policies for consultation_bookings  
CREATE POLICY "Admins can view all consultation bookings" 
ON public.consultation_bookings 
FOR SELECT 
USING (public.is_admin());

-- 6. Fix artwork management policies
DROP POLICY IF EXISTS "Authenticated users can delete artwork" ON public.artwork;
DROP POLICY IF EXISTS "Authenticated users can insert artwork" ON public.artwork;
DROP POLICY IF EXISTS "Authenticated users can update artwork" ON public.artwork;

CREATE POLICY "Admins can delete artwork" 
ON public.artwork 
FOR DELETE 
USING (public.is_admin());

CREATE POLICY "Admins can insert artwork" 
ON public.artwork 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update artwork" 
ON public.artwork 
FOR UPDATE 
USING (public.is_admin());

-- 7. Fix commission packages policies
DROP POLICY IF EXISTS "Authenticated users can delete commission packages" ON public.commission_packages;
DROP POLICY IF EXISTS "Authenticated users can insert commission packages" ON public.commission_packages;
DROP POLICY IF EXISTS "Authenticated users can update commission packages" ON public.commission_packages;

CREATE POLICY "Admins can delete commission packages" 
ON public.commission_packages 
FOR DELETE 
USING (public.is_admin());

CREATE POLICY "Admins can insert commission packages" 
ON public.commission_packages 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update commission packages" 
ON public.commission_packages 
FOR UPDATE 
USING (public.is_admin());

-- 8. Add trigger for updated_at on user_roles
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();