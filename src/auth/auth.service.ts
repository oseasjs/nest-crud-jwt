import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {
        
    }

    async signUp(authCredencialsDto: AuthCredentialsDto) : Promise<void> {
        return this.userRepository.signUp(authCredencialsDto);
    }

    async singIn(authCredentialsDto: AuthCredentialsDto) : Promise<{accessToken: string}> {
        const username = await this.userRepository.validateUerPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        this.logger.debug(`Generated JWT Token with payload '${JSON.stringify(payload)}'`);

        return { accessToken };

    }

}
