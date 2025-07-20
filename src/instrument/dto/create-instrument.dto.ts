import { ApiProperty } from '@nestjs/swagger';

export class CreateInstrumentDto {
    @ApiProperty()
    title: string;
}
