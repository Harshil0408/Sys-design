export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  isActive: boolean;
}

export interface CityListQuery {
  state?: string;
  search?: string;
}
