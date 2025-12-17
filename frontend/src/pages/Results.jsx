import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { TrendingUp, UserCheck, Briefcase } from "lucide-react";

const Results = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 bg-secondary/20">
        <div className="container max-w-4xl text-center space-y-6">
          <Badge variant="outline" className="bg-background">Proven Outcomes</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            Careers Transformed.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From automated rejection to interview invitations. See how our precision positioning changes the trajectory of a career.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b">
        <div className="container grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">3x</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Interview Rate Increase</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">24h</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Turnaround Time</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">ATS Pass Rate</div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24">
        <div className="container max-w-5xl space-y-16">
          
          {/* Case 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Mid-Level → Senior Transition</Badge>
              <h3 className="text-2xl font-serif font-bold">The "Stuck" Specialist</h3>
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">Challenge:</span> Sarah was a Senior Marketing Manager for 6 years. She applied to 40+ Director roles with 0 callbacks. Her resume was task-focused ("Managed email campaigns").
              </p>
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">Solution:</span> We shifted her narrative from "Execution" to "Strategy." We quantified her campaign revenue impact ($12M) and highlighted team leadership.
              </p>
              <p className="text-green-600 font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Result: Landed Director of Marketing at Series B Tech Co.
              </p>
            </div>
            <Card className="bg-secondary/20 border-none">
              <CardContent className="p-8">
                <div className="text-sm font-mono text-muted-foreground space-y-4">
                  <div className="opacity-50 line-through">"Responsible for managing email marketing team and weekly newsletters."</div>
                  <div className="text-primary font-bold">"Directed omnichannel marketing strategy driving $12M ARR (22% YoY growth); led and upskilled 8-person creative team."</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Case 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Executive / C-Suite</Badge>
              <h3 className="text-2xl font-serif font-bold">The Invisible VP</h3>
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">Challenge:</span> Michael, a VP of Ops, was being filtered out by automated screeners because his resume used internal company jargon instead of industry-standard executive terminology.
              </p>
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">Solution:</span> We conducted a full "Jargon Audit," replacing proprietary terms with universal P&L and Operational Excellence keywords recognized by retained search firms.
              </p>
              <p className="text-green-600 font-bold flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> Result: 4 Interviews in 2 weeks. Placed as COO.
              </p>
            </div>
            <Card className="bg-secondary/20 border-none">
              <CardContent className="p-8">
                <div className="text-sm font-mono text-muted-foreground space-y-4">
                  <div className="opacity-50 line-through">"Led the Project Alpha initiative for internal efficiency."</div>
                  <div className="text-primary font-bold">"Spearheaded enterprise-wide operational transformation, reducing OPEX by 18% ($4.5M) annually via Lean Six Sigma implementation."</div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container">
          <h2 className="text-3xl font-serif font-bold mb-6">Be The Next Success Story</h2>
          <Link to="/upload">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 font-bold">
              Start Your Transition
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Results;
