export interface PuzzleSpec {
  source_language: string;
  target_language: string;
  word: string;
  character_grid: string[][];
  word_locations: { [locations: string]: string };
}
