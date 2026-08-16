import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManageStations() {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch stations
  const fetchStations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/stations");

      setStations(response.data.stations || []);
    } catch (error) {
      console.error("Fetch stations error:", error);

      setError(error.response?.data?.message || "Unable to load stations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Create station
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const code = formData.code.trim().toUpperCase();
    const city = formData.city.trim();
    const state = formData.state.trim();

    if (!name || !code || !city || !state) {
      setError("All station fields are required.");
      return;
    }

    if (code.length < 3 || code.length > 4) {
      setError("Station code must contain 3 or 4 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/admin/stations", {
        name,
        code,
        city,
        state,
      });

      setSuccess(response.data.message || "Station created successfully.");

      setFormData({
        name: "",
        code: "",
        city: "",
        state: "",
      });

      await fetchStations();
    } catch (error) {
      console.error("Create station error:", error);

      setError(error.response?.data?.message || "Unable to create station.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h2>RailBook Admin</h2>
          <p>Station Management</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="admin-back-button"
        >
          ← Dashboard
        </button>
      </header>

      <main className="admin-container">
        {/* Page heading */}
        <div className="admin-page-heading">
          <h1>Manage Stations</h1>

          <p>Add and manage railway stations used by RailBook.</p>
        </div>

        {/* Add Station */}
        <section className="admin-card">
          <h2>Add New Station</h2>

          <p className="admin-card-description">
            Enter the station information below.
          </p>

          {error && <div className="admin-error">{error}</div>}

          {success && <div className="admin-success">{success}</div>}

          <form onSubmit={handleSubmit} className="station-form">
            <div className="form-group">
              <label htmlFor="name">Station Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Howrah Junction"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Station Code</label>

              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                placeholder="HWH"
                maxLength={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>

              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Kolkata"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>

              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                placeholder="West Bengal"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="admin-primary-button"
            >
              {submitting ? "Adding Station..." : "Add Station"}
            </button>
          </form>
        </section>

        {/* Station List */}
        <section className="admin-card">
          <div className="station-list-header">
            <div>
              <h2>Existing Stations</h2>

              <p className="admin-card-description">
                {stations.length} station
                {stations.length !== 1 ? "s" : ""} registered.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchStations}
              className="admin-secondary-button"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="admin-empty">Loading stations...</div>
          ) : stations.length === 0 ? (
            <div className="admin-empty">No stations found.</div>
          ) : (
            <div className="station-table-wrapper">
              <table className="station-table">
                <thead>
                  <tr>
                    <th>Station</th>
                    <th>Code</th>
                    <th>City</th>
                    <th>State</th>
                  </tr>
                </thead>

                <tbody>
                  {stations.map((station) => (
                    <tr key={station._id}>
                      <td>
                        <strong>{station.name}</strong>
                      </td>

                      <td>
                        <span className="station-code">{station.code}</span>
                      </td>

                      <td>{station.city}</td>

                      <td>{station.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageStations;
