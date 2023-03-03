import { IsEmail } from 'class-validator';

export class AccountDto {
  @IsEmail()
  destination: string;
}
