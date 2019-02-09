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
