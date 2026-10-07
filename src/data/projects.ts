// Research, projects, and reading. Add entries as they happen.
// status: 'ongoing' | 'completed' | 'planned'
export type Project = {
  title: string;
  area: string;
  status: 'ongoing' | 'completed' | 'planned';
  period: string;
  description: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: 'TODO: First project or directed reading',
    area: 'Analysis',
    status: 'ongoing',
    period: '2026–',
    description:
      'Replace this with a short description of a project, directed reading program, REU, or independent study.',
  },
];
