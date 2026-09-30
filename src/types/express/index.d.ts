import { UserRole } from '../../modules/auth/entities/User.entity';

declare global {
  namespace Express {
    export interface Request {
      // Attach the decoded JWT payload to the Request object
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}
