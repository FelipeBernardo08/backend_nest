import { Controller, Post, UseGuards, Body, Request, Patch, UnauthorizedException, BadRequestException, Get, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Criar um usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso.',
    schema: {
      example: {
        email: "user@email.com",
        id: 1,
        name: "user"
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Payload incorreto.' })
  @ApiResponse({ status: 401, description: 'Usuário já cadastrado!' })
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Payload incorreto!');
    }
    let emailExists: any = await this.userService.findByEmail(createUserDto.email);
    if (emailExists) {
      throw new UnauthorizedException('Usuário já cadastrado!');
    }
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar o registro do usuário autenticado' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    schema: {
      example: {
        success: true,
        message: 'Registro atualizado com sucesso!'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar registro, tente novamente mais tarde!' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req: any): Promise<object> {
    let userId: number = req.user.id;
    let respUpdate = await this.userService.update(userId, updateUserDto);
    if (!respUpdate.affected) {
      throw new BadRequestException('Erro ao atualizar registro, tente novamente mais tarde!');
    }
    return { success: true, message: 'Registro atualizado com sucesso!' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista usuário autenticado com vinculos de instrumentos' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado.',
    schema: {
      example: {
        id: 1,
        name: 'user',
        email: 'user@email.com',
        instruments: [
          {
            id: 10,
            title: 'Guitarra'
          }
        ]
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @Get('my-instruments')
  async getUserComplete(@Request() req: any): Promise<User | null> {
    let userId: number = req.user.id;
    let response = await this.userService.findUserWithInstrumentByUserId(userId);
    return response;
  }

}
