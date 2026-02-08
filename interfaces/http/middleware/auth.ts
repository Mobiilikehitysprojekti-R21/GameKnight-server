import { expressjwt, GetVerificationKey } from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";

const authConfig = {
  issuerBaseURL: "https://gameknight.eu.auth0.com",
  audience: "api.gameknight.app", // You'll need to set this in Auth0
};

// Middleware to validate JWT tokens from client
export const requireAuth = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${authConfig.issuerBaseURL}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: authConfig.audience,
  issuer: `${authConfig.issuerBaseURL}/`,
  algorithms: ["RS256"],
});

// Optional middleware for routes that can work with or without auth
export const optionalAuth = expressjwt({
  secret: expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${authConfig.issuerBaseURL}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: authConfig.audience,
  issuer: `${authConfig.issuerBaseURL}/`,
  algorithms: ["RS256"],
  credentialsRequired: false,
});
