import "./container.css";

export const Containerjj = ({ children, variant = "", className = "" }) => {
  return (
      <section className={`containerjj ${variant} ${className}`}>
      {children}
    </section>
  )
}
