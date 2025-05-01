import { App } from "@/data/appCatalog";

// Helper function to normalize text for search
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

// Helper function to check if a string contains a search term
function containsTerm(text: string | undefined, term: string): boolean {
  if (!text) return false;
  return normalizeText(text).includes(normalizeText(term));
}

// Helper function to check if any tag matches the search term
function hasMatchingTag(tags: string[] | undefined, term: string): boolean {
  if (!tags || tags.length === 0) return false;
  return tags.some(tag => containsTerm(tag, term));
}

export function searchApps(apps: App[], searchTerm: string): App[] {
  if (!searchTerm.trim()) return apps;

  const terms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);

  return apps.filter(app => {
    // Calculate a relevance score for each app
    const matchScore = terms.reduce((score, term) => {
      let termScore = 0;

      // Name match (highest priority)
      if (containsTerm(app.name, term) || containsTerm(app.appName, term)) {
        termScore += 4;
      }

      // Category match (high priority)
      if (app.categories.some(category => containsTerm(category, term))) {
        termScore += 3;
      }

      // Tags match (high priority)
      if (hasMatchingTag(app.tags, term)) {
        termScore += 3;
      }

      // Developer match (medium priority)
      if (containsTerm(app.developer, term)) {
        termScore += 2;
      }

      return score + termScore;
    }, 0);

    // Return true if the app matches any term
    return matchScore > 0;
  }).sort((a, b) => {
    // Sort by how well they match the search terms
    const scoreA = terms.reduce((score, term) => {
      let termScore = 0;
      if (containsTerm(a.name, term) || containsTerm(a.appName, term)) termScore += 4;
      if (a.categories.some(category => containsTerm(category, term))) termScore += 3;
      if (hasMatchingTag(a.tags, term)) termScore += 3;
      if (containsTerm(a.developer, term)) termScore += 2;
      return score + termScore;
    }, 0);

    const scoreB = terms.reduce((score, term) => {
      let termScore = 0;
      if (containsTerm(b.name, term) || containsTerm(b.appName, term)) termScore += 4;
      if (b.categories.some(category => containsTerm(category, term))) termScore += 3;
      if (hasMatchingTag(b.tags, term)) termScore += 3;
      if (containsTerm(b.developer, term)) termScore += 2;
      return score + termScore;
    }, 0);

    return scoreB - scoreA;
  });
} 