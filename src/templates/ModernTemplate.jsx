import React from 'react';

const ModernTemplate = ({ data }) => {
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
    color: '#1f2937',
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  };

  const accentColor = customization.accentColor || '#4f46e5';

  const headerStyle = {
    background: `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)`,
    color: '#ffffff',
    padding: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
  };

  const nameStyle = {
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    margin: 0,
    color: '#ffffff',
  };

  const sidebarStyle = {
    width: '32%',
    padding: '30px 20px 30px 40px',
    borderRight: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '16px',
    boxSizing: 'border-box',
  };

  const mainStyle = {
    flex: 1,
    padding: '30px 40px 30px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '16px',
    boxSizing: 'border-box',
  };

  const sectionTitleStyle = {
    fontSize: customization.headingSize || '14px',
    fontWeight: '800',
    textTransform: 'uppercase',
    color: accentColor,
    borderBottom: `2px solid ${accentColor}33`,
    paddingBottom: '4px',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  };

  const itemTitleStyle = {
    fontWeight: '700',
    fontSize: '13px',
    color: '#111827',
  };

  const itemSubStyle = {
    fontSize: '11px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
  };

  return (
    <div style={containerStyle}>
      {/* Top Header Banner */}
      <div style={headerStyle}>
        <div>
          <h1 style={nameStyle}>{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.professionalTitle && (
            <p style={{ fontSize: '15px', color: '#e0e7ff', fontWeight: 500, marginTop: '4px' }}>
              {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div style={{ fontSize: '11px', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', color: '#e0e7ff' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
            {personalInfo.linkedin && <a href={personalInfo.linkedin} style={{ color: '#ffffff', textDecoration: 'underline' }}>LinkedIn</a>}
            {personalInfo.github && <a href={personalInfo.github} style={{ color: '#ffffff', textDecoration: 'underline' }}>GitHub</a>}
          </div>
        </div>
      </div>

      {/* Main Body: 2 Columns */}
      <div style={{ display: 'flex', width: '100%' }}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 style={sectionTitleStyle}>Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills.map((skill, idx) => (
                  <div key={idx} style={{ fontSize: '12px' }}>
                    <strong style={{ color: '#374151' }}>{skill.category}</strong>
                    <div style={{ color: '#6b7280', marginTop: '2px' }}>{skill.items.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 style={sectionTitleStyle}>Education</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ fontSize: '12px' }}>
                    <div style={itemTitleStyle}>{edu.institution}</div>
                    <div style={{ color: '#4b5563', fontSize: '11px' }}>{edu.degree}</div>
                    <div style={{ color: '#9ca3af', fontSize: '10px' }}>{edu.startDate} - {edu.endDate}</div>
                    {edu.gpa && <div style={{ fontSize: '11px', color: accentColor, fontWeight: 600 }}>GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 style={sectionTitleStyle}>Languages</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {languages.map((lang, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{lang.language}</strong>
                    <span style={{ color: '#6b7280' }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Side */}
        <div style={mainStyle}>
          {/* Summary */}
          {summary && (
            <div>
              <h2 style={sectionTitleStyle}>Profile</h2>
              <p style={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-line' }}>{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2 style={sectionTitleStyle}>Experience</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={itemTitleStyle}>{exp.jobTitle}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div style={itemSubStyle}>{exp.company} | {exp.location}</div>
                    {exp.responsibilities && (
                      <div style={{ paddingLeft: '14px', fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-line' }}>
                        {exp.responsibilities.split('\n').map((bullet, bIdx) => (
                          <div key={bIdx} style={{ display: 'list-item', listStyleType: 'circle', marginBottom: '2px' }}>
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
              <h2 style={sectionTitleStyle}>Projects</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={itemTitleStyle}>
                        {proj.projectName}
                        {proj.technologies && <span style={{ fontWeight: 'normal', fontSize: '10px', color: '#6b7280', marginLeft: '6px' }}>({proj.technologies})</span>}
                      </span>
                    </div>
                    <p style={{ fontSize: '11.5px', color: '#4b5563', marginTop: '2px', whiteSpace: 'pre-line' }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Achievements */}
          {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
            <div>
              <h2 style={sectionTitleStyle}>Honors & Certifications</h2>
              <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '12px', color: '#4b5563' }}>
                {certifications.map((c, idx) => (
                  <li key={`c-${idx}`} style={{ marginBottom: '3px' }}>
                    <strong>{c.certificationName}</strong> – {c.issuer} ({c.date})
                  </li>
                ))}
                {achievements.map((a, idx) => (
                  <li key={`a-${idx}`} style={{ marginBottom: '3px' }}>
                    <strong>{a.achievement}</strong> {a.organization ? `at ${a.organization}` : ''} ({a.date})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && (
            <div>
              {customSections.map((sec, idx) => (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <h2 style={sectionTitleStyle}>{sec.title}</h2>
                  <p style={{ fontSize: '12px', color: '#4b5563', whiteSpace: 'pre-line' }}>{sec.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
