// Summer research programs and alternatives for mathematics undergraduates, gathered October 2026.
// Deadlines are from the 2026 cycle unless marked otherwise; 2027 calls post November–January.
// Source: workbench applications/reu-2027.md (personal fit notes removed).

export interface Program {
  name: string;
  host: string;
  area: string;
  kind: 'REU' | 'School' | 'Counselor' | 'Online' | 'Courses';
  stipend?: string;
  deadline: string; // as shown
  sort: string; // MM-DD of the last known deadline, for ordering ('99' = unknown)
  url: string;
  note?: string;
}

export const programs: Program[] = [
  { name: 'Fields Undergraduate Summer Research Program', host: 'Fields Institute, Toronto', area: 'Pure and applied', kind: 'REU', deadline: 'Jan 5', sort: '01-05', url: 'https://www.fields.utoronto.ca/', note: 'Some places by university nomination.' },
  { name: 'PCMI Undergraduate Summer School', host: 'IAS, Park City', area: 'Lecture school', kind: 'School', stipend: 'Usually funded', deadline: 'Jan 31 (2025 and 2026)', sort: '01-31', url: 'https://www.ias.edu/pcmi', note: 'Lectures rather than research; open to undergraduates at all levels.' },
  { name: 'Indiana University REU', host: 'IU Bloomington', area: 'Pure', kind: 'REU', stipend: 'Stipend, housing, meals', deadline: 'Feb 1', sort: '02-01', url: 'https://math.indiana.edu/undergraduate/reu-summer-research-program.html' },
  { name: 'Michigan REU', host: 'University of Michigan', area: 'Varied, many pure', kind: 'REU', stipend: '$5,600 + up to $1,500 housing/travel', deadline: 'Feb 2', sort: '02-02', url: 'https://lsa.umich.edu/math' },
  { name: 'SMALL', host: 'Williams College', area: 'Number theory, geometry, combinatorics', kind: 'REU', deadline: 'Feb 2', sort: '02-02', url: 'https://math.williams.edu/small/' },
  { name: 'DIMACS REU', host: 'Rutgers', area: 'Discrete math, theoretical CS', kind: 'REU', deadline: 'Feb 5', sort: '02-05', url: 'https://dimacs.rutgers.edu/reu-main', note: 'Says it mainly takes students who apply as juniors.' },
  { name: 'UChicago REU', host: 'University of Chicago', area: 'Courses + expository paper', kind: 'REU', stipend: 'Likely unfunded for outside students', deadline: 'Feb 6', sort: '02-06', url: 'https://math.uchicago.edu/~may/REU2026/' },
  { name: 'IPAM RIPS', host: 'IPAM, UCLA', area: 'Industrial team projects', kind: 'REU', stipend: 'Stipend', deadline: 'Feb 20 (extended from Feb 10)', sort: '02-20', url: 'https://www.ipam.ucla.edu/programs/student-research-programs/', note: 'Application opens in November.' },
  { name: 'Mathcamp junior counselor', host: 'Canada/USA Mathcamp', area: 'Teaching', kind: 'Counselor', deadline: 'Feb 11', sort: '02-11', url: 'https://www.mathcamp.org/jobs/college_students/' },
  { name: 'Duluth REU', host: 'University of Minnesota Duluth', area: 'Combinatorics, number theory, algebra', kind: 'REU', stipend: '$5,500', deadline: 'Feb 13', sort: '02-13', url: 'https://www.d.umn.edu/~jgallian/REU.html' },
  { name: 'REU in Combinatorics and Algebra', host: 'University of Minnesota Twin Cities', area: 'Algebraic combinatorics', kind: 'REU', deadline: 'Feb 13', sort: '02-13', url: 'https://www.mathprograms.org/db/UMN/REUCA' },
  { name: 'Summer@ICERM', host: 'Brown University', area: 'Theme varies by year', kind: 'REU', deadline: 'Feb 15', sort: '02-15', url: 'https://icerm.brown.edu/summerug/' },
  { name: 'MSRI-UP', host: 'SLMath, Berkeley', area: 'Theme varies (2027: applied statistics)', kind: 'REU', deadline: 'Priority Feb 15', sort: '02-15', url: 'https://www.slmath.org/', note: 'Aimed at students from underrepresented groups. Opens mid-November.' },
  { name: 'Iowa State REU', host: 'Iowa State', area: 'Mixed', kind: 'REU', stipend: '$5,000', deadline: 'Feb 16', sort: '02-16', url: 'https://mathreu.org/', note: 'Reportedly runs every other year.' },
  { name: 'Georgia Tech REU', host: 'Georgia Tech', area: 'Mixed', kind: 'REU', stipend: 'Stipend', deadline: 'Feb 20', sort: '02-20', url: 'https://math.gatech.edu/' },
  { name: 'Ross Program counselor', host: 'Ross Program, Ohio', area: 'Teaching number theory', kind: 'Counselor', stipend: '$6,500 for 6 weeks', deadline: 'Feb 28', sort: '02-28', url: 'https://rossprogram.org/' },
  { name: 'Emory REU', host: 'Emory University', area: 'Number theory, combinatorics', kind: 'REU', deadline: 'Mar 1 (review from Feb 1)', sort: '03-01', url: 'https://www.math.emory.edu/' },
  { name: 'Budapest Semesters summer', host: 'Budapest Semesters in Mathematics', area: 'Courses', kind: 'Courses', stipend: 'Tuition', deadline: 'About Mar 1', sort: '03-01', url: 'https://www.budapestsemesters.com/summer-program/' },
  { name: 'PROMYS counselor', host: 'Boston University', area: 'Teaching number theory', kind: 'Counselor', stipend: '$5,750 + room and board', deadline: 'Mar 15 (rolling from Feb 1)', sort: '03-15', url: 'https://promys.org/' },
  { name: 'UConn REU', host: 'University of Connecticut', area: 'Analysis, fractals, probability', kind: 'REU', deadline: 'End of March', sort: '03-31', url: 'https://mathreu.uconn.edu/' },
  { name: 'Polymath Jr', host: 'Online', area: 'Group research', kind: 'Online', stipend: 'Unpaid', deadline: 'Apr 1', sort: '04-01', url: 'https://geometrynyc.wixsite.com/polymathreu', note: 'Proof experience and one letter; still produces a paper.' },
  { name: 'UCLA Geometry and Topology REU', host: 'UCLA', area: 'Geometry, topology (2026: toric geometry)', kind: 'REU', stipend: '$5,000 for 6 weeks', deadline: 'Apr 15', sort: '04-15', url: 'https://www.mathprograms.org/db/UCLA/GEOREU26', note: '2025 rules: U.S. citizens and permanent residents in the Los Angeles area.' },
  { name: 'UCLA Applied and Computational Math REU', host: 'UCLA', area: 'Computing, machine learning', kind: 'REU', deadline: 'See listing', sort: '99', url: 'https://www.mathprograms.org/db/UCLA/REUCAM26' },
  { name: 'Cal Poly Pomona CAMP REU', host: 'Cal Poly Pomona', area: 'Applied, graph theory', kind: 'REU', stipend: '$7,000', deadline: 'See listing', sort: '99', url: 'https://www.cpp.edu/camp-reu/' },
  { name: 'SURIEM', host: 'Michigan State', area: 'Discrete, applied', kind: 'REU', stipend: 'Stipend', deadline: 'See listing', sort: '99', url: 'https://lbc.msu.edu/research/suriem/' },
  { name: 'SUMRY', host: 'Yale', area: 'Pure', kind: 'REU', deadline: 'See listing', sort: '99', url: 'https://sumry.yale.edu/' },
];

// Programs people often ask about that don't take outside students, or weren't running.
export const closed: { name: string; why: string }[] = [
  { name: 'Berkeley RTG REU (Numbers, Symmetry, and Geometry)', why: 'Current Berkeley undergraduates only.' },
  { name: 'Columbia CMUSR / CSUREMM', why: 'Columbia and Barnard students only.' },
  { name: 'MIT SPUR / UROP', why: 'MIT students only.' },
  { name: 'UW WXML', why: 'Runs during the academic quarter and requires enrollment in a UW course.' },
  { name: 'Cornell SPUR', why: 'Outside students unfunded; the NSF REU track did not run in 2025.' },
  { name: 'UVA number theory REU, Oregon State REU', why: 'Not run recently (UVA last in 2023; Oregon State canceled 2025).' },
];
