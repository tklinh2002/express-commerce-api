import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../config/data-source';
import { User } from './entities/User.entity';
import { RegisterDto } from './dtos/register.dto';
import { AppError } from '../../core/exceptions/AppError';
import jwt from 'jsonwebtoken';
import { LoginDto } from './dtos/login.dto';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    // Get the repository instance from TypeORM
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Handle user registration
  async register(registerDto: RegisterDto): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const { email, password } = registerDto;

    // 1. Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      // Throw our custom AppError which will be caught by the global errorHandler
      throw new AppError('User with this email already exists', 400);
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Create a new user instance
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    // 4. Save to database
    await this.userRepository.save(newUser);

    // 5. Omit sensitive data before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...userWithoutPassword } = newUser;

    return userWithoutPassword as Omit<User, 'password' | 'refreshToken'>;
  }

  // Handle user login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Find user by email
    // IMPORTANT: We MUST explicitly select 'password' because we set `select: false` in User Entity
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate tokens
    const tokens = this.generateTokens(user);

    // 4. Save refresh token to database
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);

    // 5. Omit password and return
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  // Helper: Generate Access and Refresh Tokens
  private generateTokens(user: User) {
    const payload = { id: user.id, role: user.role };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: '15m', // Access Token live 15 minutes
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d', // Refresh Token live 7 days
    });

    return { accessToken, refreshToken };
  }
}
