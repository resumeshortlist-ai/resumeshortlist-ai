import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { FileText, Loader2, UploadCloud, Mail, RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [sendingId, setSendingId] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/api/admin/orders`);
      setOrders(response.data.orders || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.detail || "Failed to load admin orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDownload = (uploadId, type) => {
    const url = `${backendUrl}/api/admin/orders/${uploadId}/file?file_type=${type}`;
    window.open(url, "_blank");
  };

  const handleRevisionUpload = async (uploadId, file) => {
    if (!file) {
      return;
    }
    setUploadingId(uploadId);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`${backendUrl}/api/admin/orders/${uploadId}/revised`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchOrders();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.detail || "Failed to upload revised resume.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleSendRevision = async (uploadId) => {
    setSendingId(uploadId);
    try {
      await axios.post(`${backendUrl}/api/admin/orders/${uploadId}/send-revision`);
      await fetchOrders();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.detail || "Failed to send revision email.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Download, revise, and deliver resumes in one place.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={fetchOrders} disabled={loading}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.upload_id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-bold">{order.customer?.name || "Unknown Client"}</div>
                          {order.tier && <Badge variant="secondary">{order.tier}</Badge>}
                          {order.status && <Badge>{order.status.replace("_", " ")}</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer?.email || "No email provided"} · {order.customer?.phone || "No phone"}
                        </div>
                        <div className="text-xs text-muted-foreground">Upload ID: {order.upload_id}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(order.upload_id, "original")}
                        >
                          <FileText className="h-4 w-4" /> Original
                        </Button>
                        {order.revised_filename && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleDownload(order.upload_id, "revised")}
                          >
                            <FileText className="h-4 w-4" /> Revised
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="text-sm text-muted-foreground">
                        {order.original_filename ? `Original: ${order.original_filename}` : "Original resume missing."}
                        {order.revised_filename ? ` · Revised: ${order.revised_filename}` : ""}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <label className="relative inline-flex items-center gap-2">
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept=".pdf,.doc,.docx"
                            disabled={uploadingId === order.upload_id}
                            onChange={(e) => handleRevisionUpload(order.upload_id, e.target.files?.[0])}
                          />
                          <Button variant="outline" size="sm" className="gap-2" disabled={uploadingId === order.upload_id}>
                            {uploadingId === order.upload_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UploadCloud className="h-4 w-4" />
                            )}
                            Upload Revision
                          </Button>
                        </label>
                        <Button
                          size="sm"
                          className="gap-2"
                          disabled={sendingId === order.upload_id || !order.revised_filename}
                          onClick={() => handleSendRevision(order.upload_id)}
                        >
                          {sendingId === order.upload_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                          Email Client
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <div className="text-muted-foreground">No orders yet.</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
