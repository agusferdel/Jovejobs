import "./card.css";
export const Cardjj = ({ children, variant = "",className="" }) => {
  return (
     <article className={`cardjj ${variant} ${className}`}>
      {children}
    </article>
  )
}
