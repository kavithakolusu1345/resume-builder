import React from 'react';

const FreshGraduateTemplate = ({ data }) => {
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
    lineHeight: customization.lineSpacing || '1.4',
    padding: customization.margins || '0.75in',
    color: '#334155', // Slate 700
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '16px',
    textAlign: 'left',
  };

  const accentColor = customization.accentColor || '#10b981'; // Green accent for fresh/new energy

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: `6px solid ${accentColor}`,
    paddingLeft: '16px',
    marginBottom: '8px',
  };

  const sectionTitleStyle = {
    fontSize: customization.headingSize || '14px',
    fontWeight: '700',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: `2px solid ${accentColor}1A`,
    paddingBottom: '4px',
    marginBottom: '8px',
  };

  const sectionDotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: accentColor,
  };

  const itemHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '700',
    fontSize: '13px',
    color: '#0f172a',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.professionalTitle && (
            <p style={{ fontSize: '13px', fontWeight: '600', color: accentColor, marginTop: '2px' }}>
              {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div style={{ fontSize: '11px', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px', color: '#64748b' }}>
          <span>{personalInfo.email}</span>
          <span>{personalInfo.phone}</span>
          <span>{personalInfo.location}</span>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
            {personalInfo.github && <a href={personalInfo.github} style={{ color: accentColor, textDecoration: 'underline' }}>GitHub</a>}
            {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ color: accentColor, textDecoration: 'underline' }}>LinkedIn</a>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div>
          <p style={{ fontSize: '12.5px', color: '#475569', whiteSpace: 'pre-line' }}>{summary}</p>
        </div>
      )}

      {/* Education (Placed First for graduates) */}
      {education && education.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>
            <span style={sectionDotStyle}></span>
            <span>Education</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{edu.institution}</span>
                  <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#64748b' }}>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569' }}>
                  <span>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </span>
                  {edu.gpa && <span style={{ fontWeight: '600', color: accentColor }}>GPA: {edu.gpa}</span>}
                </div>
                {edu.description && (
                  <p style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', whiteSpace: 'pre-line' }}>
                    {edu.description}
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
          <h2 style={sectionTitleStyle}>
            <span style={sectionDotStyle}></span>
            <span>Academic Projects</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>
                    {proj.projectName}
                    {proj.technologies && <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({proj.technologies})</span>}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 'normal' }}>
                    {proj.github && <a href={proj.github} style={{ color: accentColor, marginRight: '6px' }}>GitHub</a>}
                    {proj.liveDemo && <a href={proj.liveDemo} style={{ color: accentColor }}>Live Link</a>}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px', whiteSpace: 'pre-line' }}>
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>
            <span style={sectionDotStyle}></span>
            <span>Technical Skills</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {skills.map((s, idx) => (
              <div key={idx} style={{ fontSize: '12px' }}>
                <strong style={{ color: '#0f172a' }}>{s.category}:</strong> {s.items.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience (Optional for graduates, but render if present) */}
      {experience && experience.length > 0 && (
        <div>
          <h2 style={sectionTitleStyle}>
            <span style={sectionDotStyle}></span>
            <span>Internships & Experience</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={itemHeaderStyle}>
                  <span>{exp.jobTitle} <span style={{ fontWeight: 'normal', color: '#64748b' }}>at {exp.company}</span></span>
                  <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#64748b' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.responsibilities && (
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', whiteSpace: 'pre-line' }}>{exp.responsibilities}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Certifications */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {achievements && achievements.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionTitleStyle}>
              <span style={sectionDotStyle}></span>
              <span>Achievements</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', color: '#64748b' }}>
              {achievements.map((ach, idx) => (
                <div key={idx}>
                  • <strong>{ach.achievement}</strong> {ach.organization ? `(${ach.organization})` : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={sectionTitleStyle}>
              <span style={sectionDotStyle}></span>
              <span>Certifications</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', color: '#64748b' }}>
              {certifications.map((c, idx) => (
                <div key={idx}>
                  • <strong>{c.certificationName}</strong> – {c.issuer}
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
              <h2 style={sectionTitleStyle}>
                <span style={sectionDotStyle}></span>
                <span>{sec.title}</span>
              </h2>
              <p style={{ fontSize: '12px', color: '#475569', whiteSpace: 'pre-line' }}>{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreshGraduateTemplate;
