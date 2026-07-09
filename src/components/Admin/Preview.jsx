function Preview({ title, fields, style }) {
  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            placeholder={field.placeholder || ""}
            disabled
            style={{ fontSize: style.fontSize }}
          />
        );

      case "dropdown":
        return (
          <select disabled style={{ fontSize: style.fontSize }}>
            <option>-- Select --</option>
            {field.options.map((opt, i) => (
              <option key={i}>{opt}</option>
            ))}
          </select>
        );

      case "checkbox":
        return field.options.length > 0 ? (
          field.options.map((opt, i) => (
            <div className="option-option" key={i}>
              <input type="checkbox" disabled />
              <span style={{ fontSize: style.fontSize }}>{opt}</span>
            </div>
          ))
        ) : (
          <div className="option-option">
            <input type="checkbox" disabled />
          </div>
        );

      case "radio":
        return field.options.length > 0 ? (
          field.options.map((opt, i) => (
            <div className="option-option" key={i}>
              <input type="radio" name={`preview-${field.label}`} disabled />
              <span style={{ fontSize: style.fontSize }}>{opt}</span>
            </div>
          ))
        ) : (
          <div className="option-option">
            <input type="radio" disabled />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="panel preview-box" style={{ backgroundColor: style.backgroundColor }}>
      <h2 style={{ fontSize: `calc(${style.fontSize} + 8px)` }}>{title || "Untitled Form"}</h2>

      {fields.length === 0 && (
        <p style={{ color: "#9ca3af" }}>Left side se fields add karein, preview yaha dikhega.</p>
      )}

      {fields.map((field) => (
        <div className="preview-field" key={field._id || field.tempId}>
          <label style={{ fontSize: style.fontSize }}>
            {field.label}
            {field.required && <span className="required-star">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      {fields.length > 0 && (
        <button
          className="preview-submit-btn"
          style={{ backgroundColor: style.buttonColor, fontSize: style.fontSize }}
          disabled
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default Preview;
