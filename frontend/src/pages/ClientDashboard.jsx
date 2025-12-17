import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Clock, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import axios from "axios";

const ClientDashboard = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    if (sessionId) {
      // Verify session
      const verify = async () => {
        try {
            // Note: In React 18 strict mode this might run twice, but that's okay for verification
            const formData = new FormData();
            formData.append("session_id", sessionId);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-session`, formData);
            if (res.data.status === "paid") {
                setOrderStatus("confirmed");
            }
        } catch (e) {
            console.error("Verification failed", e);
        } finally {
            setLoading(false);
        }
      };
      verify();
    } else {
        setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-secondary/20 py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-primary">Client Portal</h1>
            <p className="text-muted-foreground">Track your document status and secretary communications.</p>
        </div>

        {orderStatus === "confirmed" && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-center gap-3 mb-8">
                <CheckCircle className="h-5 w-5" />
                <div>
                    <div className="font-bold">Payment Confirmed</div>
                    <div className="text-sm">Your order has been locked in. Our team has been notified.</div>
                </div>
            </div>
        )}

        <div className="grid gap-6">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Active Project: Executive Resume Rebuild</CardTitle>
                        <Badge className="bg-amber-500">In Progress</Badge>
                    </div>
                    <CardDescription>Order ID: #EXEC-{sessionId ? sessionId.slice(-6) : 'DEMO'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {/* Timeline */}
                        <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-2">
                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                                <h4 className="text-sm font-semibold">Order Received</h4>
                                <p className="text-xs text-muted-foreground">We have received your payment and original file.</p>
                                <div className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()}</div>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-amber-500 border-2 border-background animate-pulse" />
                                <h4 className="text-sm font-semibold">Secretary Review</h4>
                                <p className="text-xs text-muted-foreground">Assigning to industry specialist. Analyzing current gaps.</p>
                                <div className="text-xs text-primary font-medium mt-1">Current Status</div>
                            </div>
                            <div className="relative pl-8 opacity-50">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-muted border-2 border-background" />
                                <h4 className="text-sm font-semibold">Draft Delivery</h4>
                                <p className="text-xs text-muted-foreground">First draft delivered via email for your review.</p>
                                <div className="text-xs text-muted-foreground mt-1">Expected: Within 24 Hours</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Your Files</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-3 border rounded-md flex items-center gap-3 bg-background">
                            <FileText className="h-8 w-8 text-primary/40" />
                            <div className="overflow-hidden">
                                <div className="font-medium text-sm truncate">Original_Resume.pdf</div>
                                <div className="text-xs text-muted-foreground">Uploaded Today</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Direct line to your assigned secretary is available 9am-5pm EST.
                        </p>
                        <Button variant="outline" className="w-full">Contact Support</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
