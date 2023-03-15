import jwtstrategy from "passport-jwt";
import extractjwt from "passport-jwt";
import prisma from "../lib/prisma.js";

const JwtStrategy = jwtstrategy.Strategy;
const ExtractJwt = extractjwt.ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "my-secret";
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

export const candidateStrategy = new JwtStrategy(opts, function (jwt_payload, done) {
  const candidate = prisma.candidate.findUnique({
    where: {
      id: Number(jwt_payload.data.id),
    },
  });
  if (candidate) {
    return done(null, candidate);
  } else {
    return done(null, false);
  }
});
