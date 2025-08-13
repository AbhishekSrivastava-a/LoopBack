import {post, requestBody, response} from '@loopback/rest';
import {User} from '../models';
import {validateCredentials} from '../services/validator';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/core';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {PermissionKeys} from '../authorization/permission-keys';

export class AdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  @post('/admin')
  @response(200, {
    description: 'Admin created',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: {type: 'number'},
            email: {type: 'string'},
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            permissions: {type: 'array', items: {type: 'string'}},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      description: 'Create Admin',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'firstName', 'lastName', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              password: {type: 'string', minLength: 8},
            },
          },
        },
      },
    })
    admin: User,
  ): Promise<Partial<User>> {
    // email and password validity
    validateCredentials({
      email: admin.email,
      password: admin.password,
    });

    // admin permissions
    admin.permissions = [
      PermissionKeys.CreateJob,
      PermissionKeys.UpdateJob,
      PermissionKeys.DeleteJob,
    ];

    // Hash password before saving
    admin.password = await this.hasher.hashPassword(admin.password);

    // Save the admin
    const savedAdmin = await this.userRepository.create(admin);

    
    const adminObj = savedAdmin.toJSON() as Partial<User>;
    delete adminObj.password;

    // Return admin without password
    return adminObj;
  }
}
