import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2, CheckCircle, XCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';

const AuthResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<'loading' | 'ready' | 'updating' | 'success' | 'error'>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const verifyResetToken = async () => {
      // Parse URL fragment parameters (Supabase sends tokens as fragments, not query params)
      const parseUrlFragment = () => {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        const params = new URLSearchParams(hash);
        return {
          access_token: params.get('access_token'),
          refresh_token: params.get('refresh_token'),
          type: params.get('type')
        };
      };

      const fragmentParams = parseUrlFragment();
      
      // Also check query parameters as fallback
      const urlParams = new URLSearchParams(window.location.search);
      const token_hash = urlParams.get('token_hash');
      const query_type = urlParams.get('type');

      console.log('Fragment params:', fragmentParams);
      console.log('Query params:', { token_hash, type: query_type });

      // Check if we have the required parameters
      if (!fragmentParams.access_token && !token_hash) {
        setStatus('error');
        setMessage('Invalid password reset link. Please request a new password reset.');
        return;
      }

      try {
        // Get current session - Supabase automatically handles the token from the URL
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Session data:', sessionData);
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setMessage('Invalid or expired reset link. Please request a new one.');
          return;
        }

        if (sessionData.session && sessionData.session.user) {
          setStatus('ready');
          setMessage('Please enter your new password below.');
        } else {
          setStatus('error');
          setMessage('Unable to verify reset link. Please try clicking the link again or request a new one.');
        }
      } catch (err) {
        console.error('Unexpected error during token verification:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    verifyResetToken();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    setStatus('updating');

    try {
      const { error } = await updatePassword(password);

      if (error) {
        console.error('Password update error:', error);
        setStatus('ready');
        setIsUpdating(false);
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setStatus('success');
      setIsUpdating(false);
      setMessage('Your password has been updated successfully!');
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully. Redirecting to sign in...",
      });

      // Redirect to sign in page after success
      setTimeout(() => {
        navigate('/customer-auth', { replace: true });
      }, 2000);

    } catch (err) {
      console.error('Unexpected error during password update:', err);
      setStatus('ready');
      setIsUpdating(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
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
        return <XCircle className="w-16 h-16 text-destructive" />;
      default:
        return <KeyRound className="w-16 h-16 text-primary" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying Reset Link';
      case 'success':
        return 'Password Updated!';
      case 'error':
        return 'Reset Link Invalid';
      default:
        return 'Set New Password';
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - Farhana Shaheen Art</title>
        <meta name="description" content="Reset your account password" />
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
                {message || 'Please wait while we verify your reset link...'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {status === 'ready' && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </form>
              )}

              {status === 'success' && (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    You will be redirected to sign in shortly.
                  </p>
                  <Button 
                    onClick={() => navigate('/customer-auth')}
                    className="w-full"
                  >
                    Continue to Sign In
                  </Button>
                </div>
              )}

              {status === 'error' && (
                <div className="text-center space-y-4">
                  <Button 
                    onClick={() => navigate('/forgot-password')}
                    className="w-full"
                  >
                    Request New Reset Link
                  </Button>
                  <Button 
                    onClick={() => navigate('/customer-auth')}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Sign In
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

export default AuthResetPassword;