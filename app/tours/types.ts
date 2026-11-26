export interface ItineraryDay {
  dayTitle: string;
  activities: string[];
}

export interface TourPlanVariant {
  id: string;
  planLabel: string;
  title: string;
  duration: string;
  price: string;
  overviewParagraphs: string[];
  extraOverviewBlocks?: {
    heading: string;
    items: string[];
  }[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  excludedNote?: string;
  importantNotes: string[];
  departure: string;
  bestFor: string;
  tourType: string;
}

export interface TourPackage {
  slug: string;
  frameStart: number;
  frameEnd: number;
  badge: string;
  cardTitle: string;
  subtitle?: string;
  location: string;
  durationLabel: string;
  startingPrice: string;
  highlights: string[];
  plans: TourPlanVariant[];
}