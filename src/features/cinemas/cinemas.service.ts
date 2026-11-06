import type { Cinema, CinemaListQuery } from "./cinemas.types.js";
import cinemasSeed from "../../database/seeds/cinemas.seed.json" with { type: "json" };

export class CinemasService {
  private cinemas: Cinema[] = cinemasSeed as Cinema[];

  async getCinemas(query?: CinemaListQuery): Promise<Cinema[]> {
    let results = this.cinemas;

    if (query?.cityId) {
      results = results.filter((c) => c.cityId === query.cityId);
    }

    if (query?.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.location.toLowerCase().includes(term),
      );
    }

    return results;
  }

  async getCinemaById(id: string): Promise<Cinema | null> {
    return this.cinemas.find((c) => c.id === id) || null;
  }
}

export const cinemasService = new CinemasService();
