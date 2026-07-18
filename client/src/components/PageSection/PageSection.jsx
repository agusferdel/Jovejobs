import './pageSection.css';

export const PageSection = ({ children, variant = 'default', align="center" }) => {
  return (
    <section
      className={`page_section ${variant ? `page_section-${variant}` : ''} ${align ? `vertical-align-${align}` : ''}` }
    >
      {children}
    </section>
  );
};
