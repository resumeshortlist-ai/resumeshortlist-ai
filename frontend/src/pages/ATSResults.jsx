import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Share2, Download, TrendingUp, ShieldCheck, Briefcase, CheckCircle, ArrowRight, Loader2, Info, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import FileUpload from "../components/FileUpload";
import axios from "axios";
import { cn } from "../lib/utils";

const ATSResults = () => {
  const [analysis, setAnalysis] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Set default tier when analysis loads
  useEffect(() => {
    if (analysis && analysis.suggested_tier) {
        setSelectedTier(analysis.suggested_tier);
    }
  }, [analysis]);

  // If no analysis yet, show upload
  if (!analysis) {
    return (
      <div className="min-h-screen bg-secondary/30 py-20">
        <div className="container max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl font-serif font-bold text-primary">Resume Diagnostic</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your resume for a free 50-point comprehensive audit. 
              See exactly why you aren't getting interviews.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
              <div className="p-4 bg-background border rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-700">
                      <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sm">ATS Compatibility Score</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                      0-100 score evaluating how well your resume survives automated filtering.
                  </p>
              </div>
              <div className="p-4 bg-background border rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mb-3 text-amber-700">
                      <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sm">Gap Analysis</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                      Verdict on why you are being filtered early by recruiters.
                  </p>
              </div>
              <div className="p-4 bg-background border rounded-lg shadow-sm">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-700">
                      <CheckCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-sm">Prioritized Fixes</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                      3-4 specific corrections needed to pass the 6-second scan.
                  </p>
              </div>
          </div>

          <Card className="shadow-lg border-primary/10">
            <CardContent className="p-12">
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="First Last"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="you@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>
              <FileUpload
                onAnalysisComplete={setAnalysis}
                applicantName={contactName}
                applicantEmail={contactEmail}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
      if (!selectedTier) {
          alert("Please select a career level.");
          return;
      }
      if (!contactName.trim() || !contactEmail.trim()) {
          alert("Please enter your name and email so we can deliver your revised resume.");
          return;
      }
      setLoadingCheckout(true);
      try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/checkout`, {
              price_key: selectedTier,
              include_interview_prep: interviewPrep,
              upload_id: analysis.upload_id,
              email: contactEmail,
              name: contactName,
              phone: contactPhone
          });
          
          if (response.data.checkout_url) {
              console.log("Redirecting to:", response.data.checkout_url);
              window.location.href = response.data.checkout_url;
          } else {
              alert("Error: Payment provider did not return a valid URL. Please try again.");
              setLoadingCheckout(false);
          }
      } catch (e) {
          console.error(e);
          alert("Checkout Error: " + (e.response?.data?.detail || e.message));
          setLoadingCheckout(false);
      }
  };

  const { score, summary, bullets, gap_analysis, suggested_tier } = analysis;
  
  // Determine color based on score
  const scoreColor = score > 80 ? "text-green-600" : score > 60 ? "text-amber-500" : "text-destructive";

  const tiers = [
      { id: 'ENTRY', label: 'Entry Level', desc: 'Emerging Pros', price: 50 },
      { id: 'MID', label: 'Mid Level', desc: 'Established', price: 100 },
      { id: 'SENIOR', label: 'Senior Level', desc: 'Team Leads', price: 200 },
      { id: 'EXEC', label: 'Executive', desc: 'Directors/VPs', price: 400 },
      { id: 'CSUITE', label: 'C-Suite', desc: 'Chief Officers', price: 800 },
  ];

  const currentPrice = (tiers.find(t => t.id === selectedTier)?.price || 0) + (interviewPrep ? 100 : 0);

  return (
    <div className="min-h-screen bg-secondary/20 pb-20">
      
      {/* Header */}
      <header className="bg-background border-b py-6 sticky top-20 z-40">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Analysis Complete</Badge>
                <span className="text-xs text-muted-foreground">ID: #{analysis.upload_id.substring(0,8)}</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-primary">Diagnostic Report: {analysis.filename}</h1>
            </div>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" onClick={() => setAnalysis(null)}>
                 Upload New
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container pt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Score Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Score Card */}
            <Card className="border-none shadow-md overflow-hidden bg-background">
              <div className="h-2 bg-gradient-to-r from-amber-200 to-amber-500" />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative h-40 w-40 shrink-0">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="283" strokeDashoffset={283 - (283 * score / 100)}
                        transform="rotate(-90 50 50)"
                        className={`transition-all duration-1000 ease-out ${scoreColor}`}
                      />
                    </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
                        <span className="text-xs uppercase text-muted-foreground font-semibold mt-1">/ 100</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4 text-center md:text-left flex-1">
                    <div>
                      <h2 className="text-2xl font-serif font-bold mb-2">Evaluation Result</h2>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base italic">
                        "{summary}"
                      </p>
                    </div>
                    
                    <div className="p-4 bg-red-50 text-red-900 text-sm rounded-md border border-red-100">
                        <span className="font-bold">CRITICAL:</span> I evaluated your resume, and it is not capturing your real value. It is slipping through automated screening systems, losing recruiter attention, and misaligned with hiring expectations.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold px-1">Key Findings</h3>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="p-2 bg-red-100 rounded-md text-red-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base text-red-900">Gap Analysis</CardTitle>
                    <CardDescription>Why you are being filtered early</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                     {Array.isArray(gap_analysis) ? gap_analysis.map((gap, idx) => (
                        <div key={idx} className="flex gap-4 items-start p-3 bg-secondary/30 rounded-md">
                           <div className="mt-1">
                              <X className="h-4 w-4 text-red-500" />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-foreground">{gap.category}</div>
                              <div className="text-sm text-muted-foreground">{gap.finding}</div>
                           </div>
                        </div>
                     )) : (
                        <p className="text-sm text-muted-foreground">{gap_analysis}</p>
                     )}
                   </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="p-2 bg-amber-100 rounded-md text-amber-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">Prioritized Corrections</CardTitle>
                    <CardDescription>Immediate fixes required</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                      {bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-3 text-sm text-muted-foreground">
                              <span className="text-amber-500 font-bold">•</span>
                              {bullet}
                          </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar / Upgrade CTA */}
          <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground border-none shadow-xl sticky top-28">
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-2xl">Fix My Resume</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  Select your Career Level. 24-hour turnaround.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingCheckout && (
                    <div className="absolute inset-0 bg-primary/80 z-50 flex items-center justify-center">
                        <Loader2 className="animate-spin h-8 w-8 text-white" />
                    </div>
                )}
                
                <div className="p-3 bg-primary border border-primary/20 rounded-md mb-4 text-xs text-primary-foreground text-center">
                    <span className="font-bold">Includes 2 Free Revisions</span>
                </div>
                
                <div className="grid gap-2">
                    {tiers.map((tier) => (
                        <div 
                            key={tier.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-md cursor-pointer transition-all border-2",
                                selectedTier === tier.id 
                                    ? "bg-accent text-accent-foreground border-accent" 
                                    : "bg-primary-foreground/10 text-primary-foreground border-transparent hover:bg-primary-foreground/20"
                            )}
                            onClick={() => setSelectedTier(tier.id)}
                        >
                            <div className="text-left">
                                <div className="font-bold flex items-center gap-2">
                                    {tier.label}
                                    {suggested_tier === tier.id && (
                                        <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-sm">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs opacity-70">{tier.desc}</div>
                            </div>
                            <div className="font-bold">${tier.price}</div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-primary-foreground/10 mt-4 space-y-3">
                    <div>
                        <label className="text-xs uppercase tracking-wide text-primary-foreground/70">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Jane Doe"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-wide text-primary-foreground/70">Email Address</label>
                        <input
                            type="email"
                            className="mt-1 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="you@email.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-wide text-primary-foreground/70">Phone (optional)</label>
                        <input
                            type="tel"
                            className="mt-1 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="+1 555 123 4567"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-primary-foreground/10 mt-4">
                    <div className="flex items-start space-x-2">
                        <Checkbox 
                            id="interview" 
                            checked={interviewPrep} 
                            onCheckedChange={setInterviewPrep}
                            className="border-primary-foreground/50 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="interview"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Add Interview Prep (+$100)
                            </label>
                            <p className="text-xs text-primary-foreground/70">
                                1-hour session with executive coach.
                            </p>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={handleCheckout} 
                    disabled={loadingCheckout || !selectedTier} 
                    className="w-full mt-4 h-12 text-base font-bold bg-white text-primary hover:bg-white/90"
                >
                    Proceed to Checkout (${currentPrice})
                </Button>

                <div className="text-[10px] text-center opacity-50 mt-2">
                    Secure Payment via Stripe
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ATSResults;
