import React from 'react';

const SoftwareEngineerTemplate = ({ data }) => {
  const {
    personalInfo = {},
    summary = '',
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = [],
    achievements = [],
    languages = [],
    customSections = [],
    customization = {},
  } = data;

  const fontStack =
    customization.fontFamily === 'Garamond'
      ? 'Georgia, Garamond, serif'
      : customization.fontFamily === 'Roboto'
      ? '"Roboto", sans-serif'
      : customization.fontFamily === 'Arial'
      ? 'Arial, sans-serif'
      : '"Inter", sans-serif';

  const containerStyle = {
    fontFamily: fontStack,
    fontSize: customization.fontSize || '12.5px',
    lineHeight: customization.lineSpacing || '1.35',
    padding: customization.margins || '0.5in',
    color: '#0f172a', // Slate 900
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '12px',
    textAlign: 'left',
  };

  const accentColor = customization.accentColor || '#0284c7'; // Light Blue/Sky 600

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: `2px solid ${accentColor}`,
    paddingBottom: '8px',
  };

  const sectionHeaderStyle = {
    fontSize: customization.headingSize || '13px',
    fontWeight: 'bold',
    color: accentColor,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '2px',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const itemHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '12.5px',
  };

  const itemSubHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '2px',
  };

  return (
    <div style={containerStyle}>
      {/* Name and Contacts */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.professionalTitle && (
            <p style={{ fontSize: '13px', fontWeight: '500', color: accentColor, marginTop: '2px' }}>
              {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div style={{ fontSize: '11px', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px', color: '#334155' }}>
          <span>{personalInfo.email} {personalInfo.phone ? ` | ${personalInfo.phone}` : ''}</span>
          <span>{personalInfo.location}</span>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
            {personalInfo.github && <a href={personalInfo.github} style={{ color: accentColor, textDecoration: 'underline' }}>GitHub</a>}
            {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ color: accentColor, textDecoration: 'underline' }}>LinkedIn</a>}
            {personalInfo.portfolio && <a href={personalInfo.portfolio} style={{ color: accentColor, textDecoration: 'underline' }}>Portfolio</a>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <p style={{ fontSize: '12px', color: '#334155', whiteSpace: 'pre-line' }}>{summary}</p>
        </div>
      )}

      {/* Skills (Top placement for SWEs) */}
      {skills && skills.length > 0 && (
        <div>
          <h2 style={sectionHeaderStyle}>Technical Skills</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {skills.map((s, idx) => (
              <div key={idx} style={{ fontSize: '12px' }}>
                <strong style={{ color: '#0f172a' }}>{s.category}:</strong> {s.items.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div>
          <h2 style={sectionHeaderStyle}>Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{exp.jobTitle} <span style={{ fontWeight: 'normal', color: '#64748b' }}>at {exp.company}</span></span>
                  <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#64748b' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={itemSubHeaderStyle}>
                  <span>{exp.location}</span>
                </div>
                {exp.responsibilities && (
                  <div style={{ paddingLeft: '14px', fontSize: '11.5px', color: '#334155', whiteSpace: 'pre-line', marginTop: '2px' }}>
                    {exp.responsibilities.split('\n').map((bullet, bIdx) => (
                      <div key={bIdx} style={{ display: 'list-item', listStyleType: 'square', marginBottom: '1px' }}>
                        {bullet.trim().startsWith('-') || bullet.trim().startsWith('•')
                          ? bullet.trim().substring(1).trim()
                          : bullet.trim()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 style={sectionHeaderStyle}>Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>
                    {proj.projectName}
                    {proj.technologies && <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({proj.technologies})</span>}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 'normal' }}>
                    {proj.github && <a href={proj.github} style={{ color: accentColor, textDecoration: 'underline', marginRight: '6px' }}>GitHub</a>}
                    {proj.liveDemo && <a href={proj.liveDemo} style={{ color: accentColor, textDecoration: 'underline' }}>Live Link</a>}
                  </span>
                </div>
                {proj.description && (
                  <p style={{ fontSize: '11.5px', color: '#334155', whiteSpace: 'pre-line', marginTop: '2px' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <h2 style={sectionHeaderStyle}>Education</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{edu.institution}</span>
                  <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#64748b' }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  {edu.gpa && <span style={{ fontWeight: 'bold', color: '#0f172a' }}>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages (Flex Side-by-Side) */}
      <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
        {certifications && certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionHeaderStyle}>Certifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', fontSize: '11px', color: '#334155' }}>
              {certifications.map((c, idx) => (
                <div key={idx}>
                  • {c.certificationName} – {c.issuer}
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionHeaderStyle}>Languages</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: '#334155' }}>
              {languages.map((l, idx) => (
                <div key={idx} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                  <strong>{l.language}:</strong> {l.proficiency}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div>
          {customSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <h2 style={sectionHeaderStyle}>{sec.title}</h2>
              <p style={{ fontSize: '11.5px', color: '#334155', whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoftwareEngineerTemplate;
