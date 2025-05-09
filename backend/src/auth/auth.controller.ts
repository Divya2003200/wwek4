import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('refresh-token')
async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
  return await this.authService.refreshToken(refreshToken);
}


@Post('verify-email')
async verifyEmail(@Body() { verificationToken }: { verificationToken: string }) {
  return await this.authService.verifyEmail(verificationToken);
}

@Post('forgot-password')
async forgotPassword(@Body() { email }: { email: string }) {
  return await this.authService.forgotPassword(email);
}

@Post('reset-password')
async resetPassword(@Body() { resetToken, newPassword }: { resetToken: string, newPassword: string }) {
  return await this.authService.resetPassword(resetToken, newPassword);
}

}
