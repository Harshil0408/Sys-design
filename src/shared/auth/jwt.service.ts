import type { FastifyInstance } from "fastify";

export interface UserPayload {
  userId: string;
  email: string;
  role: "customer" | "admin" | "cinema_owner";
}

export class JwtService {
  constructor(private fastify: FastifyInstance) {}

  sign(payload: UserPayload): string {
    return this.fastify.jwt.sign(payload);
  }

  verify(token: string): UserPayload {
    return this.fastify.jwt.verify<UserPayload>(token);
  }
}
