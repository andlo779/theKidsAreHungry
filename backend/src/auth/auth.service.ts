import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      family_id: user.family_id,
      name: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        family_id: user.family_id,
      },
    };
  }

  async register(data: any) {
    const { name, email, password, familyName } = data;

    // Hash password
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    // Find or create family
    let family = await this.prisma.family.findUnique({
      where: { name: familyName },
    });
    if (!family) {
      family = await this.prisma.family.create({ data: { name: familyName } });
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        family_id: family.id,
      },
    });

    return this.login(user);
  }
}
