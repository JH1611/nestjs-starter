import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface RequestWithSession extends Request {
  user: {
    sessionId: string;
    data: {
      email: string;
      firstName: string;
      lastName: string;
      role: {
        name: string;
        key: string;
        permissions: string[];
      };
    };
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { sessionId: string }) {
    const session = await this.databaseService.session.findUnique({
      where: {
        id: payload.sessionId,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const user = await this.databaseService.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: {
          select: {
            name: true,
            key: true,
            rolePermission: {
              select: {
                permission: {
                  select: {
                    key: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid session');
    }

    return {
      sessionId: session.id,
      data: {
        ...user,
        role: {
          name: user.role.name,
          key: user.role.key,
          permissions: user.role.rolePermission.map(
            (permission) => permission.permission.key,
          ),
        },
      },
    };
  }
}
