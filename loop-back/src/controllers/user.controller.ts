import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  get,
  post,
  requestBody,
  response,
  RequestBodyObject, // ✅ Import RequestBodyObject
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories/user.repository';
import {User} from '../models';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import {validateCredentials} from '../services/validator';
import _ from 'lodash';

// ✅ FIX: Define the constant with the explicit RequestBodyObject type.
const CredentialsRequestBody: RequestBodyObject = {
  description: 'Login credentials',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {type: 'string', format: 'email'},
          password: {type: 'string', minLength: 8},
        },
      },
    },
  },
};

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('services.hasher')
    public hasher: BcryptHasher,
    @inject('services.jwt.service')
    public jwtService: JWTService,
    @inject('services.user.service')
    public userService: MyUserService,
  ) {}

  @post('/users/signup')
  @response(200, {
    description: 'User created',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            email: {type: 'string'},
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      description: 'Sign up with email and password',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 8},
            },
          },
        },
      },
    })
    newUser: Omit<User, 'id'>,
  ): Promise<Partial<User>> {
    validateCredentials(_.pick(newUser, ['email', 'password']));
    newUser.password = await this.hasher.hashPassword(newUser.password);
    const savedUser = await this.userRepository.create(newUser);
    return _.omit(savedUser, ['password']);
  }

  @post('/users/login')
  async login(
    @requestBody(CredentialsRequestBody)
    credentials: {email: string; password: string},
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/users/me')
  async me(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }
}
