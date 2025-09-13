import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from "@/components/ui/back-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <div className="space-y-2">
          <BackButton to="/" variant="outline">
            Return to Home
          </BackButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
