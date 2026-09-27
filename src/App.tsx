import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { LanguageProvider } from "./i18n";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";

// User-facing pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Parking from "./pages/Parking";
import ParkingDetail from "./pages/ParkingDetail";
import BookingConfirmation from "./pages/BookingConfirmation";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminParking from "./pages/admin/AdminParking";
import AdminReservations from "./pages/admin/AdminReservations";

import PageTitleUpdater from "./components/PageTitleUpdater";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <PageTitleUpdater />
            <Routes>
              {/* User Layout Container (Header, Nav, Container, Footer) */}
              <Route element={<Layout />}>
                {/* 1. Public Landing Page */}
                <Route path="/" element={<Home />} />

                {/* 2. Guest-Only Routes (Redirect to /dashboard if logged in) */}
                <Route element={<GuestRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* 3. Protected User Routes (Redirect to /login if not authenticated) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/parking" element={<Parking />} />
                  <Route path="/parking/:parkingId" element={<ParkingDetail />} />
                  <Route path="/booking/:bookingId" element={<BookingConfirmation />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* 4. Admin Portal Routes (Guarded by AdminRoute & wrapped in AdminLayout) */}
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/parking" element={<AdminParking />} />
                  <Route path="/admin/reservations" element={<AdminReservations />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
