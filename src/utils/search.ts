import { App } from "@/data/appCatalog";

// Search function for apps
export function searchApps(apps: App[], searchTerm: string): App[] {
  if (!searchTerm.trim()) {
    return Object.values(apps);
  }

  const searchTerms = searchTerm.toLowerCase().split(' ');
  
  return Object.values(apps).filter(app => {
    return searchTerms.every(term => {
      // Check if any field contains the search term
      const containsTerm = (text: string, searchTerm: string): boolean => {
        return text.toLowerCase().includes(searchTerm.toLowerCase());
      };

      // Search in app name, developer, categories, and tags
      if (containsTerm(app.app.name, term)) {
        return true;
      }
      
      if (app.developer && containsTerm(app.developer, term)) {
        return true;
      }
      
      if (app.categories.some(category => containsTerm(category, term))) {
        return true;
      }
      
      if (app.tags && app.tags.some(tag => containsTerm(tag, term))) {
        return true;
      }
      
      return false;
    });
  });
} 