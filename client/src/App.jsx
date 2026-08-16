import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import SeatSelection from "./pages/SeatSelection";
import PassengerDetails from "./pages/PassengerDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";

import ProtectedRoute from "./components/ProtectedRoute";
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

                    {/* =================================================
                        PUBLIC ROUTES
                       ================================================= */}

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />


                    {/* =================================================
                        PROTECTED USER ROUTES
                       ================================================= */}

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <SearchResults />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/seats"
                        element={
                            <ProtectedRoute>
                                <SeatSelection />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/passengers"
                        element={
                            <ProtectedRoute>
                                <PassengerDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/payment"
                        element={
                            <ProtectedRoute>
                                <Payment />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/my-bookings"
                        element={
                            <ProtectedRoute>
                                <MyBookings />
                            </ProtectedRoute>
                        }
                    />


                    {/* =================================================
                        ADMIN ROUTES
                       ================================================= */}

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


                    {/* =================================================
                        FALLBACK
                       ================================================= */}

                    <Route
                        path="*"
                        element={<Login />}
                    />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;