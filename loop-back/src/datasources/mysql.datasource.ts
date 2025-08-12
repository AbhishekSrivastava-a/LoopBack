import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './mysql.datasource.json';

export class MysqlDataSource extends juggler.DataSource {
  static dataSourceName = 'Mysql';

  constructor(
    @inject('datasources.config.Mysql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
