import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Instagram, Facebook, Twitter, Palette, Search, ShoppingBag } from "lucide-react";

interface ContactSectionProps {
  onCommissionClick: () => void;
  onConsultationClick: () => void;
}

const ContactSection = ({
  onCommissionClick,
  onConsultationClick,
}: ContactSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 pt-24 pb-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">
          Let's discuss your next art project or answer any questions you might have
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <Card className="p-8 space-y-6 bg-gradient-gallery shadow-elegant">
          <h2 className="text-2xl font-bold text-card-foreground">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">farhanashaheenart@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+91 9401244877</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-4">Follow My Art Journey</h3>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-12 h-12 p-0"
                onClick={() => window.open('https://www.instagram.com/farhana_shaheen_art/', '_blank')}
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-12 h-12 p-0"
                onClick={() => window.open('https://www.facebook.com/farhana.shaheen.12', '_blank')}
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-12 h-12 p-0"
                onClick={() => window.open('https://x.com/artfarhana', '_blank')}
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-8 bg-card shadow-elegant">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start h-16 text-left" 
              onClick={onCommissionClick}
            >
              <Palette className="w-6 h-6 mr-4 text-primary" />
              <div>
                <div className="font-semibold">Request Commission</div>
                <div className="text-sm text-muted-foreground">Start a custom artwork project</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-16 text-left" 
              onClick={onConsultationClick}
            >
              <Phone className="w-6 h-6 mr-4 text-accent" />
              <div>
                <div className="font-semibold">Book Consultation</div>
                <div className="text-sm text-muted-foreground">Discuss your project via WhatsApp</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-16 text-left" 
              onClick={() => navigate("/login")}
            >
              <Search className="w-6 h-6 mr-4 text-gallery-gold" />
              <div>
                <div className="font-semibold">Admin Portal</div>
                <div className="text-sm text-muted-foreground">Manage content and orders</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-16 text-left" 
              onClick={() => navigate("/customer-auth")}
            >
              <ShoppingBag className="w-6 h-6 mr-4 text-primary" />
              <div>
                <div className="font-semibold">My Orders</div>
                <div className="text-sm text-muted-foreground">Track your purchases & orders</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactSection;