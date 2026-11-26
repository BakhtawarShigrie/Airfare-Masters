import { TourPackage } from "../types";
import { TOURS_SET_ONE } from "./toursSetOne";
import { TOURS_SET_TWO } from "./toursSetTwo";

export const ALL_TOURS: TourPackage[] = [
  ...TOURS_SET_ONE,
  ...TOURS_SET_TWO,
];

export function getTourBySlug(slug: string): TourPackage | undefined {
  return ALL_TOURS.find((tour) => tour.slug === slug);
}