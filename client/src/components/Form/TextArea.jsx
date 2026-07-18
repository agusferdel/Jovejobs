import "./textArea.css"

export const TextAreaJJ = ({ label, name, value, onChange, error, rows = 5, placeholder }) => {
  return (
    <div className="textareajj">
      {label && <label className="textareajj_label" htmlFor={name}>{label}</label>}
      <textarea
        className="textareajj_textarea"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        style={{ height: `${rows * 1.5}rem` }}
      />
      {error && <p className="textareajj_error">{error}</p>}
    </div>
  );
}
