export interface Cinema {
  id: string;
  cityId: string;
  name: string;
  location: string;
  totalScreens: number;
}

export interface CinemaListQuery {
  cityId?: string;
  search?: string;
}
