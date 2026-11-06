import { Type } from "@sinclair/typebox";

export const CitySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  slug: Type.String(),
  state: Type.String(),
  isActive: Type.Boolean(),
});

export const CityQuerySchema = Type.Object({
  state: Type.Optional(Type.String()),
  search: Type.Optional(Type.String()),
});
