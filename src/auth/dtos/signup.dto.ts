import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsString({ message: 'First name should be a string.' })
  @IsNotEmpty({ message: 'First name cannot be empty.' })
  firstName: string;

  @IsString({ message: 'Last name should be a string.' })
  @IsNotEmpty({ message: 'Last name cannot be empty.' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password should be at least 6 characters long.' })
  password: string;
}
