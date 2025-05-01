
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/common/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService, 
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>, 
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((r) => r.name),
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken ,user};
  }


//   async login(loginDto: LoginDto) {
//     const { email, password } = loginDto;
//     const user = await this.usersService.findByEmail(email);

//     if (!user) {
//       throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
//     }

//     const payload: JwtPayload = {
//       email: user.email,
//       sub: user.id,
//       roles: user.roles.map((r) => r.name),
//     };
//     const accessToken = this.jwtService.sign(payload);

//     // Return both accessToken and user data
//     return { accessToken, user };
// }


  // async register(registerDto: RegisterDto) {
  //   const { email, password, role } = registerDto;
  //   const existingUser = await this.usersService.findByEmail(email);

  //   if (existingUser) {
  //     throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = await this.usersService.create({
  //     email,
  //     password: hashedPassword,
  //     role,
     
  //     name: registerDto.name,
  //   });
  //   return user;
  // }

async register(registerDto: RegisterDto) {
  const { name, email, password, role } = registerDto;

  // 1a) check for existing user...
  const existing = await this.usersService.findByEmail(email);
  if (existing) throw new HttpException('Email in use', HttpStatus.BAD_REQUEST);

  // 1b) lookup the Role entity
  const roleEntity = await this.roleRepo.findOne({ where: { name: role } });
  if (!roleEntity) throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);

  // 1c) hash password
  const hashed = await bcrypt.hash(password, 10);

  // 1d) call UsersService.create *only* with CreateUserDto shape
  const user = await this.usersService.create({
    name,
    email,
    password: hashed,
    role      // <-- matches CreateUserDto exactly
  });

  // 1e) now attach the real Role entity and save
  user.roles = [roleEntity];
  await this.usersService.save(user);

  return user;
}


  async refreshToken(refreshToken: string) {
    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }
      const newAccessToken = this.jwtService.sign({
        email: user.email,
        sub: user.id,
        roles: user.roles.map((r) => r.name),
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = this.jwtService.sign({ email }, { expiresIn: '1h' });

    // Send the password reset email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './reset-password', // Make sure you have this template set up
      context: { resetToken },
    });

    return { message: 'Password reset email sent.' };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const payload = this.jwtService.verify(resetToken);
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.usersService.update(user.id, { password: hashedPassword });

    return { message: 'Password has been reset successfully.' };
  }

  async verifyEmail(verificationToken: string) {
    try {
      const payload = this.jwtService.verify(verificationToken);
      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.isEmailVerified = true;
      await this.usersService.update(user.id, user);

      return { message: 'Email successfully verified.' };
    } catch (error) {
      throw new HttpException('Invalid verification token', HttpStatus.BAD_REQUEST);
    }
  }
}
