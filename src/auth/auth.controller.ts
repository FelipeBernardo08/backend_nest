import { Controller, Post, Request, Body, UnauthorizedException, NotFoundException, BadGatewayException, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginInterface } from 'src/interfaces/auth/login.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) { }

    @Post('login')
    async login(@Body() body: LoginInterface): Promise<object> {
        const user = await this.userService.findByEmail(body.login);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado!');
        }
        const passVerify = await this.authService.comparePasswords(body.password, user.password);
        if (!passVerify) {
            throw new UnauthorizedException('Senha inválida!');
        }
        return await this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getAuthUser(@Request() req: any) {
        return req.user;
    }
}
