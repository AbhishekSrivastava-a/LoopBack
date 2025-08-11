import {get} from '@loopback/rest';

export class HelloController {
  // constructor() {}
  @get('/hello')
  hello(): string {
    return 'Hello from loopback 4';
  }
}