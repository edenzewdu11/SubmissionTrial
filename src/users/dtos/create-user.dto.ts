import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: ' name should be a string ' })
  @IsNotEmpty({ message: 'name cannot be an empty' })
  firstName: string;

  @IsString({ message: ' name should be a string' })
  @IsNotEmpty({ message: 'name cannot be an empty' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email cannot be an empty' })
  email: string;

  @IsString()
  @MinLength(6) // You can adjust the minimum length based on your requirements
  password: string;

  @IsEnum(['user', 'admin'])
  @IsNotEmpty({ message: 'specify your role please' })
  role: string;
}
