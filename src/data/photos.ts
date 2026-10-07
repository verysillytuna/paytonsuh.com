// Photography page, in display order. `file` is the name in src/assets/photos/ (without .jpg).
// Theme: perspective (lines converging to a vanishing point) and repetition (rows of similar forms).
export type Photo = { file: string; caption: string };

export const photos: Photo[] = [
  { file: 'yonge-street', caption: 'Yonge Street, Toronto' },
  { file: 'adashino', caption: 'Adashino Nenbutsu-ji, Kyoto' },
  { file: 'platform', caption: 'Station platform, Japan' },
  { file: 'daruma', caption: 'Daruma at Katsuō-ji, Minoh' },
  { file: 'california-street', caption: 'California Street, San Francisco' },
  { file: 'torii', caption: 'Karakuni Shrine, Osaka' },
  { file: 'bonsai', caption: 'Bonsai' },
  { file: 'canal', caption: 'Canal, Japan' },
  { file: 'little-italy', caption: 'Little Italy, New York' },
  { file: 'painted-ladies', caption: 'The Painted Ladies, San Francisco' },
  { file: 'rice-field', caption: 'Rice field, Japan' },
  { file: 'shinsekai', caption: 'Shinsekai, Osaka' },
  { file: 'cathedral', caption: 'Cathedral' },
  { file: 'stream', caption: 'Mountain stream, Japan' },
  { file: 'cable-car', caption: 'Cable car, San Francisco' },
  { file: 'niagara', caption: 'Niagara Gorge' },
  { file: 'malibu', caption: 'Malibu' },
  { file: 'los-angeles', caption: 'Downtown Los Angeles at night' },
];
