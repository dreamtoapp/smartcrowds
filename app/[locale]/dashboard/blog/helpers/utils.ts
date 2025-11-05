/**
 * Generate a URL-friendly slug from a title string
 * Handles Arabic characters by transliterating common ones
 */
export function generateSlug(title: string): string {
  if (!title) return '';
  // Remove Arabic characters and transliterate common ones
  return title
    .toLowerCase()
    .trim()
    .replace(/[ءآأإ]/g, 'a')
    .replace(/[ئؤ]/g, 'e')
    .replace(/[ى]/g, 'a')
    .replace(/[ة]/g, 'h')
    .replace(/[^\w\s-]/g, '') // Remove all non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

