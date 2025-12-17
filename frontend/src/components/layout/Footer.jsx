import React from "react";
import { cn } from "../../lib/utils";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-secondary/30 py-12 md:py-24 lg:py-32">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h4 className="font-serif text-lg font-bold text-primary">ResumeShortlist</h4>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            The gold standard for resume optimization and ATS compliance. 
            Designed for all career levels.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Methodology</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            <li><a href="mailto:info@resumeshortlist.app" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ResumeShortlist. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
