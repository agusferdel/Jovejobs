import "./button.css"
 
export const ButtonJJ = ({ children, onClick, variant="primary", type="button", disabled=false}) => {
 
  return (
    <button type={type} className={`btnjj btnjj-${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
