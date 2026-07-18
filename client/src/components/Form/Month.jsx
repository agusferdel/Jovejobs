import "./month.css"

export const MonthJJ = ({ label, name, value, onChange, error }) => {
  return (
    <div className="inputMonthjj">
      {label && <label className="inputMonthjj_label" htmlFor={name}>{label}</label>}
      <input
        className="inputMonthjj_input"
        id={name}
        type="month"
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <p className="inputMonthjj_error">{error}</p>}
    </div>
  );
}
