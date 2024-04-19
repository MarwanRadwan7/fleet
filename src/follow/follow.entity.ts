import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { User } from 'src/user/user.entity';

@Entity({
  name: 'followings',
})
@Unique('unique_following_id', ['userId', 'followingId'])
export class Following {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => User, user => user.followings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'following_id' })
  followingId: User;

  @Exclude({ toPlainOnly: true })
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

@Entity({
  name: 'followers',
})
@Unique('unique_follower_id', ['userId', 'followerId'])
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, user => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @ManyToOne(() => User, user => user.followers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  followerId: User;

  @Exclude({ toPlainOnly: true })
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
