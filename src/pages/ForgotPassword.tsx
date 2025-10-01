import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        console.error('Password reset error:', error);
        
        // Check if it's an SMTP configuration error
        const isSmtpError = error.message?.includes('Error sending recovery email') || 
                           error.status === 500;
        
        toast({
          title: "Reset Failed",
          description: isSmtpError 
            ? "Email service is not configured. Please contact the administrator or try again later."
            : error.message || "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email Sent",
          description: "Check your inbox for password reset instructions.",
        });
      }
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    const { error } = await resetPassword(email);
    
    if (error) {
      const isSmtpError = error.message?.includes('Error sending recovery email') || 
                         error.status === 500;
      
      toast({
        title: "Resend Failed",
        description: isSmtpError 
          ? "Email service is not configured. Please contact the administrator."
          : error.message || "Failed to resend reset email.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email Sent",
        description: "A new reset email has been sent to your inbox.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Farhana Shaheen Art</title>
        <meta name="description" content="Reset your account password by entering your email address" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/customer-auth')}
            className="mb-6 hover:bg-background/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>

          <Card className="border-2 border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                {emailSent ? 'Check Your Email' : 'Reset Password'}
              </CardTitle>
              <CardDescription className="text-base">
                {emailSent 
                  ? 'We\'ve sent password reset instructions to your email address.'
                  : 'Enter your email address and we\'ll send you a link to reset your password.'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!emailSent ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Remember your password?{' '}
                      <Link 
                        to="/customer-auth" 
                        className="text-primary hover:underline font-medium"
                      >
                        Sign in instead
                      </Link>
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      We sent a password reset link to:
                    </p>
                    <p className="font-medium">{email}</p>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>What to do next:</strong>
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>1. Check your email inbox</li>
                      <li>2. Click the reset link in the email</li>
                      <li>3. Enter your new password</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleResendEmail}
                      variant="outline" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Resending...
                        </>
                      ) : (
                        'Resend Email'
                      )}
                    </Button>

                    <Button 
                      onClick={() => navigate('/customer-auth')}
                      variant="ghost" 
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try a different email address.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;