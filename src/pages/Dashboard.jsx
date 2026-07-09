import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios.js";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      const res = await API.get("/forms");
      setForms(res.data);
    } catch (err) {
      console.error("Forms fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("if you want to delete this form?")) return;
    try {
      await API.delete(`/forms/${id}`);
      setForms((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const copyLink = (id) => {
    const link = `${window.location.origin}/form/${id}`;
    navigator.clipboard.writeText(link);
    alert("Form link copy ho gaya:\n" + link);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Create Form Dashboard</h2>
        <button className="btn" onClick={() => navigate("/create")}>
          + Create Form
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && forms.length === 0 && (
        <div className="empty-state">dont't make any form yek "+ Create Form" click to start</div>
      )}

      <div className="form-list">
        {forms.map((form) => (
          <div className="form-card" key={form._id}>
            <h3>{form.title}</h3>
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              {form.fields.length} field(s)
            </p>
            <div className="card-actions">
              <button className="btn" onClick={() => navigate(`/edit/${form._id}`)}>
                Edit
              </button>
              <button className="btn btn-secondary" onClick={() => copyLink(form._id)}>
                Copy Link
              </button>
              <Link to={`/responses/${form._id}`}>
                <button className="btn btn-secondary">Responses</button>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(form._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
