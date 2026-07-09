import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios.js";
import FieldEditor from "./FieldEditor.jsx";
import Preview from "./Preview.jsx";

const FIELD_TYPES = ["text", "email", "number", "dropdown", "checkbox", "radio"];

let tempIdCounter = 0;
const generateTempId = () => `temp-${Date.now()}-${tempIdCounter++}`;

function CreateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("Untitled Form");
  const [fields, setFields] = useState([]);
  const [style, setStyle] = useState({
    buttonColor: "#4f46e5",
    backgroundColor: "#ffffff",
    fontSize: "16px",
  });
  const [newFieldType, setNewFieldType] = useState("text");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;
    const loadForm = async () => {
      try {
        const res = await API.get(`/forms/${id}`);
        setTitle(res.data.title);
        setFields(res.data.fields);
        setStyle(res.data.style);
      } catch (err) {
        console.error("Form load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [id, isEditMode]);

  const addField = () => {
    const needsOptions = ["dropdown", "checkbox", "radio"].includes(newFieldType);
    const newField = {
      tempId: generateTempId(),
      label: `New ${newFieldType} field`,
      type: newFieldType,
      placeholder: "",
      required: false,
      options: needsOptions ? ["Option 1", "Option 2"] : [],
    };
    setFields((prev) => [...prev, newField]);
  };

  const updateField = (index, updatedField) => {
    setFields((prev) => prev.map((f, i) => (i === index ? updatedField : f)));
  };

  const deleteField = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { title, fields, style };
      if (isEditMode) {
        await API.put(`/forms/${id}`, payload);
      } else {
        await API.post("/forms", payload);
      }
      navigate("/");
    } catch (err) {
      console.error("Save error:", err);
      alert("Form save karne me error aayi. Console check karein.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;

  return (
    <div className="builder-container">
      {/* LEFT SIDE - Builder Controls */}
      <div className="builder-left">
        <div className="panel">
          <h3>Form Title</h3>
          <div className="input-group">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>

        <div className="panel">
          <h3>Add Field</h3>
          <div className="add-field-row">
            <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value)}>
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <button className="btn" onClick={addField}>
              + Add Field
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Fields ({fields.length})</h3>
          {fields.length === 0 && <p style={{ color: "#9ca3af" }}>cant find any field.</p>}
          {fields.map((field, index) => (
            <FieldEditor
              key={field._id || field.tempId}
              field={field}
              onChange={(updated) => updateField(index, updated)}
              onDelete={() => deleteField(index)}
            />
          ))}
        </div>

        <div className="panel">
          <h3>Styling</h3>
          <div className="input-group">
            <label>Button Color</label>
            <input
              type="color"
              value={style.buttonColor}
              onChange={(e) => setStyle({ ...style, buttonColor: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Background Color</label>
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Font Size ({style.fontSize})</label>
            <input
              type="range"
              min="12"
              max="24"
              value={parseInt(style.fontSize)}
              onChange={(e) => setStyle({ ...style, fontSize: `${e.target.value}px` })}
            />
          </div>
        </div>

        <button className="btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : isEditMode ? "Update Form" : "Save Form"}
        </button>
      </div>

      <div className="builder-right">
        <h3 style={{ marginLeft: 4 }}>Preview</h3>
        <Preview title={title} fields={fields} style={style} />
      </div>
    </div>
  );
}

export default CreateForm;
