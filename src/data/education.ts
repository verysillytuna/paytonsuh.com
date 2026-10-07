// Education history shown on /education/.
export type CourseGroup = { subject: string; courses: { code: string; name: string; note?: string }[] };

export type School = {
  name: string;
  credential: string;
  period: string;
  details?: string[];
  activities?: string[];
  coursework?: CourseGroup[];
  courseworkLabel?: string;
  footnote?: string;
};

export const schools: School[] = [
  {
    name: 'University of California, Los Angeles',
    credential: 'B.S. Mathematics, expected June 2028',
    period: 'Sep 2026 – present',
    details: ['Applying to the Departmental Scholars Program (concurrent B.S./M.A. in Mathematics).'],
    courseworkLabel: 'Coursework',
    coursework: [
      {
        subject: 'In progress (honors)',
        courses: [
          { code: 'MATH 110AH', name: 'Algebra' },
          { code: 'MATH 115AH', name: 'Linear Algebra' },
          { code: 'MATH 131AH', name: 'Analysis' },
        ],
      },
      {
        subject: 'Planned',
        courses: [
          { code: '', name: 'Abstract Algebra' },
          { code: '', name: 'Real Analysis' },
          { code: '', name: 'Complex Analysis' },
          { code: '', name: 'Geometric Analysis' },
          { code: '', name: 'Topology' },
          { code: '', name: 'Probability Theory' },
          { code: '', name: 'Stochastic Calculus' },
        ],
      },
    ],
  },
  {
    name: 'Santa Monica College',
    credential: 'A.S.-T. Mathematics & A.S. General Science',
    period: 'Aug 2024 – Jun 2026',
    details: ['Cumulative GPA 3.85/4.00 · Dean’s List 2024–2026', 'Began full-time at sixteen; transferred to UCLA.'],
    activities: [
      'Student Instructor, SMC Science Tutoring Center: physics and chemistry, 10+ sessions weekly.',
      'Volunteered at the opening of SMC’s new laboratory building, demonstrating physics experiments to community members.',
    ],
    courseworkLabel: 'Relevant coursework',
    coursework: [
      {
        subject: 'Mathematics',
        courses: [
          { code: 'MATH 8', name: 'Calculus II' },
          { code: 'MATH 11', name: 'Calculus III' },
          { code: 'MATH 13', name: 'Linear Algebra' },
          { code: 'MATH 15', name: 'Differential Equations' },
        ],
      },
      {
        subject: 'Physics',
        courses: [
          { code: 'PHYSCS 21', name: 'Mechanics' },
          { code: 'PHYSCS 22', name: 'Electricity & Magnetism' },
          { code: 'PHYSCS 23', name: 'Fluids, Waves, Thermodynamics & Optics' },
          { code: 'PHYSCS 24', name: 'Modern Physics' },
        ],
      },
      {
        subject: 'Chemistry',
        courses: [
          { code: 'CHEM 11', name: 'General Chemistry I' },
          { code: 'CHEM 12', name: 'General Chemistry II' },
        ],
      },
      {
        subject: 'Engineering',
        courses: [
          { code: 'ENGR 11', name: 'SolidWorks' },
          { code: 'ENGR 21 + 22', name: 'Circuits, lecture and lab' },
          { code: 'ENGR 220', name: 'MATLAB', note: 'Cerritos College' },
        ],
      },
      {
        subject: 'Computer Science',
        courses: [
          { code: 'CS 87A', name: 'Python' },
          { code: 'CS 52', name: 'C++' },
          { code: 'CS 20A', name: 'Data Structures in C++' },
          { code: 'COMSC 156', name: 'Data Science', note: 'Diablo Valley College' },
        ],
      },
    ],
  },
  {
    name: 'The Science Academy STEM Magnet',
    credential: 'High School Diploma',
    period: 'Aug 2022 – Jun 2024',
    details: [
      'Graduated after sophomore year to continue at Santa Monica College.',
      'Ranked #1 among California high schools.',
    ],
    activities: [
      'Scholastic Art & Writing Awards: Gold Key, Poetry',
      'Scholastic Art & Writing Awards: Silver Key, Poetry',
      'Science Olympiad: four-time medalist',
      'National Speech & Debate',
    ],
    courseworkLabel: 'Coursework',
    coursework: [
      {
        subject: 'AP (10th grade)',
        courses: [
          { code: '', name: 'Biology' },
          { code: '', name: 'Chemistry' },
          { code: '', name: 'Calculus AB' },
          { code: '', name: 'World History' },
          { code: '', name: 'Japanese' },
        ],
      },
      {
        subject: 'Dual enrollment',
        courses: [
          { code: 'SPANISH 1', name: 'Elementary Spanish I' },
          { code: 'SPANISH 2', name: 'Elementary Spanish II' },
          { code: 'SPANISH 3', name: 'Intermediate Spanish I' },
          { code: 'HEALTH 11', name: 'Principles of Healthy Living' },
          { code: 'COUNSEL 20', name: 'Post-Secondary Education' },
          { code: 'FINANCE 8', name: 'Personal Finance' },
        ],
      },
    ],
  },
];
