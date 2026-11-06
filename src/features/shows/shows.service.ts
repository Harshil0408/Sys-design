import type { Show, ShowListQuery } from "./shows.types.js";
import showsSeed from "../../database/seeds/shows.seed.json" with { type: "json" };
import { cacheService } from "../../shared/infra/redis/cache.service.js";

export class ShowsService {
  private shows: Show[] = showsSeed as Show[];

  async getShows(query?: ShowListQuery): Promise<Show[]> {
    let results = this.shows;

    if (query?.cinemaId) {
      const cacheKey = `bms:shows:cinema:${query.cinemaId}`;
      const cached = await cacheService.get<Show[]>(cacheKey);
      if (cached) return cached;

      results = results.filter((s) => s.cinemaId === query.cinemaId);
      await cacheService.set(cacheKey, results, 180);
      return results;
    }

    if (query?.movieTitle) {
      const title = query.movieTitle.toLowerCase();
      results = results.filter((s) => s.movieTitle.toLowerCase().includes(title));
    }

    if (query?.format) {
      results = results.filter((s) => s.format.toLowerCase() === query.format?.toLowerCase());
    }

    return results;
  }

  async getShowById(id: string): Promise<Show | null> {
    return this.shows.find((s) => s.id === id) || null;
  }
}

export const showsService = new ShowsService();
