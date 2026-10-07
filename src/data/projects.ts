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
    title: 'ZrC-ARC: Zirconium Carbide Architected Refractory Coatings for Nuclear Thermal Propulsion',
    area: 'Materials Science',
    status: 'ongoing',
    period: '2026–',
    description:
      'Principal investigator on a student-led project studying how granular morphology affects the performance of refractory coatings for nuclear thermal propulsion, working with Prof. Daniel R. Mumm at the UC Irvine Materials Research Institute. Won a national proposal-writing competition and $10,000 in seed funding.',
  },
  {
    title: 'Stellar Light Curve Analysis',
    area: 'Astrophysics · Data Science',
    status: 'ongoing',
    period: '2025–',
    description:
      'Python and machine-learning pipeline to extract, decompose, and analyze stellar light curves from public survey data and flag anomalous emission. Co-authored a research submission reporting a previously unreported variable star with frequent high-energy flares.',
  },
  {
    title: 'AIAA Team Space Design Competition',
    area: 'Aerospace Engineering',
    status: 'ongoing',
    period: '2025–',
    description:
      'Founded the American Institute of Aeronautics and Astronautics student initiative at Santa Monica College and led a six-member interdisciplinary team designing, prototyping, and testing aerospace projects for the AIAA Spring Team Space Design Competition.',
  },
];
