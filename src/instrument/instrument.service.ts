import { Injectable } from '@nestjs/common';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Instrument } from './entities/instrument.entity';


@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
  ) { }

  async create(createInstrumentDto: CreateInstrumentDto, userId: number): Promise<Instrument> {
    const instrument = this.instrumentRepository.create({
      title: createInstrumentDto.title,
      user_id: userId
    });
    return this.instrumentRepository.save(instrument);
  }

  async findTitleByUserId(title: string, userId: number): Promise<Instrument | null> {
    return this.instrumentRepository.findOne({
      where: { title: title, user_id: userId }
    });
  }

  async findAllByUserId(userId: number): Promise<Instrument[]> {
    return this.instrumentRepository.find({
      where: { user_id: userId }
    })
  }

  async updateInstrumentById(userId: number, updateInstrumentDto: UpdateInstrumentDto): Promise<UpdateResult> {
    return this.instrumentRepository.update(
      { id: updateInstrumentDto.id, user_id: userId },
      { title: updateInstrumentDto.title }
    );
  }
}
