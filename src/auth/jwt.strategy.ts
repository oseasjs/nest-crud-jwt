import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './dto/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret91'
    })
  }

  async validate(payload: JwtPayload) : Promise<User> {
    const {username} = payload;
    const user = await this.userRepository.findUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

}