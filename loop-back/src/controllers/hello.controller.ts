import {get} from '@loopback/rest';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class HelloController {
  @get('/hello')
  hello(): string {
    return 'Hello from Loopback 4';
  }
}
