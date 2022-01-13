import * as jwt from 'jsonwebtoken';

export const decodeToken = (token: string) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};
