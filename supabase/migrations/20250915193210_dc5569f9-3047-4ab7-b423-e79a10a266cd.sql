-- Fix security vulnerability in orders table
-- Remove the overly permissive SELECT policy that allows public access

DROP POLICY IF EXISTS "Users can view orders" ON public.orders;

-- Create secure policies for orders access
-- Only admins can view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (is_admin());

-- Customers can view orders matching their email (when authenticated)
CREATE POLICY "Customers can view their own orders by email" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Update the UPDATE policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;

-- Only admins can update orders
CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (is_admin());

-- Customers can update their own orders (limited scenarios)
CREATE POLICY "Customers can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Also secure the order_items table similarly
DROP POLICY IF EXISTS "Users can view order items" ON public.order_items;

-- Admins can view all order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (is_admin());

-- Customers can view their order items through order email matching
CREATE POLICY "Customers can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Update order_items UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can update order items" ON public.order_items;

-- Only admins can update order items
CREATE POLICY "Admins can update order items" 
ON public.order_items 
FOR UPDATE 
USING (is_admin());