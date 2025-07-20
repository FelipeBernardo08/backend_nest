import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { InstrumentService } from './instrument.service';
import { Instrument } from './entities/instrument.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('InstrumentService', () => {
  let service: InstrumentService;
  let repo: jest.Mocked<Partial<Repository<Instrument>>>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<Partial<Repository<Instrument>>> = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentService,
        {
          provide: getRepositoryToken(Instrument),
          useValue: repoMock
        }
      ],
    }).compile();

    service = module.get<InstrumentService>(InstrumentService);
    repo = module.get(getRepositoryToken(Instrument));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
