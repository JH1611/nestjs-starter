import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { randomString } from '@/utils/random-string';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.databaseService.user.findUnique({
      where: {
        email: signUpDto.email,
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const verifyEmailToken = randomString(15);
    const password = await hash(signUpDto.password, 10);
    const defaultRole = await this.databaseService.role.findFirst({
      where: {
        key: this.configService.get('DEFAULT_ROLE_KEY'),
      },
      select: {
        id: true,
      },
    });

    if (!defaultRole) {
      throw new InternalServerErrorException('Default role does not exist');
    }

    await this.databaseService.user.create({
      data: {
        email: signUpDto.email,
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        password,
        verifyEmailToken,
        roleId: defaultRole.id,
      },
    });

    return {
      message:
        'Your account has been created successfully, please verify your email',
    };
  }

  async validateEmailToken(token: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        verifyEmailToken: token,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      message: 'Valid token email',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.databaseService.user.findFirst({
      where: {
        verifyEmailToken: token,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.databaseService.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        verifyEmailToken: null,
      },
    });

    return {
      message: 'Email verified successfully',
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatch = await compare(signInDto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const session = await this.databaseService.session.create({
      data: {
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const payload = {
      sessionId: session.id,
    };

    return {
      message: 'Successfully signed in',
      token: this.jwtService.sign(payload),
    };
  }

  async signOut(sessionId: string) {
    await this.databaseService.session.delete({
      where: {
        id: sessionId,
      },
    });

    return {
      message: 'Successfully signed out',
    };
  }
}
