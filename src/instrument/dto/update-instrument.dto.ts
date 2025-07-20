import { PartialType } from '@nestjs/mapped-types';
import { CreateInstrumentDto } from './create-instrument.dto';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateInstrumentDto extends PartialType(CreateInstrumentDto) {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string | undefined;

    @ApiProperty()
    user_id: number;
}
