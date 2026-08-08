import React from 'react';

const ATSClassicTemplate = ({ data }) => {
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
    sectionOrder = [],
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
    color: '#111827',
    background: '#ffffff',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: customization.sectionSpacing || '16px',
    textAlign: 'left',
  };

  const headerStyle = {
    textAlign: 'center',
    borderBottom: `2px solid ${customization.accentColor || '#111827'}`,
    paddingBottom: '8px',
  };

  const nameStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: customization.accentColor || '#111827',
    marginBottom: '4px',
  };

  const contactStyle = {
    fontSize: '11px',
    color: '#4b5563',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  };

  const sectionTitleStyle = {
    fontSize: customization.headingSize || '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: customization.accentColor || '#111827',
    borderBottom: '1px solid #d1d5db',
    paddingBottom: '2px',
    marginBottom: '8px',
  };

  const itemTitleStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '13px',
  };

  const itemSubStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontStyle: 'italic',
    fontSize: '12px',
    color: '#4b5563',
    marginBottom: '4px',
  };

  const renderSection = (secName) => {
    switch (secName) {
      case 'personalInfo':
        return null; // Rendered in header

      case 'summary':
        if (!summary) return null;
        return (
          <div key="summary">
            <h2 style={sectionTitleStyle}>Professional Summary</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{summary}</p>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div key="experience">
            <h2 style={sectionTitleStyle}>Professional Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div style={itemTitleStyle}>
                    <span>{exp.jobTitle}</span>
                    <span>{exp.location}</span>
                  </div>
                  <div style={itemSubStyle}>
                    <span>{exp.company}</span>
                    <span>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <div style={{ paddingLeft: '16px', margin: '4px 0 0 0', whiteSpace: 'pre-line' }}>
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
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects">
            <h2 style={sectionTitleStyle}>Academic & Personal Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div style={itemTitleStyle}>
                    <span>
                      {proj.projectName}
                      {proj.technologies && (
                        <span style={{ fontWeight: 'normal', fontSize: '11px', color: '#4b5563', marginLeft: '6px' }}>
                          ({proj.technologies})
                        </span>
                      )}
                    </span>
                    <span>
                      {proj.github && (
                        <a
                          href={proj.github}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: 'underline', color: 'inherit', marginRight: '8px' }}
                        >
                          GitHub
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a
                          href={proj.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          style={{ textDecoration: 'underline', color: 'inherit' }}
                        >
                          Demo
                        </a>
                      )}
                    </span>
                  </div>
                  <p style={{ whiteSpace: 'pre-line', fontSize: '12px', marginTop: '2px' }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <div key="skills">
            <h2 style={sectionTitleStyle}>Technical Skills</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ fontSize: '12px' }}>
                  <strong>{skill.category}:</strong> {skill.items.join(', ')}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <div key="education">
            <h2 style={sectionTitleStyle}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={itemTitleStyle}>
                    <span>{edu.institution}</span>
                    <span>{edu.gpa ? `GPA: ${edu.gpa}` : ''}</span>
                  </div>
                  <div style={itemSubStyle}>
                    <span>
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                    <span>
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  {edu.description && <p style={{ fontSize: '12px', whiteSpace: 'pre-line' }}>{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications">
            <h2 style={sectionTitleStyle}>Certifications</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', fontSize: '12px' }}>
              {certifications.map((cert, idx) => (
                <div key={idx}>
                  • <strong>{cert.certificationName}</strong> – {cert.issuer} ({cert.date})
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (!achievements || achievements.length === 0) return null;
        return (
          <div key="achievements">
            <h2 style={sectionTitleStyle}>Honors & Achievements</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              {achievements.map((ach, idx) => (
                <div key={idx}>
                  • <strong>{ach.achievement}</strong> {ach.organization ? `at ${ach.organization}` : ''} ({ach.date})
                  {ach.description && <span style={{ color: '#4b5563' }}> - {ach.description}</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <div key="languages">
            <h2 style={sectionTitleStyle}>Languages</h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px' }}>
              {languages.map((lang, idx) => (
                <div key={idx}>
                  <strong>{lang.language}:</strong> {lang.proficiency}
                </div>
              ))}
            </div>
          </div>
        );

      case 'customSections':
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="customSections">
            {customSections.map((sec, idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <h2 style={sectionTitleStyle}>{sec.title}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{sec.content}</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={nameStyle}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.professionalTitle && (
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: '#4b5563' }}>
            {personalInfo.professionalTitle}
          </div>
        )}
        <div style={contactStyle}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span>
              | <a href={personalInfo.linkedin}>LinkedIn</a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              | <a href={personalInfo.github}>GitHub</a>
            </span>
          )}
          {personalInfo.portfolio && (
            <span>
              | <a href={personalInfo.portfolio}>Portfolio</a>
            </span>
          )}
        </div>
      </div>

      {/* Reorderable sections */}
      {sectionOrder.map((section) => renderSection(section))}
    </div>
  );
};

export default ATSClassicTemplate;
