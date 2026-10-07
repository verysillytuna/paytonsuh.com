// The bookshelf on /books/. `pages` sets spine thickness; `current` marks books in use now.
export type Book = {
  title: string;
  subtitle?: string;
  authors: string;
  edition?: string;
  year?: number;
  pages: number;
  current?: boolean;
  note?: string;
  href?: string;
};

export type Shelf = { subject: string; books: Book[] };

export const shelves: Shelf[] = [
  {
    subject: 'Mathematics',
    books: [
      { title: 'Principles of Mathematical Analysis', authors: 'Walter Rudin', edition: '3rd ed.', year: 1976, pages: 342, current: true, note: '“Baby Rudin.” The companion to Math 131AH.' },
      { title: 'Linear Algebra', authors: 'Stephen H. Friedberg, Arnold J. Insel & Lawrence E. Spence', edition: '5th ed.', year: 2018, pages: 600, current: true, note: 'For Math 115AH.' },
      { title: 'Lectures on Abstract Algebra', authors: 'Richard Elman', pages: 420, current: true, note: 'Elman’s UCLA notes, for Math 110AH.', href: 'https://www.math.ucla.edu/~rse/algebra_book.pdf' },
      { title: 'Calculus', authors: 'James Stewart, Daniel Clegg & Saleem Watson', edition: '9th ed.', year: 2021, pages: 1429 },
      { title: 'Elementary Linear Algebra', authors: 'Ron Larson', edition: '8th ed.', year: 2017, pages: 467 },
      { title: 'A First Course in Differential Equations', subtitle: 'with Modeling Applications', authors: 'Dennis G. Zill', edition: '10th ed.', year: 2012, pages: 489 },
    ],
  },
  {
    subject: 'Probability & Quantitative Finance',
    books: [
      { title: 'Weighing the Odds', subtitle: 'A Course in Probability and Statistics', authors: 'David Williams', year: 2001, pages: 571 },
      { title: 'A Practical Guide to Quantitative Finance Interviews', authors: 'Xinfeng Zhou', year: 2008, pages: 212, note: '“The Green Book” (量化绿皮书): brainteasers, probability, stochastic calculus, and finance.' },
    ],
  },
  {
    subject: 'Physics',
    books: [
      { title: 'Fundamentals of Physics', subtitle: 'Extended', authors: 'David Halliday, Robert Resnick & Jearl Walker', edition: '10th ed.', year: 2014, pages: 1450 },
      { title: 'Modern Physics for Scientists and Engineers', authors: 'Stephen T. Thornton & Andrew Rex', year: 2021, pages: 722 },
      { title: 'Modern Physics', authors: 'John R. Taylor, Chris D. Zafiratos & Michael A. Dubson', pages: 677 },
      { title: 'Quantum Mechanics', subtitle: 'The Theoretical Minimum', authors: 'Leonard Susskind & Art Friedman', year: 2014, pages: 385 },
    ],
  },
  {
    subject: 'Chemistry',
    books: [{ title: 'Chemistry', authors: 'Steven S. Zumdahl & Susan A. Zumdahl', edition: '9th ed.', year: 2014, pages: 1200 }],
  },
  {
    subject: 'Engineering',
    books: [
      { title: 'Circuit Analysis and Design', authors: 'Fawwaz T. Ulaby, Michel M. Maharbiz & Cynthia M. Furse', edition: '3rd ed.', year: 2025, pages: 779 },
      { title: 'Propulsion and Power', subtitle: 'An Exploration of Gas Turbine Performance Modeling', authors: 'Joachim Kurzke & Ian Halliwell', year: 2018, pages: 766 },
      { title: 'Engineering Graphics Essentials', authors: 'Kirstie Plantenberg', edition: '5th ed.', year: 2016, pages: 627 },
    ],
  },
];
