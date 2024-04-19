import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, Column } from 'typeorm';

import { Message } from './message.entity';
import { User } from 'src/user/user.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'rooms',
})
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true, // Room name is unique --> Could change this in future
  })
  name: string;

  @Column({
    name: 'is_private',
    default: true,
  })
  isPrivate: boolean;

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

  // Relations
  @ManyToMany(() => User, user => user.rooms, {
    eager: true,
  })
  @JoinTable()
  members: User[];

  @OneToMany(() => Message, message => message.room)
  messages: Message[];
}
