import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Phone, MessageCircle, Calendar, Send } from "lucide-react";

const ConsultationBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    whatsappNumber: "",
    preferredTime: "",
    projectDescription: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail || !formData.whatsappNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .insert({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          whatsapp_number: formData.whatsappNumber,
          preferred_time: formData.preferredTime,
          project_description: formData.projectDescription
        });

      if (error) throw error;

      toast({
        title: "Consultation Request Submitted!",
        description: "Farhana will call you back on WhatsApp within 24 hours to schedule your consultation."
      });

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        whatsappNumber: "",
        preferredTime: "",
        projectDescription: ""
      });

    } catch (error) {
      console.error("Error submitting consultation request:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Book a Consultation</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discuss your art project directly with Farhana. She'll call you back on WhatsApp to understand 
          your vision and provide personalized recommendations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Information Card */}
        <Card className="p-6 bg-gradient-gallery shadow-elegant">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-card-foreground">Why Book a Consultation?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground">Personal Discussion</h3>
                  <p className="text-sm text-muted-foreground">
                    Talk directly with Farhana about your vision, preferences, and requirements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground">Flexible Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a time that works for you, and we'll accommodate your schedule
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gallery-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-gallery-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground">WhatsApp Convenience</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive your call on WhatsApp for easy communication and file sharing
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-card-foreground mb-2">What to Expect:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 15-30 minute conversation</li>
                <li>• Discussion of your project scope</li>
                <li>• Personalized recommendations</li>
                <li>• Custom pricing if needed</li>
                <li>• Timeline planning</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Booking Form */}
        <Card className="p-6 bg-card shadow-elegant">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">Book Your Call</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include country code (e.g., +1 for US, +44 for UK)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Input
                    id="time"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                    placeholder="e.g., Weekdays after 6 PM, Saturdays morning"
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe your availability (timezone will be confirmed via WhatsApp)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                    placeholder="Briefly describe the artwork you'd like to discuss..."
                    rows={4}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg py-6"
              >
                {isSubmitting ? (
                  "Submitting Request..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Request Consultation Call
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to receive a WhatsApp call from Farhana's Art Studio 
                to discuss your project.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationBooking;