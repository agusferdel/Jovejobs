import "./buttonGroup.css";

export const ButtonGroupJJ = ({ children, align = "center" }) => {
  return (
    <div className={`buttonGroupJJ ${align}`}>
      {children}
    </div>
  );
}