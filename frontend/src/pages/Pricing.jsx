import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-secondary/20">
        <div className="container max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            Transparent, Flat-Rate Pricing.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Professional positioning shouldn't be hidden behind a "Call for Quote" button. 
            Select your career stage. 24-hour turnaround guaranteed.
          </p>
        </div>
      </section>

      {/* Pricing Grid - Reused from Home but standalone page */}
      <section className="py-24">
        <div className="container">
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

          <div className="mt-16 bg-secondary/30 p-8 rounded-lg text-center max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Need something custom?</h3>
            <p className="text-muted-foreground mb-4">
                We offer bespoke packages for board placements, federal resumes, and complex portfolio careers.
            </p>
            <a href="mailto:info@resumeshortlist.app">
              <Button variant="outline">Contact Our Team</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
