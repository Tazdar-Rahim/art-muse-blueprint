-- Create a security definer function to get current user's email
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;

-- Create a new policy using the security definer function
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  ((user_id = auth.uid()) OR (customer_email = public.get_current_user_email()))
);

-- Also update the similar policy for order_items
DROP POLICY IF EXISTS "Customers can view their own order items" ON public.order_items;

CREATE POLICY "Customers can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND 
  (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND ((orders.user_id = auth.uid()) OR (orders.customer_email = public.get_current_user_email()))
  ))
);