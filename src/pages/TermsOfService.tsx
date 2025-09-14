import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Tazdar Art Studio</title>
        <meta name="description" content="Terms of Service for Tazdar Art Studio. Review our terms and conditions for using our services and commissioning artwork." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation activeSection="" onNavigate={() => {}} />
        
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              
              <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using Tazdar Art Studio's services, you accept and agree to be bound 
                  by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Commission Process</h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">2.1 Commission Requests</h3>
                  <p className="text-muted-foreground">
                    All commission requests must be submitted through our official channels. 
                    We reserve the right to decline any commission request.
                  </p>
                  
                  <h3 className="text-xl font-medium text-foreground">2.2 Payment Terms</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>50% deposit required to begin work</li>
                    <li>Remaining 50% due upon completion</li>
                    <li>Payment must be made within 30 days of invoice</li>
                    <li>Late payments may incur additional fees</li>
                  </ul>
                  
                  <h3 className="text-xl font-medium text-foreground">2.3 Revisions</h3>
                  <p className="text-muted-foreground">
                    Up to 3 minor revisions are included. Additional revisions may incur extra charges.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Intellectual Property</h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">3.1 Ownership</h3>
                  <p className="text-muted-foreground">
                    Upon full payment, the client receives ownership rights to the commissioned artwork. 
                    Tazdar Art Studio retains the right to display the work for portfolio purposes.
                  </p>
                  
                  <h3 className="text-xl font-medium text-foreground">3.2 Copyright</h3>
                  <p className="text-muted-foreground">
                    All original artworks remain under copyright protection. Unauthorized reproduction 
                    or distribution is prohibited.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Delivery and Shipping</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Delivery times are estimates and may vary based on complexity</li>
                  <li>Shipping costs are additional and charged separately</li>
                  <li>Risk of loss transfers to buyer upon shipping</li>
                  <li>International shipping may be subject to customs fees</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cancellation and Refunds</h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-foreground">5.1 Client Cancellation</h3>
                  <p className="text-muted-foreground">
                    Commissions may be cancelled before work begins with full refund of deposit. 
                    Once work has started, deposits are non-refundable.
                  </p>
                  
                  <h3 className="text-xl font-medium text-foreground">5.2 Artist Cancellation</h3>
                  <p className="text-muted-foreground">
                    In rare cases where we must cancel a commission, full refund will be provided.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Quality and Satisfaction</h2>
                <p className="text-muted-foreground mb-4">
                  We strive for excellence in all our work. If you're not satisfied with the final result, 
                  we'll work with you to address concerns within reasonable limits.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  Tazdar Art Studio's liability shall not exceed the total amount paid for the commissioned work. 
                  We are not liable for indirect, incidental, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Privacy</h2>
                <p className="text-muted-foreground mb-4">
                  Your privacy is important to us. Please review our Privacy Policy to understand 
                  how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify these terms at any time. Updated terms will be 
                  posted on our website with the revision date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">Tazdar Art Studio</p>
                  <p className="text-muted-foreground">Email: legal@tazdarart.com</p>
                  <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TermsOfService;