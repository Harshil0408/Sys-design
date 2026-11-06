// MongoDB initialization script
db = db.getSiblingDB("bookmyshow");
db.createCollection("cities");
db.createCollection("cinemas");
db.createCollection("shows");

db.cities.createIndex({ slug: 1 }, { unique: true });
db.cinemas.createIndex({ cityId: 1 });
db.shows.createIndex({ cinemaId: 1, startTime: 1 });

print("BookMyShow MongoDB initialization complete.");
