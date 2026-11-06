import { Type } from "@sinclair/typebox";

export const CinemaSchema = Type.Object({
  id: Type.String(),
  cityId: Type.String(),
  name: Type.String(),
  location: Type.String(),
  totalScreens: Type.Number()
});

export const CinemaQuerySchema = Type.Object({
  cityId: Type.Optional(Type.String()),
  search: Type.Optional(Type.String())
});
