import {UserService} from '@loopback/authentication';
import {injectable, BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from './hash.password.bcrypt';
import {User} from '../models';

@injectable({scope: BindingScope.TRANSIENT})
export class MyUserService implements UserService<User, {email: string; password: string}> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    public hasher: BcryptHasher,
  ) {}

  async verifyCredentials(credentials: {email: string; password: string}): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound(`User not found with email ${credentials.email}`);
    }
    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundUser.password,
    );
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid credentials.');
    }
    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id?.toString() ?? '',
      name: user.email,
      id: user.id,
    };
  }
}
