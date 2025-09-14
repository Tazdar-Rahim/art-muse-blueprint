import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-handwritten font-bold text-foreground mb-4">
              Farhana's Art Portfolio
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Creating beautiful, custom artworks that bring your vision to life. 
              From portraits to landscapes, each piece is crafted with passion and attention to detail.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                <span>farhanashaheenart@gmail.com</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 9401244877</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://www.instagram.com/farhana_shaheen_art/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/19zVWX9f5r/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/artfarhana?s=21&t=djUD1U48Upbdby2Db2YY-w" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/?section=gallery" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  to="/?section=commission" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Commissions
                </Link>
              </li>
              <li>
                <Link 
                  to="/?section=consultation" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Custom Portraits</li>
              <li className="text-muted-foreground">Landscape Art</li>
              <li className="text-muted-foreground">Digital Illustrations</li>
              <li className="text-muted-foreground">Art Consultations</li>
              <li className="text-muted-foreground">Commissioned Pieces</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Farhana's Art Portfolio. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;