import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my-bookings");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Get bookings error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (pnr) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${pnr}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/bookings/${pnr}`);

      alert("Booking cancelled successfully.");

      fetchBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to cancel booking."
      );
    }
  };

  const getBookingStatusClass = (status) => {
    if (status === "CONFIRMED") {
      return "status-confirmed";
    }

    if (status === "CANCELLED") {
      return "status-cancelled";
    }

    return "status-pending";
  };

  const getPaymentStatusClass = (status) => {
    if (status === "PAID") {
      return "status-paid";
    }

    if (status === "FAILED") {
      return "status-cancelled";
    }

    return "status-pending";
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Loading your bookings...</p>
        </div>

        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Fetching your booking history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your train bookings.</p>
        </div>

        <div className="error-card">
          <h2>Unable to Load Bookings</h2>

          <p>{error}</p>

          <div className="button-row">
            <button
              className="primary-button"
              onClick={fetchBookings}
            >
              Try Again
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Bookings</h1>

        <p>
          View and manage all your train bookings.
        </p>
      </div>

      <div className="top-action-bar">
        <div>
          <h2>Your Bookings</h2>

          <p>
            {bookings.length === 0
              ? "No bookings found."
              : `${bookings.length} booking${
                  bookings.length > 1 ? "s" : ""
                } found`}
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigate("/")}
        >
          Book a Train
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">🚆</div>

          <h2>No Bookings Yet</h2>

          <p>
            You haven't made any train bookings yet.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Search Trains
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div
              className="booking-card"
              key={booking._id}
            >
              {/* Booking Header */}
              <div className="booking-card-header">
                <div>
                  <h2>
                    {booking.train?.name ||
                      "Train"}
                  </h2>

                  <p className="train-number">
                    Train No.{" "}
                    {booking.train?.trainNumber ||
                      "N/A"}
                  </p>
                </div>

                <span
                  className={`booking-status ${getBookingStatusClass(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus}
                </span>
              </div>

              <hr />

              {/* Journey Information */}
              <div className="journey-section">
                <div className="station">
                  <span className="station-label">
                    From
                  </span>

                  <strong>
                    {booking.from?.code ||
                      "N/A"}
                  </strong>

                  <span>
                    {booking.from?.name ||
                      ""}
                  </span>
                </div>

                <div className="journey-arrow">
                  →
                </div>

                <div className="station station-right">
                  <span className="station-label">
                    To
                  </span>

                  <strong>
                    {booking.to?.code ||
                      "N/A"}
                  </strong>

                  <span>
                    {booking.to?.name ||
                      ""}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="booking-details-grid">
                <div className="detail-box">
                  <span>Journey Date</span>

                  <strong>
                    {new Date(
                      booking.journeyDate
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Class</span>

                  <strong>
                    {booking.classCode}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>PNR</span>

                  <strong>
                    {booking.pnr}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Total Fare</span>

                  <strong>
                    ₹{booking.totalFare}
                  </strong>
                </div>
              </div>

              {/* Status Information */}
              <div className="status-row">
                <div>
                  <span>Booking Status</span>

                  <span
                    className={`small-status ${getBookingStatusClass(
                      booking.bookingStatus
                    )}`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                <div>
                  <span>Payment Status</span>

                  <span
                    className={`small-status ${getPaymentStatusClass(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              <hr />

              {/* Passengers */}
              <div className="passengers-section">
                <h3>Passengers</h3>

                {booking.passengers?.map(
                  (passenger, index) => (
                    <div
                      className="passenger-row"
                      key={passenger._id}
                    >
                      <div className="passenger-number">
                        {index + 1}
                      </div>

                      <div className="passenger-info">
                        <strong>
                          {passenger.name}
                        </strong>

                        <span>
                          Age: {passenger.age}
                        </span>

                        <span>
                          Gender:{" "}
                          {passenger.gender}
                        </span>
                      </div>

                      <div className="seat-badge">
                        Seat{" "}
                        {passenger.seatNumber ||
                          "Not assigned"}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Actions */}
              <div className="booking-actions">
                {booking.bookingStatus !==
                  "CANCELLED" && (
                  <button
                    className="cancel-button"
                    onClick={() =>
                      handleCancel(
                        booking.pnr
                      )
                    }
                  >
                    Cancel Booking
                  </button>
                )}

                <button
                  className="secondary-button"
                  onClick={() =>
                    navigate("/")
                  }
                >
                  Book Another Train
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-container {
          min-height: 100vh;
          background: #f4f7fb;
          padding: 50px 8%;
          box-sizing: border-box;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-header h1 {
          margin: 0 0 10px;
          color: #1f2937;
          font-size: 38px;
        }

        .page-header p {
          margin: 0;
          color: #64748b;
          font-size: 17px;
        }

        .top-action-bar {
          max-width: 1100px;
          margin: 0 auto 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 22px 28px;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(15, 23, 42, 0.08);
        }

        .top-action-bar h2 {
          margin: 0 0 5px;
          color: #1f2937;
        }

        .top-action-bar p {
          margin: 0;
          color: #64748b;
        }

        .bookings-list {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .booking-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
        }

        .booking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .booking-card-header h2 {
          margin: 0 0 8px;
          color: #1e293b;
          font-size: 25px;
        }

        .train-number {
          margin: 0;
          color: #64748b;
        }

        .booking-status,
        .small-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          font-weight: 700;
        }

        .booking-status {
          padding: 8px 15px;
          font-size: 13px;
        }

        .small-status {
          padding: 5px 10px;
          font-size: 12px;
          margin-left: 10px;
        }

        .status-confirmed,
        .status-paid {
          background: #dcfce7;
          color: #15803d;
        }

        .status-pending {
          background: #fef3c7;
          color: #a16207;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #dc2626;
        }

        .booking-card hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 25px 0;
        }

        .journey-section {
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .station {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .station-right {
          text-align: right;
          align-items: flex-end;
        }

        .station-label {
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .station strong {
          color: #1e293b;
          font-size: 28px;
        }

        .station span:last-child {
          color: #64748b;
        }

        .journey-arrow {
          text-align: center;
          color: #2563eb;
          font-size: 30px;
          font-weight: 700;
        }

        .booking-details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .detail-box {
          background: #f8fafc;
          padding: 17px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .detail-box span {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        .detail-box strong {
          color: #1e293b;
          font-size: 17px;
        }

        .status-row {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          background: #f8fafc;
          padding: 15px 18px;
          border-radius: 10px;
        }

        .status-row > div {
          display: flex;
          align-items: center;
          color: #475569;
          font-weight: 600;
        }

        .passengers-section h3 {
          color: #1e293b;
          margin: 0 0 15px;
          font-size: 20px;
        }

        .passenger-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          margin-bottom: 10px;
          background: #f8fafc;
          border-radius: 10px;
        }

        .passenger-number {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .passenger-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .passenger-info strong {
          color: #1e293b;
        }

        .passenger-info span {
          color: #64748b;
          font-size: 14px;
        }

        .seat-badge {
          background: #dcfce7;
          color: #15803d;
          padding: 8px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 13px;
        }

        .booking-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 25px;
        }

        button {
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
        }

        .primary-button {
          background: #2563eb;
          color: white;
        }

        .primary-button:hover {
          background: #1d4ed8;
        }

        .secondary-button {
          background: #e2e8f0;
          color: #1e293b;
        }

        .secondary-button:hover {
          background: #cbd5e1;
        }

        .cancel-button {
          background: #fee2e2;
          color: #dc2626;
        }

        .cancel-button:hover {
          background: #fecaca;
        }

        .empty-card,
        .error-card,
        .loading-card {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 50px;
          text-align: center;
          box-shadow: 0 6px 24px rgba(15, 23, 42, 0.08);
        }

        .empty-icon {
          font-size: 50px;
          margin-bottom: 15px;
        }

        .empty-card h2,
        .error-card h2,
        .loading-card h2 {
          color: #1e293b;
        }

        .empty-card p,
        .error-card p,
        .loading-card p {
          color: #64748b;
          margin-bottom: 25px;
        }

        .button-row {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .page-container {
            padding: 35px 4%;
          }

          .booking-details-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .passenger-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }

        @media (max-width: 600px) {
          .page-header h1 {
            font-size: 30px;
          }

          .top-action-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .booking-card {
            padding: 20px;
          }

          .booking-card-header {
            flex-direction: column;
          }

          .journey-section {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .station-right {
            text-align: left;
            align-items: flex-start;
          }

          .journey-arrow {
            transform: rotate(90deg);
          }

          .booking-details-grid {
            grid-template-columns: 1fr;
          }

          .status-row {
            flex-direction: column;
            gap: 12px;
          }

          .passenger-row {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .passenger-info {
            min-width: calc(100% - 55px);
          }

          .seat-badge {
            margin-left: 50px;
          }

          .booking-actions {
            flex-direction: column;
          }

          .booking-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default MyBookings;