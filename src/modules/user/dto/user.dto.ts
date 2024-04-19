import { Exclude, Expose } from 'class-transformer';

import { UserRole } from '../user.entity';

@Exclude()
export class UserDto {
  @Expose()
  public id: string;

  @Expose()
  public username: string;

  @Expose()
  public email: string;

  @Exclude({ toPlainOnly: true })
  public password: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public bio: string | null;

  @Expose()
  public avatar: string | null;

  @Expose()
  public birthDate: Date;

  @Expose()
  public phone: string;

  public isActive: boolean;

  public role: UserRole;

  public createdAt: Date;

  public updatedAt: Date;
}
