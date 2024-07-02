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

export const hybridStrategy = new JwtStrategy(opts, function (
  jwt_payload,
  done
) {
  if (jwt_payload.data.accountType === "candidate") {
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
  } else {
    const recruiter = prisma.recruiter.findUnique({
      where: {
        id: Number(jwt_payload.data.id),
      },
    });
    if (recruiter) {
      return done(null, recruiter);
    } else {
      return done(null, false);
    }
  }
});
