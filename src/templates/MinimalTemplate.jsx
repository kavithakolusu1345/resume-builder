import React from 'react';

const MinimalTemplate = ({ data }) => {
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
    fontSize: customization.fontSize || '13px',
    lineHeight: customization.lineSpacing || '1.5',
    padding: customization.margins || '0.75in',
    color: '#374151', // Gray 700
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '18px',
    textAlign: 'left',
    letterSpacing: '0.2px',
  };

  const accentColor = customization.accentColor || '#6b7280'; // Cool gray default

  const headerStyle = {
    textAlign: 'left',
    marginBottom: '8px',
  };

  const sectionTitleStyle = {
    fontSize: customization.headingSize || '14px',
    fontWeight: '500',
    color: '#111827',
    borderBottom: '1px solid #f3f4f6',
    paddingBottom: '4px',
    marginBottom: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  const itemHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '600',
    fontSize: '13px',
    color: '#111827',
  };

  const itemSubHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  return (
    <div style={containerStyle}>
      {/* Minimal Header */}
      <div style={headerStyle}>
        <h1 style={{ fontSize: '26px', fontWeight: '300', color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: '13px', fontWeight: '400', color: accentColor, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
            {personalInfo.professionalTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span>
              • <a href={personalInfo.linkedin} style={{ color: 'inherit', textDecoration: 'underline' }}>LinkedIn</a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              • <a href={personalInfo.github} style={{ color: 'inherit', textDecoration: 'underline' }}>GitHub</a>
            </span>
          )}
        </div>
      </div>

      {/* Profile summary */}
      {summary && (
        <div>
          <p style={{ fontSize: '12.5px', color: '#4b5563', whiteSpace: 'pre-line' }}>{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Expertise</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {skills.map((s, idx) => (
              <div key={idx} style={{ fontSize: '12px' }}>
                <span style={{ fontWeight: '600', color: '#111827' }}>{s.category}:</span> {s.items.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{exp.jobTitle}</span>
                  <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#6b7280' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={itemSubHeaderStyle}>
                  <span>{exp.company} | {exp.location}</span>
                </div>
                {exp.responsibilities && (
                  <p style={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-line', marginTop: '2px' }}>
                    {exp.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>
                    {proj.projectName}
                    {proj.technologies && <span style={{ fontWeight: 'normal', fontSize: '10px', color: '#9ca3af', marginLeft: '6px' }}>({proj.technologies})</span>}
                  </span>
                  <span style={{ fontWeight: 'normal', fontSize: '11px' }}>
                    {proj.github && <a href={proj.github} style={{ color: 'inherit', textDecoration: 'underline', marginRight: '6px' }}>GitHub</a>}
                    {proj.liveDemo && <a href={proj.liveDemo} style={{ color: 'inherit', textDecoration: 'underline' }}>Link</a>}
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#4b5563', marginTop: '2px' }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Education</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{edu.institution}</span>
                  <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#6b7280' }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280' }}>
                  <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {certifications && certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionTitleStyle}>Certifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
              {certifications.map((c, idx) => (
                <div key={idx}>
                  • {c.certificationName} ({c.issuer})
                </div>
              ))}
            </div>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionTitleStyle}>Languages</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
              {languages.map((l, idx) => (
                <span key={idx} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', padding: '2px 6px', borderRadius: '2px' }}>
                  {l.language} ({l.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div>
          {customSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <h2 style={sectionTitleStyle}>{sec.title}</h2>
              <p style={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
