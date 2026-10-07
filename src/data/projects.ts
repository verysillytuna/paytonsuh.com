// Research and projects shown on /research/. Add entries as they happen.
export type Project = {
  title: string;
  area: string;
  status: 'ongoing' | 'completed' | 'planned';
  period: string;
  description: string;
  /** Distinct roles held over the project's life, newest first. */
  roles?: { title: string; period: string; description: string }[];
  /** A dedicated page on this site with more detail. */
  page?: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: 'ZrC-ARC: Zirconium Carbide Architected Refractory Coatings',
    area: 'Materials Science',
    status: 'ongoing',
    period: 'January 2026–',
    page: '/research/zrc-arc/',
    description:
      'How the size, shape, and alignment of grains in zirconium carbide coatings govern their survival in hot hydrogen at 1500–2500 K, the failure mode behind coating delamination in hypersonic scramjets and nuclear thermal propulsion. Advised by Prof. Daniel R. Mumm, UC Irvine Materials Research Institute. $10,000 seed grant, NASA L’SPACE Program (Spring 2026).',
    roles: [
      {
        title: 'Co-Investigator',
        period: 'October 2026–',
        description:
          'Leads the research and simulation side of the project: molecular-dynamics modeling in LAMMPS of grain morphology, thermal-expansion mismatch, and carbon vacancies in the ZrC lattice.',
      },
      {
        title: 'Principal Investigator',
        period: 'January–October 2026',
        description:
          'Led the project from its founding: assembled the team across UC Berkeley, UCLA, and UC Irvine, and wrote the proposal that won the NASA L’SPACE seed grant in a national competition.',
      },
    ],
  },
  {
    title: 'Stellar Light Curve Analysis',
    area: 'Astrophysics · Data Science',
    status: 'completed',
    period: '2025–June 2026',
    page: '/research/light-curves/',
    description:
      'Python and machine-learning pipeline to extract, decompose, and analyze stellar light curves from public survey data and flag anomalous emission. Co-authored a research submission reporting a previously unreported variable star with frequent high-energy flares.',
  },
];
