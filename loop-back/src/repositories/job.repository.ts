import {DefaultCrudRepository} from '@loopback/repository';
import {Job, JobRelations} from '../models/job.model';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class JobRepository extends DefaultCrudRepository<
  Job,
  typeof Job.prototype.id,
  JobRelations
> {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(Job, dataSource);
  }
}
