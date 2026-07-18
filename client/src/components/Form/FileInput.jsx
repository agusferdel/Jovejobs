import './fileInput.css';

export const FileInputJJ = ({ label, name, hint, onChange, error, icon, selectedFile }) => {
  return (
    <div className="fileinputjj">
      <label className="fileinputjj_label" htmlFor={name}>
        {icon && <span className="fileinputjj_icon">{icon}</span>}
        {label}
        <small className="fileinputjj_selected">
        {selectedFile ? `Archivo: ${selectedFile.name}` : "No se ha seleccionado ningún archivo"}
      </small>
      </label>
      {hint && <small className="fileinputjj_hint">{hint}</small>}
      <input
        className="fileinputjj_input"
        id={name}
        type="file"
        name={name}
        onChange={onChange}
        hidden
      />
      {error && <p className="fileinputjj_error">{error}</p>}
    </div>
  );
}