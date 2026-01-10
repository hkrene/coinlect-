import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { UserRole } from '@prisma/client';

const ACCESS_TOKEN_TTL = 60 * 15; // 15 minutes
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

const JWT_SECRET = process.env.JWT_SECRET;

const secretKey = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : undefined;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export interface TokenPayload extends JWTPayload {
  sub: string; // user id
  role: UserRole;
}

export async function signAccessToken(payload: TokenPayload) {
  if (!secretKey) throw new Error('JWT_SECRET missing');
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${ACCESS_TOKEN_TTL}s`)
    .setIssuedAt()
    .setSubject(payload.sub)
    .sign(secretKey);
}

export async function signRefreshToken(payload: TokenPayload) {
  if (!secretKey) throw new Error('JWT_SECRET missing');
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${REFRESH_TOKEN_TTL}s`)
    .setIssuedAt()
    .setSubject(payload.sub)
    .sign(secretKey);
}

export async function verifyToken(token: string) {
  if (!secretKey) throw new Error('JWT_SECRET missing');
  const { payload } = await jwtVerify<TokenPayload>(token, secretKey);
  return payload;
}

export function requireRole(userRole: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(userRole)) {
    throw new Error('FORBIDDEN');
  }
}

