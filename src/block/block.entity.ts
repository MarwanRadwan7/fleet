import { Column, Entity, Unique, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/user.entity';

@Entity({ name: 'blocks' })
@Unique('unique_block', ['userId', 'friendId'])
export class Block {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => User, user => user.blocks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'friend_id' })
  friendId: User;

  @Column({
    select: false,
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
