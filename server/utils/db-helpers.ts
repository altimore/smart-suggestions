// Helper functions to handle SQLite JSON arrays
// In SQLite, arrays are stored as JSON strings

export function parseArrayField(value: string | string[]): string[] {
  if (Array.isArray(value)) return value
  if (!value || value === '[]') return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

export function stringifyArrayField(value: string[] | undefined): string {
  if (!value || value.length === 0) return '[]'
  return JSON.stringify(value)
}

export function transformSuggestion(suggestion: any) {
  return {
    ...suggestion,
    images: parseArrayField(suggestion.images),
    videos: parseArrayField(suggestion.videos),
    links: parseArrayField(suggestion.links),
  }
}
