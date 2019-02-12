import { Point } from 'paper';

export function randomElement<T = any>(array: T[]): T | undefined {
  if (array.length === 0) {
    return;
  }
  return array[Math.floor(Math.random() * array.length)];
}

const languageMappings: { [lang: string]: string } = {
  'es': 'Spanish',
  'en': 'English',
};
export function unabbreviateLanguage(lang: string): string | undefined {
  return languageMappings[lang];
}

export const midpoint = (a: Point, b: Point): Point =>
  new Point((a.x + b.x) / 2, (a.y + b.y) / 2);

export const angleBetween = (a: Point, b: Point): number =>
  (Math.atan2(b.y - a.y, b.x - a.x)) * 180 / Math.PI;
