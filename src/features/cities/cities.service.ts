import type { City, CityListQuery } from "./cities.types.js";
import citiesSeed from "../../database/seeds/cities.seed.json" with { type: "json" };
import { cacheService } from "../../shared/infra/redis/cache.service.js";

const CACHE_KEY_CITIES = "bms:cities:all";

export class CitiesService {
  private cities: City[] = citiesSeed as City[];

  async getAllCities(query?: CityListQuery): Promise<City[]> {
    // 1. Check cache if no filter
    if (!query?.state && !query?.search) {
      const cached = await cacheService.get<City[]>(CACHE_KEY_CITIES);
      if (cached) return cached;
    }

    let results = this.cities;

    if (query?.state) {
      results = results.filter((c) => c.state.toLowerCase() === query.state?.toLowerCase());
    }

    if (query?.search) {
      const term = query.search.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(term) || c.slug.includes(term));
    }

    // Save to cache for 10 minutes
    if (!query?.state && !query?.search) {
      await cacheService.set(CACHE_KEY_CITIES, results, 600);
    }

    return results;
  }

  async getCityById(id: string): Promise<City | null> {
    return this.cities.find((c) => c.id === id) || null;
  }
}

export const citiesService = new CitiesService();
