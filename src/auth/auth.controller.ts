import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RequestWithSession } from './jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('validate-email-token/:token')
  validateEmailToken(@Param('token') token: string) {
    return this.authService.validateEmailToken(token);
  }

  @Get('verify-email/:token')
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  sessionInfo(@Request() req: RequestWithSession) {
    return {
      message: 'Session data',
      data: req.user.data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sign-out')
  signOut(@Request() req: RequestWithSession) {
    return this.authService.signOut(req.user.sessionId);
  }
}
