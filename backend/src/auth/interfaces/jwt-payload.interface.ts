export interface JwtPayload {
  sub: string;
  provider: 'guest' | 'google';
}
