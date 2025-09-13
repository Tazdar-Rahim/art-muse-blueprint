import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  className, 
  variant = "ghost", 
  size = "sm",
  children 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleBack} 
      className={className}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {children || 'Back'}
    </Button>
  );
};