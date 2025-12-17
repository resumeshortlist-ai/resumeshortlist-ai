import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              ResumeShortlist
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/methodology" className="hover:text-primary transition-colors">Methodology</Link>
          <Link to="/results" className="hover:text-primary transition-colors">Results</Link>
          <Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/upload" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Get Evaluated
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
