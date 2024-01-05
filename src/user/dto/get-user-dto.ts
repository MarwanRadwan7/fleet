import { User } from '../user.interface';

export type GetUserType = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'phone' | 'birthDate' | 'avatar' | 'bio'
>;
export type GetUserByUsernameType = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'password' | 'phone' | 'birthDate' | 'avatar' | 'bio'
>;
