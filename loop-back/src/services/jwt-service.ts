import {injectable, BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {TokenService} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';
import jwt from 'jsonwebtoken';

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService implements TokenService {
  private jwtSecret: string = process.env.JWT_SECRET ?? 'supersecretkey';
  private jwtExpiresIn: string = process.env.JWT_EXPIRES_IN ?? '7h';

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }

    return jwt.sign(userProfile as jwt.JwtPayload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn as any,
    });
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: 'token' is null`,
      );
    }
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded as UserProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${(error as Error).message}`,
      );
    }
  }
}
