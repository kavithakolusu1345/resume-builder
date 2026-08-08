import ATSClassicTemplate from './ATSClassicTemplate';
import ModernTemplate from './ModernTemplate';
import SoftwareEngineerTemplate from './SoftwareEngineerTemplate';
import MinimalTemplate from './MinimalTemplate';
import FreshGraduateTemplate from './FreshGraduateTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';

export const templates = [
  {
    id: 'ATS Classic',
    name: 'ATS Classic',
    description: 'Clean, parsing-safe layout optimal for large corporate portals.',
    component: ATSClassicTemplate,
  },
  {
    id: 'Modern Professional',
    name: 'Modern Professional',
    description: 'Vibrant header banner with a structured sidebar column layout.',
    component: ModernTemplate,
  },
  {
    id: 'Software Engineer',
    name: 'Software Engineer',
    description: 'Compact formatting highlighting languages, projects, and GitHub links.',
    component: SoftwareEngineerTemplate,
  },
  {
    id: 'Minimal',
    name: 'Minimal',
    description: 'Generous whitespace with thin borders for a modern, elegant appeal.',
    component: MinimalTemplate,
  },
  {
    id: 'Fresh Graduate',
    name: 'Fresh Graduate',
    description: 'Prioritizes academic results, certifications, and project accomplishments.',
    component: FreshGraduateTemplate,
  },
  {
    id: 'Executive',
    name: 'Executive',
    description: 'Traditional styling highlighting leadership summaries and competencies.',
    component: ExecutiveTemplate,
  },
];

export const getTemplateById = (id) => {
  return templates.find((t) => t.id === id) || templates[0];
};
