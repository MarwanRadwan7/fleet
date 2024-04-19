import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Room } from './room.entity';
import { User } from 'src//modules/user/user.entity';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    select: true,
    nullable: false,
  })
  message: string;

  @ManyToOne(() => User, user => user.id, {
    cascade: true,
  })
  @JoinColumn({ name: 'sender' })
  sender: User;

  @ManyToOne(() => Room, room => room.messages, {
    cascade: true,
  })
  room: Room;

  @Column({
    select: true,
    name: 'is_edited',
    default: false,
  })
  public isEdited: boolean;

  @Column({
    select: true,
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    select: true,
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
