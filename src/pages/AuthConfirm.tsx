import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const AuthConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const next = searchParams.get('next') || '/my-orders';

      if (!token_hash || type !== 'email') {
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email for a valid confirmation link.');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'email'
        });

        if (error) {
          console.error('Email confirmation error:', error);
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            setStatus('expired');
            setMessage('This confirmation link has expired. Please request a new one.');
          } else {
            setStatus('error');
            setMessage(error.message || 'Failed to confirm email. Please try again.');
          }
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Your email has been confirmed successfully!');
          
          toast({
            title: "Email Confirmed",
            description: "Your account is now active. Redirecting...",
          });

          // Redirect after a short delay to show success message
          setTimeout(() => {
            navigate(next, { replace: true });
          }, 2000);
        }
      } catch (err) {
        console.error('Unexpected error during email confirmation:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate, toast]);

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to resend confirmation.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await resendConfirmation(email);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend confirmation email.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email Sent",
        description: "A new confirmation email has been sent to your inbox.",
      });
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="w-16 h-16 text-destructive" />;
      default:
        return <Mail className="w-16 h-16 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirming Your Email';
      case 'success':
        return 'Email Confirmed!';
      case 'expired':
        return 'Link Expired';
      case 'error':
        return 'Confirmation Failed';
      default:
        return 'Email Confirmation';
    }
  };

  return (
    <>
      <Helmet>
        <title>Email Confirmation - Farhana Shaheen Art</title>
        <meta name="description" content="Confirm your email address to activate your account" />
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
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                {getIcon()}
              </div>
              <CardTitle className="text-2xl">{getTitle()}</CardTitle>
              <CardDescription className="text-base">
                {message || 'Please wait while we confirm your email address...'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {status === 'expired' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleResendConfirmation}
                    className="w-full"
                    disabled={!email.trim()}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Confirmation Email
                  </Button>
                </div>
              )}

              {status === 'success' && (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    You will be redirected to your account shortly.
                  </p>
                  <Button 
                    onClick={() => navigate('/my-orders')}
                    className="w-full"
                  >
                    Continue to My Orders
                  </Button>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center">
                  <Button 
                    onClick={() => navigate('/customer-auth')}
                    className="w-full"
                  >
                    Go to Sign In
                  </Button>
                </div>
              )}

              {status === 'loading' && (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    This may take a few moments...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AuthConfirm;