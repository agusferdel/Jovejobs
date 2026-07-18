import './checkboxGroup.css';

export const CheckboxGroupJJ = ({ label, name, options, value, onChange, error }) => {
  
  const selectedValues = value ? value.split(',') : [];

  return (
    <div className="checkboxgroupjj">
      {label && <p className="checkboxgroupjj_label">{label}</p>}
      <div className="checkboxgroupjj_options">
        {options.map((option) => (
          <div key={option.id} className="checkboxgroupjj_item">
            <input
              className="checkboxgroupjj_input"
              type="checkbox"
              id={`${name}-${option.id}`}
              name={name}
              value={option.id}
              checked={selectedValues.includes(option.id)}
              onChange={onChange}
            />
            <label className="checkboxgroupjj_itemlabel" htmlFor={`${name}-${option.id}`}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="checkboxgroupjj_error">{error}</p>}
    </div>
  );
}
