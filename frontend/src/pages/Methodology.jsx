import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, Shield, TrendingUp, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const Methodology = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-secondary/20">
        <div className="container max-w-4xl text-center space-y-6">
          <Badge variant="outline" className="bg-background">Our Science</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            Deep Semantic Analysis vs. Keyword Matching
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Why 75% of qualified resumes are rejected by ATS, and how we engineer your document to bypass these filters while impressing human readers.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-24">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold text-primary">The "Keyword Stuffing" Fallacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most resume services (and AI tools) simply stuff your document with buzzwords. This might pass a basic 2015-era filter, but modern semantic search engines used by Fortune 500s penalize this behavior.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Recruiters don't search for "Leadership" anymore. They search for "Leadership in high-growth environments" or "Turnaround leadership." Context matters.
              </p>
            </div>
            <div className="p-8 bg-secondary/30 rounded-lg border border-border">
              <h3 className="font-bold mb-4 text-destructive">Legacy Approach (Failed)</h3>
              <div className="space-y-2 font-mono text-sm bg-background p-4 rounded border text-muted-foreground">
                <span className="block opacity-50">Keywords: Leadership, Sales, Agile, Management, Strategy...</span>
                <span className="block text-destructive font-bold mt-2">Result: Generic, Low-Ranking</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mt-24">
             <div className="p-8 bg-secondary/30 rounded-lg border border-border order-2 md:order-1">
              <h3 className="font-bold mb-4 text-green-700">ResumeShortlist Approach</h3>
              <div className="space-y-2 font-mono text-sm bg-background p-4 rounded border text-muted-foreground">
                <span className="block text-primary">"Orchestrated $50M turnaround strategy (Agile) across 3 global regions."</span>
                <span className="block text-green-600 font-bold mt-2">Result: High Relevance + Authority</span>
              </div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-3xl font-serif font-bold text-primary">Semantic Context & Impact</h2>
              <p className="text-muted-foreground leading-relaxed">
                We rewrite your bullets to bind skills to outcomes. This signals to the AI that you didn't just *do* the task, you *mastered* it. 
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Hard-coded quantifiable metrics ($, %, time saved)</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Active voice transformation (Led vs. Managed)</span>
                </li>
                <li className="flex gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>Executive narrative structuring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container">
          <h2 className="text-3xl font-serif font-bold mb-6">See It In Action</h2>
          <Link to="/upload">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 font-bold">
              Run Free Semantic Audit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Methodology;
