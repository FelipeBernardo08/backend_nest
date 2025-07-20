import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const pass: string = await this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      email: createUserDto.email,
      password: pass,
      name: createUserDto.name,
      created_at: new Date(),
      updated_at: new Date()
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email }
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async update(userId: number, user: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(userId, {
      name: user.name
    });
  }

  async findUserWithInstrumentByUserId(userId: number): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.instruments', 'instrument')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'instrument.id',
        'instrument.title',
        'instrument.user_id'
      ])
      .where('user.id = :id', { id: userId })
      .getOne();
  }
}
