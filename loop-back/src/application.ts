import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {MyUserService} from './services/user-service';
import {JWTService} from './services/jwt-service';
import {
  TokenServiceConstants,
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from './keys';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';

export class StarterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Bindings
    this.setupBinding();

    // Authentication
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Sequence
    this.sequence(MySequence);

    // Home page
    this.static('/', path.join(__dirname, '../public'));

    // API Explorer
    this.bind(RestExplorerBindings.CONFIG).to({path: '/explorer'});
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBinding(): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
  }
}
