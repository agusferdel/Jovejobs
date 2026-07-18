import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './typeahead.css';

export const TypeaheadJJ = ({ label, id, options, selected, onChange, placeholder, emptyLabel, disabled, error, onInputChange, allowNew = false }) => {
  return (
    <div className="typeaheadjj">
      {label && <label className="typeaheadjj_label">{label}</label>}
      <Typeahead
        id={id}
        labelKey="name"
        options={options}
        selected={selected}
        onChange={onChange}
        placeholder={placeholder}
        emptyLabel={emptyLabel}
        disabled={disabled}
        onInputChange={onInputChange}
        allowNew={allowNew}
      />
      {error && <p className="typeaheadjj_error">{error}</p>}
    </div>
  );
}