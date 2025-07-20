import { Controller, Post, Request, Body, UnauthorizedException, NotFoundException, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginInterface } from 'src/interfaces/auth/login.interface';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) { }

    @ApiOperation({ summary: 'Autentica um usuário via login' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                login: { type: 'string', example: 'Felipe' },
                password: { type: 'string', example: '123456' },
            },
            required: ['login', 'password']
        }
    })
    @ApiResponse({ status: 404, description: 'Usuário não encontrado!' })
    @ApiResponse({ status: 401, description: 'Senha inválida!' })
    @ApiResponse({
        status: 200,
        description: 'Sucesso!',
        schema: {
            example: {
                access_token: "asdgeui12kejn213189uhkjb"
            }
        }
    })
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retorna o usuário autenticado' })
    @ApiResponse({
        status: 200,
        description: 'Sucesso!',
        schema: {
            example: {
                id: 1,
                name: "usuario",
                email: "usuario@email.com"
            }
        }
    })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getAuthUser(@Request() req: any) {
        return req.user;
    }
}
