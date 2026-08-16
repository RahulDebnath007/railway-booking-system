import { useState } from "react";
import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import api from "../services/api";

function Payment() {
    const [searchParams] =
        useSearchParams();

    const navigate = useNavigate();

    const bookingId =
        searchParams.get("bookingId");

    const [paymentMethod, setPaymentMethod] =
        useState("UPI");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [paymentSuccess, setPaymentSuccess] =
        useState(false);

    const [booking, setBooking] =
        useState(null);

    const handlePayment = async () => {
        if (!bookingId) {
            setError(
                "Booking ID is missing."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await api.post(
                    "/payments/process",
                    {
                        bookingId,
                        paymentMethod,
                    }
                );

            setBooking(
                response.data.booking
            );

            setPaymentSuccess(true);
        } catch (error) {
            console.error(
                "Payment error:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                    "Payment failed."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Missing booking ID
     */
    if (!bookingId) {
        return (
            <div>
                <nav className="navbar">
                    <div className="navbar-brand">
                        RailBook
                    </div>
                </nav>

                <main className="page-container">
                    <div className="card">
                        <h2>
                            Payment
                        </h2>

                        <div className="error-message">
                            Booking ID is
                            missing.
                        </div>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Back to Home
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    /*
     * Payment successful
     */
    if (
        paymentSuccess &&
        booking
    ) {
        return (
            <div>
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-brand">
                        RailBook
                    </div>

                    <div className="navbar-actions">
                        <button
                            onClick={() =>
                                navigate(
                                    "/my-bookings"
                                )
                            }
                        >
                            My Bookings
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem(
                                    "token"
                                );

                                localStorage.removeItem(
                                    "user"
                                );

                                navigate(
                                    "/login"
                                );
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </nav>

                <main className="page-container">

                    {/* Success header */}
                    <div className="hero">
                        <h1>
                            Payment Successful
                        </h1>

                        <p>
                            Your payment has
                            been completed
                            successfully.
                        </p>
                    </div>

                    {/* Confirmation */}
                    <div className="card">
                        <div className="booking-header">
                            <div>
                                <h2>
                                    Booking
                                    Confirmation
                                </h2>

                                <p>
                                    Your train
                                    booking is
                                    confirmed.
                                </p>
                            </div>

                            <span className="status status-confirmed">
                                CONFIRMED
                            </span>
                        </div>

                        <hr />

                        <div className="booking-meta">

                            <div className="booking-meta-item">
                                <strong>
                                    PNR
                                </strong>

                                <br />

                                {booking.pnr}
                            </div>

                            <div className="booking-meta-item">
                                <strong>
                                    Booking ID
                                </strong>

                                <br />

                                {booking._id}
                            </div>

                            <div className="booking-meta-item">
                                <strong>
                                    Payment
                                    Status
                                </strong>

                                <br />

                                {booking.paymentStatus}
                            </div>

                            <div className="booking-meta-item">
                                <strong>
                                    Booking
                                    Status
                                </strong>

                                <br />

                                {booking.bookingStatus}
                            </div>

                        </div>
                    </div>

                    {/* Payment information */}
                    <div className="card">
                        <h2>
                            Payment Details
                        </h2>

                        <div className="booking-meta">

                            <div className="booking-meta-item">
                                <strong>
                                    Payment
                                    Method
                                </strong>

                                <br />

                                {paymentMethod}
                            </div>

                            <div className="booking-meta-item">
                                <strong>
                                    Total Fare
                                </strong>

                                <br />

                                <span
                                    style={{
                                        fontSize:
                                            "22px",
                                        fontWeight:
                                            "700",
                                    }}
                                >
                                    ₹
                                    {
                                        booking.totalFare
                                    }
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="card">
                        <h2>
                            Passengers
                        </h2>

                        {booking.passengers?.map(
                            (
                                passenger,
                                index
                            ) => (
                                <div
                                    key={
                                        passenger._id
                                    }
                                    className="booking-meta"
                                    style={{
                                        marginBottom:
                                            "12px",
                                    }}
                                >

                                    <div className="booking-meta-item">
                                        <strong>
                                            Passenger{" "}
                                            {index +
                                                1}
                                        </strong>

                                        <br />

                                        {
                                            passenger.name
                                        }
                                    </div>

                                    <div className="booking-meta-item">
                                        <strong>
                                            Seat
                                        </strong>

                                        <br />

                                        {
                                            passenger.seatNumber
                                        }
                                    </div>

                                    <div className="booking-meta-item">
                                        <strong>
                                            Age
                                        </strong>

                                        <br />

                                        {
                                            passenger.age
                                        }
                                    </div>

                                    <div className="booking-meta-item">
                                        <strong>
                                            Gender
                                        </strong>

                                        <br />

                                        {
                                            passenger.gender
                                        }
                                    </div>

                                </div>
                            )
                        )}
                    </div>

                    {/* Actions */}
                    <div className="card">

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/my-bookings"
                                )
                            }
                        >
                            View My Bookings
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() =>
                                navigate("/")
                            }
                            style={{
                                marginLeft:
                                    "10px",
                            }}
                        >
                            Back to Home
                        </button>

                    </div>

                </main>
            </div>
        );
    }

    /*
     * Payment form
     */
    return (
        <div>

            {/* Navbar */}
            <nav className="navbar">

                <div className="navbar-brand">
                    RailBook
                </div>

                <div className="navbar-actions">

                    <button
                        onClick={() =>
                            navigate(
                                "/my-bookings"
                            )
                        }
                    >
                        My Bookings
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            navigate(
                                "/login"
                            );
                        }}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <main className="page-container">

                {/* Header */}
                <div className="hero">

                    <h1>
                        Complete Payment
                    </h1>

                    <p>
                        Choose your preferred
                        payment method to
                        confirm your booking.
                    </p>

                </div>

                {/* Booking information */}
                <div className="card">

                    <h2>
                        Booking Information
                    </h2>

                    <div className="booking-meta">

                        <div className="booking-meta-item">
                            <strong>
                                Booking ID
                            </strong>

                            <br />

                            {bookingId}
                        </div>

                        <div className="booking-meta-item">
                            <strong>
                                Status
                            </strong>

                            <br />

                            Pending Payment
                        </div>

                    </div>

                </div>

                {/* Payment method */}
                <div className="card payment-method-card">

                    <h2>
                        Select Payment Method
                    </h2>

                    <div className="payment-options">

                        {/* UPI */}
                        <label
                            className={`payment-option ${
                                paymentMethod ===
                                "UPI"
                                    ? "selected"
                                    : ""
                            }`}
                        >

                            <input
                                type="radio"
                                value="UPI"
                                checked={
                                    paymentMethod ===
                                    "UPI"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <strong>
                                UPI
                            </strong>

                            <p>
                                Pay using UPI
                            </p>

                        </label>


                        {/* Card */}
                        <label
                            className={`payment-option ${
                                paymentMethod ===
                                "CARD"
                                    ? "selected"
                                    : ""
                            }`}
                        >

                            <input
                                type="radio"
                                value="CARD"
                                checked={
                                    paymentMethod ===
                                    "CARD"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <strong>
                                Card
                            </strong>

                            <p>
                                Credit or debit card
                            </p>

                        </label>


                        {/* Net Banking */}
                        <label
                            className={`payment-option ${
                                paymentMethod ===
                                "NET_BANKING"
                                    ? "selected"
                                    : ""
                            }`}
                        >

                            <input
                                type="radio"
                                value="NET_BANKING"
                                checked={
                                    paymentMethod ===
                                    "NET_BANKING"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            <strong>
                                Net Banking
                            </strong>

                            <p>
                                Pay using your bank
                                account
                            </p>

                        </label>

                    </div>


                    {/* Error */}
                    {error && (
                        <div
                            className="error-message"
                            style={{
                                marginTop:
                                    "20px",
                            }}
                        >
                            {error}
                        </div>
                    )}


                    {/* Pay button */}
                    <div
                        style={{
                            marginTop:
                                "25px",
                        }}
                    >

                        <button
                            className="primary-button"
                            onClick={
                                handlePayment
                            }
                            disabled={
                                loading
                            }
                        >
                            {loading
                                ? "Processing Payment..."
                                : "Pay Now"}
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Payment;