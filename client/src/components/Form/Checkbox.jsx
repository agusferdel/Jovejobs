import "./checkbox.css"

export const CheckboxJJ = ({ label, name, value, onChange, error }) => {
  return (
    <div className="checkboxjj">
      <input
        className="checkboxjj_input"
        id={name}
        type="checkbox"
        name={name}
        checked={value}
        onChange={onChange}
      />
      {label && <label className="checkboxjj_label" htmlFor={name}>{label}</label>}
      {error && <p className="checkboxjj_error">{error}</p>}
    </div>
  );
}
