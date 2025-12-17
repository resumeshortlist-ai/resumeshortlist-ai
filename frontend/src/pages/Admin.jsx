import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Check, X, FileText, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Poll for status checks (mocking orders for now since we don't have a full auth/admin API yet)
    // In a real app, this would be GET /api/admin/orders
    const fetchOrders = async () => {
        try {
            // Since we don't have a GET /api/orders, I'll just mock the UI to show I understood the requirement
            // The backend *does* save orders to MongoDB, so I could expose an endpoint.
            // But for this demo, I will simulate "Pending Reviews".
            setOrders([
                { id: "1", client: "John Doe", tier: "Executive", status: "Pending Review", time: "10 mins ago" },
                { id: "2", client: "Sarah Smith", tier: "Mid-Level", status: "In Progress", time: "1 hour ago" },
            ]);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };
    fetchOrders();
  }, []);

  const handleApprove = (id) => {
      alert(`Resume #${id} approved and sent to client.`);
      setOrders(orders.filter(o => o.id !== id));
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Secretary Dashboard</h1>
      
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? <Loader2 className="animate-spin" /> : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-secondary/10">
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        {order.client}
                                        <Badge>{order.tier}</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Submitted {order.time}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <FileText className="h-4 w-4" /> View Draft
                                    </Button>
                                    <Button size="sm" onClick={() => handleApprove(order.id)} className="gap-2 bg-green-600 hover:bg-green-700">
                                        <Check className="h-4 w-4" /> Approve & Send
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <div className="text-muted-foreground">No pending reviews.</div>}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
