-- Add user_id column to orders table to link orders to authenticated users
ALTER TABLE public.orders 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies to work with user_id instead of just email matching
DROP POLICY IF EXISTS "Customers can view their own orders by email" ON public.orders;
DROP POLICY IF EXISTS "Customers can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own order items" ON public.order_items;

-- Create new policies that work with user_id
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Customers can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )  
);

CREATE POLICY "Customers can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (
      orders.user_id = auth.uid() OR 
      orders.customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);