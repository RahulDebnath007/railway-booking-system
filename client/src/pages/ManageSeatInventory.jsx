import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManageSeatInventory() {
  const navigate = useNavigate();

  const [trains, setTrains] = useState([]);
  const [loadingTrains, setLoadingTrains] = useState(true);

  const [formData, setFormData] = useState({
    train: "",
    journeyDate: "",
    classCode: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Load all trains
  // --------------------------------------------------
  const loadTrains = async () => {
    try {
      setLoadingTrains(true);
      setError("");

      const response = await api.get("/admin/trains");

      setTrains(response.data.trains || []);
    } catch (error) {
      console.error("Load trains error:", error);

      setError(error.response?.data?.message || "Unable to load trains.");
    } finally {
      setLoadingTrains(false);
    }
  };

  // --------------------------------------------------
  // Load trains when page opens
  // --------------------------------------------------
  useEffect(() => {
    loadTrains();
  }, []);

  // --------------------------------------------------
  // Handle form changes
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    // If train changes, reset class
    if (name === "train") {
      setFormData((current) => ({
        ...current,
        train: value,
        classCode: "",
      }));
    }
  };

  // --------------------------------------------------
  // Selected train
  // --------------------------------------------------
  const selectedTrain = trains.find((train) => train._id === formData.train);

  // --------------------------------------------------
  // Selected class
  // --------------------------------------------------
  const selectedClass = selectedTrain?.classInventory?.find(
    (item) => item.classCode === formData.classCode,
  );

  // --------------------------------------------------
  // Initialize Seat Inventory
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!formData.train || !formData.journeyDate || !formData.classCode) {
      setError("Train, journey date and class are required.");

      return;
    }

    try {
      setLoading(true);

      // Send request to backend
      const response = await api.post("/seat-inventory/initialize", {
        trainId: formData.train,
        journeyDate: formData.journeyDate,
        classCode: formData.classCode,
      });

      console.log("Initialize inventory response:", response.data);

      setSuccess(
        response.data.message || "Seat inventory initialized successfully.",
      );
    } catch (error) {
      console.error("Initialize inventory error:", error);

      setError(
        error.response?.data?.message || "Unable to initialize seat inventory.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Today's date
  // --------------------------------------------------
  const today = new Date().toISOString().split("T")[0];

  // --------------------------------------------------
  // JSX
  // --------------------------------------------------
  return (
    <div className="admin-page">
      {/* =========================
                HEADER
            ========================== */}
      <header className="admin-header">
        <div>
          <h2>RailBook Admin</h2>

          <p>Seat Inventory Management</p>
        </div>

        <button
          onClick={() => navigate("/admin")}
          style={{
            padding: "12px 22px",
            borderRadius: "8px",
            border: "1px solid #d1d9e6",
            backgroundColor: "#ffffff",
            color: "#173f73",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#173f73";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "#173f73";
          }}
        >
          ← Dashboard
        </button>
      </header>

      {/* =========================
                MAIN CONTENT
            ========================== */}
      <main className="admin-container">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>Manage Seat Inventory</h1>

          <p>Initialize and manage seats for specific train journeys.</p>
        </div>

        {/* =========================
                    INITIALIZE INVENTORY
                ========================== */}
        <section className="admin-card">
          <h2>Initialize Seat Inventory</h2>

          <p>Select a train, journey date and class to create seats.</p>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Success Message */}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* =========================
                            TRAIN
                        ========================== */}
            <div className="form-group">
              <label>Train</label>

              <select
                name="train"
                value={formData.train}
                onChange={handleChange}
                disabled={loadingTrains || loading}
              >
                <option value="">
                  {loadingTrains ? "Loading trains..." : "Select train"}
                </option>

                {trains.map((train) => (
                  <option key={train._id} value={train._id}>
                    {train.trainNumber} - {train.name} ({train.source?.code} →{" "}
                    {train.destination?.code})
                  </option>
                ))}
              </select>
            </div>

            {/* =========================
                            JOURNEY DATE
                        ========================== */}
            <div className="form-group">
              <label>Journey Date</label>

              <input
                type="date"
                name="journeyDate"
                value={formData.journeyDate}
                onChange={handleChange}
                min={today}
                disabled={loading}
              />
            </div>

            {/* =========================
                            CLASS
                        ========================== */}
            <div className="form-group">
              <label>Class</label>

              <select
                name="classCode"
                value={formData.classCode}
                onChange={handleChange}
                disabled={!selectedTrain || loading}
              >
                <option value="">
                  {!selectedTrain ? "Select train first" : "Select class"}
                </option>

                {selectedTrain?.classInventory?.map((item) => (
                  <option key={item.classCode} value={item.classCode}>
                    {item.classCode} - {item.totalSeats} seats - ₹{item.fare}
                  </option>
                ))}
              </select>
            </div>

            {/* =========================
                            CLASS PREVIEW
                        ========================== */}
            {selectedClass && (
              <div className="inventory-preview">
                <div>
                  <span>Class</span>

                  <strong>{selectedClass.classCode}</strong>
                </div>

                <div>
                  <span>Total Seats</span>

                  <strong>{selectedClass.totalSeats}</strong>
                </div>

                <div>
                  <span>Fare</span>

                  <strong>₹{selectedClass.fare}</strong>
                </div>
              </div>
            )}

            {/* =========================
                            SUBMIT BUTTON
                        ========================== */}
            <button type="submit" disabled={loading || loadingTrains}>
              {loading ? "Initializing..." : "Initialize Inventory"}
            </button>
          </form>
        </section>

        {/* =========================
                    EXISTING INVENTORY
                ========================== */}
        <section className="admin-card">
          <div className="section-header">
            <div>
              <h2>Existing Inventory</h2>

              <p>View initialized journey inventories.</p>
            </div>

            <button type="button" onClick={loadTrains}>
              Refresh
            </button>
          </div>

          <div className="empty-state">
            <p>Inventory records will appear here after initialization.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ManageSeatInventory;
