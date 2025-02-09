import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '@/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  findAll() {
    return this.databaseService.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return {
      message: 'User updated successfully',
    };
  }

  async remove(id: number) {
    await this.databaseService.user.delete({
      where: {
        id,
      },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}
