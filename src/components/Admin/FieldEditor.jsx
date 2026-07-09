
function FieldEditor({ field, onChange, onDelete }) {
  const needsOptions = ["dropdown", "checkbox", "radio"].includes(field.type);

  const updateField = (key, value) => {
    onChange({ ...field, [key]: value });
  };

  const updateOption = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    updateField("options", newOptions);
  };

  const addOption = () => {
    updateField("options", [...field.options, `Option ${field.options.length + 1}`]);
  };

  const deleteOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    updateField("options", newOptions);
  };

  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-type-badge">{field.type}</span>
        <button className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div className="input-group">
        <label>Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField("label", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Placeholder</label>
        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => updateField("placeholder", e.target.value)}
          disabled={needsOptions}
        />
      </div>

      <div className="checkbox-row input-group">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => updateField("required", e.target.checked)}
          id={`required-${field._id || field.tempId}`}
        />
        <label htmlFor={`required-${field._id || field.tempId}`} style={{ marginBottom: 0 }}>
          Required
        </label>
      </div>

      {needsOptions && (
        <div className="options-list">
          <label>Options</label>
          {field.options.map((opt, i) => (
            <div className="option-row" key={i}>
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
              <button className="btn btn-danger" onClick={() => deleteOption(i)}>
                ✕
              </button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addOption}>
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
}

export default FieldEditor;
