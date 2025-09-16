import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Palette, ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";

const CustomerAuth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { isCustomer } = useCustomerAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as customer
  React.useEffect(() => {
    if (user && isCustomer) {
      navigate("/my-orders");
    }
  }, [user, isCustomer, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      let errorMessage = error.message;
      let errorTitle = "Error";
      
      // Handle specific error cases
      if (error.message === "Invalid login credentials") {
        errorTitle = "Sign In Failed";
        errorMessage = "Please check your email and password. If you just signed up, make sure to confirm your email address first.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      navigate("/my-orders");
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await signUp(email, password);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Check if user was created or already exists
      if (data?.user && !data.session) {
        toast({
          title: "Check Your Email!",
          description: "We've sent you a confirmation link. Please check your email and click the link to verify your account before signing in.",
        });
      } else if (data?.session) {
        toast({
          title: "Account created!",
          description: "You have been signed up and logged in successfully.",
        });
        navigate("/my-orders");
      } else {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account before signing in.",
        });
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Creative Back Button */}
        <div className="flex justify-start">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="font-handwritten border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow transition-all duration-200 rounded-lg rotate-[-1deg] hover:rotate-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery ✨
          </Button>
        </div>

        {/* Creative Logo Section */}
        <div className="text-center relative">
          <div className="relative inline-block">
            {/* Decorative elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-400 rounded-full animate-pulse" />
            <div className="absolute -top-1 -right-3 w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-75" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150" />
            
            <div className="flex items-center justify-center gap-4 mb-4 bg-white dark:bg-zinc-800 p-6 rounded-2xl border-2 border-zinc-900 dark:border-white mobile-shadow shadow-zinc-900 dark:shadow-white rotate-[1deg]">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-zinc-900 dark:border-white mobile-shadow shadow-zinc-900 dark:shadow-white animate-bounce">
                <Palette className="w-8 h-8 text-zinc-900" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold font-handwritten text-zinc-900 dark:text-white rotate-[-1deg]">
                  Farhana's
                </h1>
                <p className="text-lg font-handwritten text-orange-600 dark:text-orange-400 rotate-[1deg]">
                  Art Studio ✨
                </p>
                <div className="w-20 h-1 bg-amber-400 rounded-full mt-1 rotate-[-2deg]" />
              </div>
            </div>
          </div>
          <p className="font-handwritten text-lg text-zinc-600 dark:text-zinc-400 rotate-[-0.5deg]">
            Customer Portal 🎨
          </p>
        </div>

        {/* Creative Auth Card */}
        <Card className="border-2 border-zinc-900 dark:border-white mobile-shadow shadow-zinc-900 dark:shadow-white rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-handwritten text-2xl text-zinc-900 dark:text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Welcome Artist Lover!
              <Sparkles className="w-6 h-6 text-amber-500" />
            </CardTitle>
            <CardDescription className="font-handwritten text-base text-zinc-600 dark:text-zinc-400">
              Sign in to track your orders or create an account to get started.
              <br />
              <span className="text-sm text-orange-600 dark:text-orange-400 mt-2 block font-medium">
                📧 New users: Check your email after signing up to confirm your account.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-amber-100 dark:bg-zinc-700 border-2 border-zinc-900 dark:border-white rounded-lg">
                <TabsTrigger 
                  value="signin" 
                  className="font-handwritten data-[state=active]:bg-amber-400 data-[state=active]:text-zinc-900 data-[state=active]:border-2 data-[state=active]:border-zinc-900 data-[state=active]:shadow-sm"
                >
                  Sign In 🔑
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="font-handwritten data-[state=active]:bg-amber-400 data-[state=active]:text-zinc-900 data-[state=active]:border-2 data-[state=active]:border-zinc-900 data-[state=active]:shadow-sm"
                >
                  Sign Up ✨
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2 relative rotate-[0.5deg]">
                    <Label htmlFor="email" className="font-handwritten text-base text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="font-handwritten border-2 border-zinc-900 dark:border-white focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-zinc-800 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2 relative rotate-[-0.5deg]">
                    <Label htmlFor="password" className="font-handwritten text-base text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="font-handwritten border-2 border-zinc-900 dark:border-white focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-zinc-800 rounded-lg"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-handwritten text-lg border-2 border-zinc-900 dark:border-white bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-zinc-900 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow transition-all duration-200 rounded-lg rotate-[0.5deg] hover:rotate-0" 
                    disabled={loading}
                  >
                    {loading ? "Signing in... 🎨" : "Sign In & Explore! 🚀"}
                  </Button>
                  
                  <div className="text-center">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm font-handwritten text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2 relative rotate-[-0.5deg]">
                    <Label htmlFor="signup-name" className="font-handwritten text-base text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="font-handwritten border-2 border-zinc-900 dark:border-white focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-zinc-800 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2 relative rotate-[0.5deg]">
                    <Label htmlFor="signup-email" className="font-handwritten text-base text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="font-handwritten border-2 border-zinc-900 dark:border-white focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-zinc-800 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2 relative rotate-[-0.5deg]">
                    <Label htmlFor="signup-password" className="font-handwritten text-base text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Create Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a secure password"
                      className="font-handwritten border-2 border-zinc-900 dark:border-white focus:border-amber-500 focus:ring-amber-500 bg-white dark:bg-zinc-800 rounded-lg"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full font-handwritten text-lg border-2 border-zinc-900 dark:border-white bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-zinc-900 mobile-shadow shadow-zinc-900 dark:shadow-white mobile-hover-shadow transition-all duration-200 rounded-lg rotate-[-0.5deg] hover:rotate-0" 
                    disabled={loading}
                  >
                    {loading ? "Creating account... 🎨" : "Join the Art Community! 🎭"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Decorative footer */}
        <div className="text-center">
          <p className="font-handwritten text-sm text-zinc-500 dark:text-zinc-400 rotate-[0.5deg]">
            🎨 Where Art Meets Heart 🎨
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;