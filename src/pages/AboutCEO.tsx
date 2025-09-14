import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ceoPortrait from "@/assets/ceo-portrait.jpg";

const AboutCEO = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-handwritten font-bold text-foreground mb-8">About the C.E.O</h1>
            
            <div className="prose prose-lg max-w-none text-foreground font-handwritten leading-relaxed space-y-6">
              <p>
                Greetings, connoisseurs of fine art, patrons of beauty, and accidental visitors who clicked the wrong link. You have stumbled upon the "About Me" page, not for the artist, but for the visionary behind the artist. The architect of ambition. The silent partner who wasn't so silent.
              </p>
              
              <p>
                My name is Dr. Tazdar Rahim, and my official title at this prestigious, newly-formed, one-employee enterprise is Chief Executive Officer. My wife, the brilliant Dr. Farhana Shaheen, holds the brush. I, however, hold the strategic framework that allows the brushing to happen.
              </p>
              
              <p>
                Allow me to illuminate my contributions through the various phases of her stellar career.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Phase 1:</h2>
              <p>
                Long before she was Dr. Farhana Shaheen, the Artist, she was just Farhana, a girl with a pencil. My role? By strategically misplacing the TV remote and finishing the last of the good biscuits, I created the fertile emotional ground from which her early, moody charcoal sketches could blossom. I was not a nuisance; I was a catalyst.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Phase 2:</h2>
              <p>
                As her talent grew, so did the need for my advanced managerial skills. I took on the critical role of Chief Critic. My feedback was invaluable, providing a layman's perspective that art school simply couldn't offer.
              </p>
              
              <div className="bg-muted/50 p-6 rounded-lg my-6 border-l-4 border-primary">
                <p className="italic">
                  Her: "Darling, what do you think of the interplay of light and shadow in this piece?"
                </p>
                <p className="italic mt-2">
                  Me: "I think it would look fantastic hanging a little to the left. Also, is that hot pink or cherry pink?"
                </p>
              </div>
              
              <p>
                See? Groundbreaking insights. I was ensuring market-readiness and interior design synergy from day one.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">Phase 3: The Digital Frontier (AKA The Website)</h2>
              <p>
                Which brings us to now. She decided to grace the world with her art online. A noble, yet technologically daunting quest. Who was there to wrestle with domain names? Who bravely battled the confusing jargon of "hosting" and "e-commerce plugins"? Who spent three hours figuring out why an image was uploading sideways?
              </p>
              
              <p>
                That, my friends, was me. This very website is not just a gift; it's a testament to my unwavering commitment, my profound patience, and my ability to follow a YouTube tutorial. It is, therefore, my magnum opus, which she has graciously decorated with her art.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4">My Official Appointment as CEO</h2>
              <p>
                After an exhaustive internal review (conducted by me), the board (also me) has unanimously concluded that this entire operation requires a steady hand at the helm.
              </p>
              
              <p>
                Therefore, effective immediately, I am nominating myself for the position of CEO. My qualifications include:
              </p>
              
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Unparalleled Expertise in making coffee at the exact moment creative frustration hits.</li>
                <li>A Proven Track Record of successfully assembling IKEA furniture to store art supplies.</li>
                <li>Advanced Logistical Prowess in carrying heavy canvases without smudging the wet paint.</li>
                <li>I am, by far, the employee of the month, every month.</li>
              </ol>
              
              <p className="mt-8">
                In conclusion, when you purchase a piece of art from this website, you are not just buying a painting. You are investing in a dream. Her dream to create, and my dream to be the supportive husband who turns that dream into a smoothly-run empire.
              </p>
              
              <p className="text-lg font-semibold mt-8">
                Happy Birthday to the true talent, my amazing wife, Dr. Farhana Shaheen. The world is finally getting to see what I've seen all along. You handle the art; I'll handle the... well, I'll handle writing pages like this.
              </p>
              
              <p className="text-right mt-8 font-semibold">
                Yours in Art, Commerce, and Unwavering Spousal Support,<br />
                Dr. Tazdar Rahim<br />
                CEO (Pending Her Approval)
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={ceoPortrait} 
                    alt="Dr. Tazdar Rahim - CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-handwritten font-bold text-lg mb-2">Dr. Tazdar Rahim</h3>
                <p className="text-sm text-muted-foreground mb-4">Chief Executive Officer</p>
                <p className="text-xs text-muted-foreground italic">
                  "Strategic Framework Architect & Strategic Extraordinary Husband"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCEO;