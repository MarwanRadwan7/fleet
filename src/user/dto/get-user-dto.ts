import { User } from '../user.interface';

export type GetUserType = Pick<
  User,
  'id' | 'username' | 'name' | 'email' | 'phone' | 'birthDate' | 'avatar' | 'bio'
>;
