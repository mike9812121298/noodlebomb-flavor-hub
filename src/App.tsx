import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EmailCapture from "./components/EmailCapture";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Recipes from "./pages/Recipes";
import SauceSelector from "./pages/SauceSelector";
import RamenBox from "./pages/RamenBox";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SoySauce from "./pages/SoySauce";
import NotFound from "./pages/NotFound";
import Wholesale from "./pages/Wholesale";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop />
        <AnnouncementBar />
        <Navbar />
        <EmailCapture />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/sauce-selector" element={<SauceSelector />} />
          <Route path="/sauce-finder" element={<Navigate to="/sauce-selector" replace />} />
          <Route path="/ramen-box" element={<RamenBox />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/soy-sauce" element={<SoySauce />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
