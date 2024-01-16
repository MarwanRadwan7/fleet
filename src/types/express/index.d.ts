declare namespace Express {
  interface Request {
    pagination?: { page: number; limit: number };
  }
}
