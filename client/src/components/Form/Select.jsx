import "./select.css"

export const SelectJJ = ({ label, name, value, onChange, error, dbTable, dbTableId, dbTableName, compositeKey }) => {

  const getKey = (element) => {
    if (compositeKey) {
      return compositeKey.map(key => element[key]).join("-");
    }
    return element[dbTableId];
  }

  return (
    <div className="selectjj">
      {label && <label className="selectjj_label" htmlFor={name}>{label}</label>}
      <select
        className="selectjj_select"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="" disabled hidden>Selecciona una opción</option>
        {dbTable?.map((element) => (
          <option key={getKey(element)} value={getKey(element)}>
            {element[dbTableName]}
          </option>
        ))}
      </select>
      {error && <p className="selectjj_error">{error}</p>}
    </div>
  );
}
