import { User } from 'src/user/user.interface';

export interface LoginDto extends User {}
export type LoginResponseDto = { access_token: string; refresh_token: string };
