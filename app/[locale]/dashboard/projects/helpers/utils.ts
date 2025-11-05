/**
 * Generate a URL-friendly slug from a text string
 * Handles Arabic characters by transliterating common ones and falling back to a default
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  let slug = text
    .toLowerCase()
    .trim()
    // Transliterate common Arabic characters
    .replace(/[ءآأإ]/g, 'a')
    .replace(/[ئؤ]/g, 'e')
    .replace(/[ى]/g, 'a')
    .replace(/[ة]/g, 'h')
    .replace(/[^\w\s-]/g, '') // Remove all non-word characters (including remaining Arabic)
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  // If slug is empty after processing (e.g., pure Arabic text), generate a fallback
  if (!slug) {
    // Use timestamp + random string as fallback
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    slug = `project-${timestamp}-${random}`;
  }
  
  return slug;
}

