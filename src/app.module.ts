import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { InstrumentModule } from './instrument/instrument.module';
import { Instrument } from './instrument/entities/instrument.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "3306"),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Instrument
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Instrument
    ]),
    AuthModule,
    UserModule,
    InstrumentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
