export interface DigestSubItem {
    label: string;
    tag: string;
    schemaOrgTag: string | null;
    total: number;
    hasRDI: boolean;
    daily: number;
    unit: string;
  }
  
  export interface DigestItem {
    label: string;
    tag: string;
    schemaOrgTag: string | null;
    total: number;
    hasRDI: boolean;
    daily: number;
    unit: string;
    sub?: DigestSubItem[];
  }
  
  export interface TotalNutrientItem {
    label: string;
    quantity: number;
    unit: string;
  }
  








export interface ImageSize {
    height: number;
    width: number;
    url: string;
  }
  
  export interface EdamamItem {
    label: string;
    image: string;
    images: {
      THUMBNAIL: ImageSize;
      SMALL: ImageSize;
      REGULAR: ImageSize;
      LARGE: ImageSize;
    };
    source: string;
    url: string;
    shareAs: string;
    yield: number;
    calories: number;
    totalWeight: number;
    dietLabels: string[];
    healthLabels: string[];
    cautions: string[];
    cuisineType: string[];
    mealType: string[];
    dishType: string[];
    digest: DigestItem[];
    totalNutrients: {
      [key: string]: TotalNutrientItem;
    };
    totalDaily: {
      [key: string]: TotalNutrientItem;
    };
    glycemicIndex?: number;
    co2EmissionsClass?: string;
    totalCO2Emissions?: number;
  }
  
  export interface EdamamApiResponse {
    hits: {
      recipe: EdamamItem;
    }[];
  }
  

  export interface SearchResult {
    type: "recipe" | "food";
    label: string;
    image?: string;
    url?: string; // Only for recipes
    nutrients?: { [key: string]: TotalNutrientItem }; // Only for foods
  }



  /// FOOOD PORTION
  // Define the nutrient structure
interface Nutrients {
    [key: string]: number; // Example: { "ENERC_KCAL": 100, "FAT": 5 }
  }
  
  // Define serving sizes
  interface ServingSize {
    uri: string;
    label: string;
    quantity: number;
  }
  
  // Define food structure
  interface Food {
    foodId: string;
    uri: string;
    label: string;
    knownAs: string;
    nutrients: Nutrients;
    brand?: string;
    category: string;
    categoryLabel: string;
    foodContentsLabel?: string;
    image?: string;
    servingSizes?: ServingSize[];
    servingsPerContainer?: number;
  }
  
  // Define measure structure
  interface Measure {
    uri: string;
    label: string;
    weight: number;
    qualified?: {
      qualifiers: {
        uri: string;
        label: string;
      }[];
      weight: number;
    }[];
  }
  
  // Define parsed food structure
  interface ParsedFood {
    food: Food;
    quantity: number;
    measure: Measure;
  }
  
  // Define hint structure
  interface Hint {
    pluCode?: {
      code: string;
      category: string;
      commodity: string;
      variety: string;
      isRetailerAssigned: boolean;
    };
    food: Food;
    measures: Measure[];
  }
  
  // Define API response structure
 export interface EdamamFoodResponse {
    text: string;
    count: number;
    parsed: ParsedFood[];
    hints: Hint[];
    _links?: {
      next?: {
        href: string;
        title: string;
      };
    };
  }