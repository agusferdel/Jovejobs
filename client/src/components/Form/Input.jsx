import "./input.css"

export const InputJJ = ({ label, name, type = "text", placeholder, value, onChange, error }) => {
  return (
    <div className="inputjj">
      {label && <label className="inputjj_label" htmlFor={name}>{label}</label>}
      <input
        className="inputjj_input"
        id={name}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <p className="inputjj_error">{error}</p>}
    </div>
  );
}
