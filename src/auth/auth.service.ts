import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async login(user: User): Promise<object> {
        const payload = { email: user.email, id: user.id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: '1h',
                secret: process.env.JWT_SECRET
            }),
        };
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
