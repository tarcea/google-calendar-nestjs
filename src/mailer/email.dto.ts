import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: `the query should be like: '/mailer?email=a_valid@email.com'`,
    },
  )
  email: string;
}
