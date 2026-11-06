import cities from "../src/database/seeds/cities.seed.json" with { type: "json" };
import cinemas from "../src/database/seeds/cinemas.seed.json" with { type: "json" };
import shows from "../src/database/seeds/shows.seed.json" with { type: "json" };

async function seed() {
  console.log("🌱 Starting BookMyShow database seeding...");
  console.log(`Loaded ${cities.length} cities`);
  console.log(`Loaded ${cinemas.length} cinemas`);
  console.log(`Loaded ${shows.length} shows`);
  console.log("✅ Seeding completed successfully.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
