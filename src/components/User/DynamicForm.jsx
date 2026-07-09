import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios.js";

function DynamicForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get(`/forms/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error("Form fetch error:", err);
        setError("not able to load please check the field .");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId, option, checked) => {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const updated = checked ? [...existing, option] : existing.filter((o) => o !== option);
      return { ...prev, [fieldId]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const field of form.fields) {
      if (field.required) {
        const val = answers[field._id];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          alert(`"${field.label}" field required .`);
          return;
        }
      }
    }

    try {
      await API.post("/responses", { formId: form._id, answers });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submit karne me error aayi.");
    }
  };

  const renderField = (field) => {
    const style = { fontSize: form.style.fontSize };
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            style={style}
            value={answers[field._id] || ""}
            onChange={(e) => handleChange(field._id, e.target.value)}
          />
        );

      case "dropdown":
        return (
          <select
            style={style}
            value={answers[field._id] || ""}
            onChange={(e) => handleChange(field._id, e.target.value)}
          >
            <option value="">-- Select --</option>
            {field.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return field.options.map((opt, i) => (
          <div className="option-option" key={i}>
            <input
              type="checkbox"
              checked={Array.isArray(answers[field._id]) && answers[field._id].includes(opt)}
              onChange={(e) => handleCheckboxChange(field._id, opt, e.target.checked)}
            />
            <span style={style}>{opt}</span>
          </div>
        ));

      case "radio":
        return field.options.map((opt, i) => (
          <div className="option-option" key={i}>
            <input
              type="radio"
              name={field._id}
              checked={answers[field._id] === opt}
              onChange={() => handleChange(field._id, opt)}
            />
            <span style={style}>{opt}</span>
          </div>
        ));

      default:
        return null;
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: 40, color: "red" }}>{error}</p>;

  if (submitted) {
    return (
      <div className="user-form-page">
        <div className="panel" style={{ textAlign: "center" }}>
          <h2>✅ Response Submit!</h2>
          <p>your answar is saves.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-form-page">
      <form
        className="panel preview-box"
        style={{ backgroundColor: form.style.backgroundColor }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: `calc(${form.style.fontSize} + 8px)` }}>{form.title}</h2>

        {form.fields.map((field) => (
          <div className="preview-field" key={field._id}>
            <label style={{ fontSize: form.style.fontSize }}>
              {field.label}
              {field.required && <span className="required-star">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        <button
          type="submit"
          className="preview-submit-btn"
          style={{ backgroundColor: form.style.buttonColor, fontSize: form.style.fontSize }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default DynamicForm;
