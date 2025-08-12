import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {Course, CourseRelations, Student} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StudentRepository} from './student.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {
  public readonly students: HasManyRepositoryFactory<
    Student,
    typeof Course.prototype.id
  >;

  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
    @repository.getter('StudentRepository')
    protected studentRepositoryGetter: Getter<StudentRepository>,
  ) {
    super(Course, dataSource);
    this.students = this.createHasManyRepositoryFactoryFor(
      'students',
      studentRepositoryGetter,
    );
  }
}
