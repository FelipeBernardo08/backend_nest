import { Instrument } from 'src/instrument/entities/instrument.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @OneToMany(() => Instrument, intrument => intrument.user)
    instruments: Instrument[];
}
