import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Home from "./pages/cozy/Home";
import Listings from "./pages/cozy/Listings";
import HotelDetails from "./pages/cozy/HotelDetails";
import Booking from "./pages/cozy/Booking";
import Confirmation from "./pages/cozy/Confirmation";
import Bookings from "./pages/cozy/Bookings";
import Favourites from "./pages/cozy/Favourites";
import Inbox from "./pages/cozy/Inbox";
import Profile from "./pages/cozy/Profile";
import Auth from "./pages/cozy/Auth";
import Safety from "./pages/cozy/Safety";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/confirmation/:id" element={<Confirmation />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
