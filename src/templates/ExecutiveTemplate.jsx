import React from 'react';

const ExecutiveTemplate = ({ data }) => {
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
    lineHeight: customization.lineSpacing || '1.45',
    padding: customization.margins || '1in',
    color: '#111827', // Slate 900
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '18px',
    textAlign: 'left',
  };

  const accentColor = customization.accentColor || '#1e3a8a'; // Deep Navy blue for executives

  const headerStyle = {
    textAlign: 'center',
    borderTop: `4px solid ${accentColor}`,
    borderBottom: `2px double ${accentColor}`,
    padding: '16px 0',
    marginBottom: '8px',
  };

  const sectionTitleStyle = {
    fontSize: customization.headingSize || '14px',
    fontWeight: 'bold',
    color: accentColor,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: `1.5px solid ${accentColor}`,
    paddingBottom: '3px',
    marginBottom: '8px',
  };

  const itemHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#111827',
  };

  return (
    <div style={containerStyle}>
      {/* Executive Header */}
      <div style={headerStyle}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px', color: '#111827', margin: 0, textTransform: 'uppercase' }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <div style={{ fontSize: '13px', fontWeight: '600', color: accentColor, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
            {personalInfo.professionalTitle}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#4b5563', marginTop: '8px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| <a href={personalInfo.linkedin}>LinkedIn</a></span>}
        </div>
      </div>

      {/* Professional Summary (Extremely critical for executives) */}
      {summary && (
        <div>
          <h2 style={sectionTitleStyle}>Executive Summary</h2>
          <p style={{ fontSize: '12.5px', color: '#374151', whiteSpace: 'pre-line', fontStyle: 'italic' }}>
            {summary}
          </p>
        </div>
      )}

      {/* Core Competencies / Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Core Competencies</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '12px', color: '#374151' }}>
            {skills.map((s, idx) => (
              <div key={idx}>
                • <strong>{s.category}:</strong> {s.items.slice(0, 4).join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Professional Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{exp.jobTitle}</span>
                  <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#4b5563' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontStyle: 'italic', color: '#4b5563', marginBottom: '4px' }}>
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.responsibilities && (
                  <div style={{ paddingLeft: '14px', fontSize: '12px', color: '#374151', whiteSpace: 'pre-line' }}>
                    {exp.responsibilities.split('\n').map((bullet, bIdx) => (
                      <div key={bIdx} style={{ display: 'list-item', listStyleType: 'disc', marginBottom: '2px' }}>
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

      {/* Projects / Leadership Milestones */}
      {projects && projects.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>Leadership Milestones & Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{proj.projectName}</span>
                  {proj.liveDemo && <span style={{ fontWeight: 'normal', fontSize: '11px' }}><a href={proj.liveDemo}>Project Link</a></span>}
                </div>
                <p style={{ fontSize: '11.5px', color: '#4b5563', marginTop: '2px', whiteSpace: 'pre-line' }}>{proj.description}</p>
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
                  <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#4b5563' }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#4b5563' }}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Certifications */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {certifications && certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionTitleStyle}>Certifications</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: '#4b5563' }}>
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
            <h2 style={sectionTitleStyle}>Board & Languages</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '11px' }}>
              {languages.map((l, idx) => (
                <span key={idx} style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
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
            <div key={idx} style={{ marginBottom: '8px' }}>
              <h2 style={sectionTitleStyle}>{sec.title}</h2>
              <p style={{ fontSize: '12px', color: '#374151', whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
