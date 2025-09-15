import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartWishlistProvider } from "@/contexts/CartWishlistContext";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";

// Eager load critical pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";

// Lazy load non-critical pages
const Login = lazy(() => import("./pages/Login"));
const CustomerAuth = lazy(() => import("./pages/CustomerAuth"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Payment = lazy(() => import("./pages/Payment"));
const AboutCEO = lazy(() => import("./pages/AboutCEO"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

// Lazy load admin components
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ArtworkManagement = lazy(() => import("./pages/admin/ArtworkManagement"));
const CommissionPackages = lazy(() => import("./pages/admin/CommissionPackages"));
const CommissionRequests = lazy(() => import("./pages/admin/CommissionRequests"));
const ConsultationBookings = lazy(() => import("./pages/admin/ConsultationBookings"));
const Orders = lazy(() => import("./pages/admin/Orders"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartWishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/customer-auth" element={<CustomerAuth />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="artwork" element={<ArtworkManagement />} />
                  <Route path="packages" element={<CommissionPackages />} />
                  <Route path="requests" element={<CommissionRequests />} />
                  <Route path="bookings" element={<ConsultationBookings />} />
                  <Route path="orders" element={<Orders />} />
                </Route>
                <Route path="/about-ceo" element={<AboutCEO />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </BrowserRouter>
        </CartWishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
