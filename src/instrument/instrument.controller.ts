import { Controller, Post, Body, BadRequestException, Request, Patch, UseGuards } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { Instrument } from './entities/instrument.entity';

@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createInstrument(@Body() createInstrumentDto: CreateInstrumentDto, @Request() req: any): Promise<Instrument> {
    let userId: number = req.user.id;
    let titleExists = await this.instrumentService.findTitleByUserId(createInstrumentDto.title, userId);
    if (titleExists) {
      throw new BadRequestException('Instrumento já existe!');
    }
    return this.instrumentService.create(createInstrumentDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateInstrument(@Body() updateInstrumentDto: UpdateInstrumentDto, @Request() req: any): Promise<object> {
    let userId: number = req.user.id;
    let resp = await this.instrumentService.updateInstrumentById(userId, updateInstrumentDto);
    if (!resp.affected) {
      throw new BadRequestException('Erro ao atualizar intrumento, tente novamente mais tarde!');
    }
    return { success: true, message: 'Registro atualizado com sucesso!' };
  }

}
