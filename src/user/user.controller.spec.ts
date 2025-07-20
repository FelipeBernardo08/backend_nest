import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: { findByEmail: jest.Mock, create: jest.Mock, update: jest.Mock };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService }
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return UnauthorizedException when create user.email exists', async () => {
    userService.findByEmail.mockResolvedValue({ id: 1, email: 'teste@gmail.com' });
    const dto = { name: 'teste', email: 'teste@gmail.com', password: '123' };
    await expect(controller.createUser(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('should return BadRequestException if incomplete payload', async () => {
    const dto = { email: '' };
    await expect(controller.createUser(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('should create user', async () => {
    const dto = { email: 'teste@email.com', name: 'teste', password: '123' };
    const mockUser = { id: 1, email: dto.email };
    userService.findByEmail.mockResolvedValue(null);
    userService.create.mockResolvedValue(mockUser);
    const result = await controller.createUser(dto);
    expect(result).toEqual(mockUser);
    expect(userService.create).toHaveBeenCalledTimes(1);
    expect(userService.findByEmail).toHaveBeenCalledTimes(1);
    expect(userService.create).toHaveBeenCalledWith(dto);
  });

  it('should return BadRequestException when service return null on update', async () => {
    userService.update.mockResolvedValue({ affected: 0 });
    const updateDto = { name: 'nome' };
    const req = { user: { id: 123 } };
    await expect(controller.updateUser(updateDto as any, req as any)).rejects.toThrow(BadRequestException);
  });

  it('should update user and return ok message', async () => {
    userService.update.mockResolvedValue({ affected: 1 });
    const updateDto = { name: 'novo nome' };
    const req = { user: { id: 123 } };
    const result = await controller.updateUser(updateDto, req);
    expect(userService.update).toHaveBeenCalledWith(123, updateDto);
    expect(result).toEqual({
      success: true,
      message: 'Registro atualizado com sucesso!',
    });
  });
});
