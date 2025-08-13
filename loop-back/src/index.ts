import {StarterApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
export * from './application';
export {StarterApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new StarterApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? 'localhost',
      openApiSpec: {setServersFromRequest: true},
    },
  };

  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
