// Research and projects shown on /research/. Add entries as they happen.
export type Project = {
  title: string;
  area: string;
  status: 'ongoing' | 'completed' | 'planned';
  period: string;
  description: string;
  /** Distinct roles held over the project's life, newest first. */
  roles?: { title: string; period: string; description: string }[];
  /** Parallel lines of work inside one project. */
  threads?: { title: string; area: string; description: string }[];
  /** A dedicated page on this site with more detail. */
  page?: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: 'BruinML',
    area: 'Mathematics · Machine Learning',
    status: 'ongoing',
    period: '2026–',
    description:
      'Researcher at BruinML, working on three problems where geometry and analysis meet learning systems.',
    threads: [
      {
        title: 'Cauchy–Pompeiu Bounds on Near-Holomorphic Neural Networks',
        area: 'Complex Analysis',
        description:
          'The Cauchy–Pompeiu formula writes a smooth function on a domain in terms of its boundary values and its ∂̄-derivative, so it measures how far the function is from holomorphic. This project uses it to bound networks that are close to, but not exactly, holomorphic.',
      },
      {
        title: 'Mean Curvature Flow of Lie Subgroups',
        area: 'Geometric Analysis',
        description:
          'Mean curvature flow moves a submanifold in the direction of its mean curvature vector, so that it decreases its area as fast as possible. This project studies the flow when the submanifold is a Lie subgroup of a Lie group.',
      },
      {
        title: 'Physical AI: Origami Robotics',
        area: 'Robotics',
        description: 'Learning and control for robots built from folded, origami-inspired structures.',
      },
    ],
  },
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
    period: 'October 2025–June 2026',
    page: '/research/light-curves/',
    description:
      'Python and machine-learning pipeline to extract, decompose, and analyze stellar light curves from public survey data and flag anomalous emission. Co-authored a research submission reporting a previously unreported variable star with frequent high-energy flares. An early version, comparing data from two satellites, was my Physics 23 project at Santa Monica College.',
  },
];
