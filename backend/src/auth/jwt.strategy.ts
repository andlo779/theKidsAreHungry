import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './auth.module';
import { AuthUser } from '../types';

export interface JwtPayload {
  sub: string;
  email: string;
  family_id: string | null;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      id: payload.sub,
      email: payload.email,
      family_id: payload.family_id,
      name: payload.name,
    };
  }
}
