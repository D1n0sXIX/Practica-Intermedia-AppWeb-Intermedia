if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Faltan variables de entorno críticas: ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET')
}
export const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/myapp',
    port: process.env.SERVER_PORT || 3000,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '3d',
    rateLimitMax: process.env.RATE_LIMIT_MAX || 100,
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000
};