import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/cozy/Home";
import Listings from "./pages/cozy/Listings";
import HotelDetails from "./pages/cozy/HotelDetails";
import Booking from "./pages/cozy/Booking";
import Confirmation from "./pages/cozy/Confirmation";
import Bookings from "./pages/cozy/Bookings";
import BookingDetails from "./pages/cozy/BookingDetails";
import Favourites from "./pages/cozy/Favourites";
import Profile from "./pages/cozy/Profile";
import Auth from "./pages/cozy/Auth";
import GoogleAuth from "./pages/cozy/GoogleAuth";
import Safety from "./pages/cozy/Safety";
import Admin from "./pages/cozy/Admin";
import AdminOverview from "./pages/cozy/admin/Overview";
import AdminProperties from "./pages/cozy/admin/Properties";
import AdminBookings from "./pages/cozy/admin/Bookings";
import AdminVerify from "./pages/cozy/admin/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/google-auth" element={<GoogleAuth />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              
              {/* Protected Routes */}
              <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/confirmation/:id" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
              <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
              <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              <Route path="/safety" element={<Safety />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="verify" element={<AdminVerify />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
