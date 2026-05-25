import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev_jwt_secret_change_in_production'
);

const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret);
  const sub = payload.sub;
  if (!sub || typeof sub !== 'string') {
    throw new Error('Token tidak valid');
  }
  return {
    sub,
    email: String(payload.email ?? ''),
    role: String(payload.role ?? 'user'),
  };
}
