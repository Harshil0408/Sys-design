export interface Show {
  id: string;
  cinemaId: string;
  movieTitle: string;
  screenNumber: number;
  format: string;
  language: string;
  startTime: string;
  price: number;
  availableSeats: number;
}

export interface ShowListQuery {
  cinemaId?: string;
  movieTitle?: string;
  format?: string;
}
