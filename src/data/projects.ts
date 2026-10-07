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
    title: 'ZrC-ARC: Zirconium Carbide Architected Refractory Coatings',
    area: 'Materials Science',
    status: 'ongoing',
    period: '2026–',
    description:
      'Co-investigator on a student team from UC Berkeley, UCLA, and UC Irvine studying how the size, shape, and alignment of grains in zirconium carbide coatings affect their resistance to hot hydrogen at 1500–2500 K, the failure mode behind delamination in hypersonic scramjets and nuclear thermal propulsion. The work combines LAMMPS and COMSOL simulation with physical prototyping, thermal cycling to 1900 K, and SEM/XRD characterization assisted by a machine-learning image pipeline, under the guidance of Prof. Daniel R. Mumm at the UC Irvine Materials Research Institute. Awarded a $10,000 seed grant from the NASA L’SPACE Program (Spring 2026) in a national proposal competition.',
  },
  {
    title: 'Stellar Light Curve Analysis',
    area: 'Astrophysics · Data Science',
    status: 'completed',
    period: '2025–June 2026',
    description:
      'Python and machine-learning pipeline to extract, decompose, and analyze stellar light curves from public survey data and flag anomalous emission. Co-authored a research submission reporting a previously unreported variable star with frequent high-energy flares.',
  },
];
