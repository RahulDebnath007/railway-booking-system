import { useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import api from "../services/api";

function PassengerDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const trainId = searchParams.get("trainId");
  const journeyDate = searchParams.get("date");
  const classCode = searchParams.get("class");

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const fromCode = searchParams.get("fromCode");
  const toCode = searchParams.get("toCode");

  const seatsParam = searchParams.get("seats");

  const selectedSeats = seatsParam
    ? seatsParam.split(",")
    : [];

  const [passengers, setPassengers] =
    useState(
      selectedSeats.map((seat) => ({
        seatNumber: seat,
        name: "",
        age: "",
        gender: "",
      }))
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    index,
    field,
    value
  ) => {
    setPassengers((current) =>
      current.map((passenger, i) =>
        i === index
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate route information
    if (!from || !to) {
      setError(
        "Journey information is missing. Please go back and search again."
      );
      return;
    }

    // Validate passengers
    for (const passenger of passengers) {
      if (
        !passenger.name.trim() ||
        !passenger.age ||
        !passenger.gender
      ) {
        setError(
          "Please fill all passenger details."
        );
        return;
      }

      if (
        passenger.age < 1 ||
        passenger.age > 120
      ) {
        setError(
          "Passenger age must be between 1 and 120."
        );
        return;
      }
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/bookings",
        {
          trainId,
          journeyDate,
          from,
          to,
          classCode,
          selectedSeats,
          passengers,
        }
      );

      const booking =
        response.data.booking;

      navigate(
        `/payment?bookingId=${booking._id}`
      );
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setLoading(false);
    }
  };

  if (selectedSeats.length === 0) {
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
              No Seats Selected
            </h2>

            <p>
              Please select at least one seat
              before entering passenger
              details.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Search
            </button>
          </div>
        </main>
      </div>
    );
  }

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
              navigate("/my-bookings")
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

              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="page-container">
        {/* Page Header */}
        <div className="hero">
          <h1>
            Passenger Details
          </h1>

          <p>
            Enter the details of all
            passengers travelling on this
            booking.
          </p>
        </div>

        {/* Journey Summary */}
        <div className="card">
          <h2>
            Journey Summary
          </h2>

          <div className="booking-meta">
            <div className="booking-meta-item">
              <strong>
                From
              </strong>

              <br />

              {fromCode || from}
            </div>

            <div className="booking-meta-item">
              <strong>
                To
              </strong>

              <br />

              {toCode || to}
            </div>

            <div className="booking-meta-item">
              <strong>
                Class
              </strong>

              <br />

              {classCode}
            </div>

            <div className="booking-meta-item">
              <strong>
                Journey Date
              </strong>

              <br />

              {journeyDate}
            </div>
          </div>
        </div>

        {/* Passenger Form */}
        <form
          onSubmit={handleSubmit}
        >
          {passengers.map(
            (
              passenger,
              index
            ) => (
              <div
                className="card"
                key={
                  passenger.seatNumber
                }
              >
                <div className="booking-header">
                  <div>
                    <h2>
                      Passenger{" "}
                      {index + 1}
                    </h2>

                    <p>
                      Enter passenger
                      information
                    </p>
                  </div>

                  <div>
                    <span className="status status-confirmed">
                      Seat{" "}
                      {
                        passenger.seatNumber
                      }
                    </span>
                  </div>
                </div>

                <hr />

                <div className="form-grid">
                  {/* Name */}
                  <div className="form-group">
                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={
                        passenger.name
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Enter passenger name"
                    />
                  </div>

                  {/* Age */}
                  <div className="form-group">
                    <label>
                      Age
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={
                        passenger.age
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "age",
                          e.target.value
                        )
                      }
                      placeholder="Enter age"
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label>
                      Gender
                    </label>

                    <select
                      value={
                        passenger.gender
                      }
                      onChange={(e) =>
                        handleChange(
                          index,
                          "gender",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Error */}
          {error && (
            <div className="card">
              <div className="error-message">
                {error}
              </div>
            </div>
          )}

          {/* Continue */}
          <div className="card">
            <h2>
              Booking Summary
            </h2>

            <p>
              <strong>
                Selected Seats:
              </strong>{" "}
              {selectedSeats.join(
                ", "
              )}
            </p>

            <p>
              <strong>
                Passengers:
              </strong>{" "}
              {passengers.length}
            </p>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Creating Booking..."
                : "Continue to Payment"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default PassengerDetails;