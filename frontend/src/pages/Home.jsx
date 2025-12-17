import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X, Shield, TrendingUp, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-secondary/20">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-primary leading-[1.1]">
              The Resume That Gets You Shortlisted.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Start with a free ATS evaluation to see how your resume performs across automated screening, recruiter triage, and internal review layers. Then upgrade to a 24-hour first-delivery rebuild designed for Q1 2026 hiring standards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/upload">
                <Button size="lg" className="h-14 px-8 text-base bg-primary hover:bg-primary/90 rounded-none w-full sm:w-auto">
                  Evaluate My Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-base bg-transparent border-primary/20 hover:bg-primary/5 rounded-none w-full sm:w-auto"
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Career Levels
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section (Anonymized) */}
      <section className="py-24 bg-background">
        <div className="container max-w-5xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-16">The Executive Standard</h2>
          
          <div className="overflow-hidden border rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b">
                  <th className="p-6 font-semibold text-muted-foreground w-1/3">Feature</th>
                  <th className="p-6 font-bold text-primary bg-primary/5 w-1/3 text-center border-x border-primary/10">ResumeShortlist</th>
                  <th className="p-6 font-semibold text-muted-foreground w-1/3 text-center">Standard Templates / AI Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-6 font-medium">Focus Audience</td>
                  <td className="p-6 text-center bg-primary/5 border-x border-primary/10 font-medium">All Career Levels (Entry to C-Suite)</td>
                  <td className="p-6 text-center text-muted-foreground">Entry Level / General</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Design Aesthetic</td>
                  <td className="p-6 text-center bg-primary/5 border-x border-primary/10 font-medium">Minimalist & Authoritative</td>
                  <td className="p-6 text-center text-muted-foreground">Flashy & Decorative</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Analysis Depth</td>
                  <td className="p-6 text-center bg-primary/5 border-x border-primary/10 font-medium">Deep Semantic Analysis</td>
                  <td className="p-6 text-center text-muted-foreground">Basic Keyword Matching</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium">Turnaround</td>
                  <td className="p-6 text-center bg-primary/5 border-x border-primary/10 font-medium">24-Hour Precision Rebuild</td>
                  <td className="p-6 text-center text-muted-foreground">Instant (Generic Templates)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-secondary/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Select Your Career Level
            </h2>
            <p className="text-lg text-muted-foreground">
              Every project is executed directly by our elite team using proven frameworks. 
              Client slots are intentionally limited.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
             {/* Entry */}
             <Card className="bg-background border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif">Entry Level</CardTitle>
                    <div className="text-2xl font-bold text-primary">$50</div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">Emerging professionals & graduates.</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Clean Launch</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Transferable Skills</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> 24-Hour Delivery</li>
                    </ul>
                </CardContent>
             </Card>

             {/* Mid */}
             <Card className="bg-background border-none shadow-sm hover:shadow-md transition-all relative">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-bl-md font-bold uppercase">Popular</div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif">Mid Level</CardTitle>
                    <div className="text-2xl font-bold text-primary">$100</div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">Established professionals & specialists.</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Growth Trajectory</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Measurable Wins</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> 24-Hour Delivery</li>
                    </ul>
                </CardContent>
             </Card>

             {/* Senior */}
             <Card className="bg-background border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif">Senior Level</CardTitle>
                    <div className="text-2xl font-bold text-primary">$200</div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">Team leads & experienced contributors.</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Org Impact</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Dept Influence</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> 24-Hour Delivery</li>
                    </ul>
                </CardContent>
             </Card>

             {/* Executive */}
             <Card className="bg-background border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif">Executive</CardTitle>
                    <div className="text-2xl font-bold text-primary">$400</div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">Directors, VPs, Senior Decision Makers.</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Strategic Ops</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Transformation</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> 24-Hour Delivery</li>
                    </ul>
                </CardContent>
             </Card>

             {/* C-Suite */}
             <Card className="bg-background border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-serif">C-Suite</CardTitle>
                    <div className="text-xl font-bold text-primary">$800</div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p className="text-muted-foreground">CEOs, CFOs, Enterprise Leaders.</p>
                    <ul className="space-y-2">
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Legacy Leadership</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> Visionary Direction</li>
                        <li className="flex gap-2"><Check className="h-4 w-4 text-green-500 shrink-0"/> 24-Hour Delivery</li>
                    </ul>
                </CardContent>
             </Card>
          </div>

          <div className="mt-12 text-center">
            <Link to="/upload">
                <Button size="lg" className="h-16 px-12 text-lg">
                    Start Process
                </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
