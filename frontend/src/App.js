import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Methodology from "./pages/Methodology";
import Results from "./pages/Results";
import Pricing from "./pages/Pricing";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminDashboard from "./pages/Admin";
import ClientDashboard from "./pages/ClientDashboard";
import Home from "./pages/Home";
import ATSResults from "./pages/ATSResults";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/upload" element={<Layout><ATSResults /></Layout>} />
        <Route path="/methodology" element={<Layout><Methodology /></Layout>} />
        <Route path="/results" element={<Layout><Results /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/dashboard" element={<Layout><ClientDashboard /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
