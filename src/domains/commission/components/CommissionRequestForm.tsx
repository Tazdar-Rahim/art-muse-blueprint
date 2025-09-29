import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Mic, Send, X } from "lucide-react";
import { useActiveCommissionPackages } from "../hooks/useCommission";

interface CommissionRequestFormProps {
  selectedPackageId?: string;
  onSuccess?: () => void;
}

const CommissionRequestForm = ({ selectedPackageId, onSuccess }: CommissionRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [voiceNote, setVoiceNote] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Fetch active commission packages
  const { data: packagesResponse, isLoading: packagesLoading } = useActiveCommissionPackages();
  const packages = packagesResponse?.data || [];
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    packageId: selectedPackageId || "",
    customRequirements: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReferenceFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const handleVoiceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setVoiceNote(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid audio file for voice note.",
        variant: "destructive"
      });
    }
  };

  const removeReferenceFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeVoiceNote = () => {
    setVoiceNote(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation to match server-side security policies
    const validationErrors: string[] = [];
    
    // Required field validation with trimming
    if (!formData.customerName?.trim()) {
      validationErrors.push("Name is required");
    }
    if (!formData.customerEmail?.trim()) {
      validationErrors.push("Email is required");
    }
    
    // Length validation to prevent DoS attacks
    if (formData.customerName && formData.customerName.length > 100) {
      validationErrors.push("Name must be less than 100 characters");
    }
    if (formData.customerEmail && formData.customerEmail.length > 255) {
      validationErrors.push("Email must be less than 255 characters");
    }
    if (formData.customerPhone && formData.customerPhone.length > 20) {
      validationErrors.push("Phone number must be less than 20 characters");
    }
    if (formData.customRequirements && formData.customRequirements.length > 5000) {
      validationErrors.push("Requirements must be less than 5000 characters");
    }
    
    // Email format validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (formData.customerEmail && !emailRegex.test(formData.customerEmail.trim())) {
      validationErrors.push("Please enter a valid email address");
    }
    
    // Phone number basic validation (if provided)
    if (formData.customerPhone && formData.customerPhone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(formData.customerPhone.trim())) {
        validationErrors.push("Please enter a valid phone number");
      }
    }
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(". "),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we'll store file names - in a real app you'd upload to storage
      const referenceImageNames = referenceFiles.map(file => file.name);
      const voiceNoteUrl = voiceNote ? voiceNote.name : null;

      const { error } = await supabase
        .from('commission_requests')
        .insert({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone || null,
          package_id: formData.packageId || null,
          custom_requirements: formData.customRequirements,
          reference_images: referenceImageNames,
          voice_note_url: voiceNoteUrl
        });

      if (error) throw error;

      toast({
        title: "Commission Request Submitted!",
        description: "We'll review your request and get back to you within 24 hours."
      });

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        packageId: selectedPackageId || "",
        customRequirements: ""
      });
      setReferenceFiles([]);
      setVoiceNote(null);
      
      onSuccess?.();

    } catch (error) {
      console.error("Error submitting commission request:", error);
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
    <Card className="p-6 max-w-2xl mx-auto bg-card shadow-elegant">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-card-foreground">Commission Request</h2>
          <p className="text-muted-foreground">
            Tell us about your dream artwork and we'll bring it to life
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Your full name"
                  maxLength={100}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  placeholder="your.email@example.com"
                  maxLength={255}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                placeholder="+91 98765 43210"
                maxLength={20}
              />
            </div>
          </div>

          {/* Package Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Commission Type</h3>
            
            <div className="space-y-2">
              <Label htmlFor="package">Choose a Package (Optional)</Label>
              <Select value={formData.packageId} onValueChange={(value) => handleInputChange("packageId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a commission package or leave blank for custom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Commission</SelectItem>
                  {packagesLoading ? (
                    <SelectItem value="loading" disabled>Loading packages...</SelectItem>
                  ) : (
                    packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - ₹{pkg.base_price}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Project Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Describe Your Vision</Label>
              <Textarea
                id="requirements"
                value={formData.customRequirements}
                onChange={(e) => handleInputChange("customRequirements", e.target.value)}
                placeholder="Tell us about the artwork you'd like commissioned. Include details about style, colors, size preferences, subjects, mood, or any specific requirements..."
                rows={5}
                maxLength={5000}
              />
              <div className="text-right text-sm text-muted-foreground">
                {formData.customRequirements.length}/5000 characters
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Reference Materials</h3>
            
            {/* Reference Images */}
            <div className="space-y-3">
              <Label>Reference Photos (Max 5)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="reference-upload"
                />
                <label 
                  htmlFor="reference-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload reference images
                  </span>
                </label>
              </div>

              {referenceFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded References:</Label>
                  <div className="flex flex-wrap gap-2">
                    {referenceFiles.map((file, index) => (
                      <Badge key={index} variant="outline" className="pr-1">
                        {file.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-1"
                          onClick={() => removeReferenceFile(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Voice Note */}
            <div className="space-y-3">
              <Label>Voice Note (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  className="hidden"
                  id="voice-upload"
                />
                <label 
                  htmlFor="voice-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Mic className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Upload a voice note describing your vision
                  </span>
                </label>
              </div>

              {voiceNote && (
                <Badge variant="outline" className="pr-1">
                  🎵 {voiceNote.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-1"
                    onClick={removeVoiceNote}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300 text-lg py-6"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Commission Request
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default CommissionRequestForm;