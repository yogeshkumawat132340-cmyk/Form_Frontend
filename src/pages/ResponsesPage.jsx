import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios.js";

function ResponsesPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formRes, responsesRes] = await Promise.all([
          API.get(`/forms/${id}`),
          API.get(`/responses/${id}`),
        ]);
        setForm(formRes.data);
        setResponses(responsesRes.data);
      } catch (err) {
        console.error("Responses fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
  if (!form) return <p style={{ textAlign: "center", marginTop: 40 }}>fils to find any form.</p>;

  const formatAnswer = (val) => {
    if (Array.isArray(val)) return val.join(", ");
    return val ?? "-";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Responses: {form.title}</h2>
        <Link to="/">
          <button className="btn btn-secondary">← Back to Dashboard</button>
        </Link>
      </div>

      {responses.length === 0 ? (
        <div className="empty-state">dont submitted any form yet!</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="responses-table">
            <thead>
              <tr>
                <th>#</th>
                {form.fields.map((field) => (
                  <th key={field._id}>{field.label}</th>
                ))}
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <tr key={response._id}>
                  <td>{index + 1}</td>
                  {form.fields.map((field) => (
                    <td key={field._id}>{formatAnswer(response.answers[field._id])}</td>
                  ))}
                  <td>{new Date(response.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ResponsesPage;
