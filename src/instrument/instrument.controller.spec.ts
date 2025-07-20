import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentController } from './instrument.controller';
import { InstrumentService } from './instrument.service';

describe('InstrumentController', () => {
  let controller: InstrumentController;
  let instrumentService: {}

  beforeEach(async () => {
    instrumentService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstrumentController],
      providers: [{ provide: InstrumentService, useValue: instrumentService }],
    }).compile();

    controller = module.get<InstrumentController>(InstrumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
