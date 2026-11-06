import { Type } from "@sinclair/typebox";

export const ShowSchema = Type.Object({
  id: Type.String(),
  cinemaId: Type.String(),
  movieTitle: Type.String(),
  screenNumber: Type.Number(),
  format: Type.String(),
  language: Type.String(),
  startTime: Type.String(),
  price: Type.Number(),
  availableSeats: Type.Number()
});

export const ShowQuerySchema = Type.Object({
  cinemaId: Type.Optional(Type.String()),
  movieTitle: Type.Optional(Type.String()),
  format: Type.Optional(Type.String())
});
