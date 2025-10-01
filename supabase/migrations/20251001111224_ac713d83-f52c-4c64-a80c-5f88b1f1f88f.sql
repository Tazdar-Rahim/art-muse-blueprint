-- Fix the RLS policy for updating orders
-- Drop the old policy that directly queries auth.users
DROP POLICY IF EXISTS "Customers can update their own orders" ON public.orders;

-- Create the corrected policy using the security definer function
CREATE POLICY "Customers can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL) AND 
  ((user_id = auth.uid()) OR (customer_email = get_current_user_email()))
);