import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import ManageStations from "./pages/ManageStations";
import ManageTrains from "./pages/ManageTrains";
import ManageSeatInventory from "./pages/ManageSeatInventory";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/search" element={<SearchResults />} />

        <Route path="/seats" element={<SeatSelection />} />

        <Route path="/passengers" element={<PassengerDetails />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/payment" element={<Payment />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/stations"
          element={
            <AdminRoute>
              <ManageStations />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/trains"
          element={
            <AdminRoute>
              <ManageTrains />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/seat-inventory"
          element={
            <AdminRoute>
              <ManageSeatInventory />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
