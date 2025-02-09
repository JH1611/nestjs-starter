import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @MaxLength(50)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @MaxLength(50)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @MaxLength(50)
  @MinLength(3)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @IsNotEmpty()
  password: string;
}
