import "./form.css";

export const FormJJ = ({ title, children, variant, columns = 1 }) => {
  return (
    <div className={`formjj ${variant ? `formjj-${variant}` : ""}`}>
      {title && <h2 className="formjj_title">{title}</h2>}
      <form className={`formjj_form ${columns === 2 ? "formjj_form-2cols" : ""}`}>
        {children}
      </form>
    </div>
  );
};
