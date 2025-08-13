import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Job} from '../models/job.model'; // Make sure you have this file and export Job!
import {JobRepository} from '../repositories/job.repository'; // Make sure you have this file and export JobRepository!
import {authenticate} from '@loopback/authentication';
// import {PermissionKeys} from '../authorization/permission-keys'; // don't use in authenticate()

export class JobController {
  constructor(
    @repository(JobRepository)
    public jobRepository: JobRepository,
  ) {}

  // Example: Only authentication, not permission
  @post('/jobs')
  @authenticate('jwt')
  @response(200, {
    description: 'Job model instance',
    content: {'application/json': {schema: getModelSchemaRef(Job)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {exclude: ['id']}),
        },
      },
    })
    job: Omit<Job, 'id'>,
  ): Promise<Job> {
    return this.jobRepository.create(job);
  }

  @get('/jobs/count')
  @response(200, {
    description: 'Job model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Job)) where?: Where<Job>,
  ): Promise<Count> {
    return this.jobRepository.count(where);
  }

  @get('/jobs')
  @response(200, {
    description: 'Array of Job model instances',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Job)},
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Job)) filter?: Filter<Job>,
  ): Promise<Job[]> {
    return this.jobRepository.find(filter);
  }

  @patch('/jobs')
  @authenticate('jwt')
  @response(200, {
    description: 'Job PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {partial: true}),
        },
      },
    })
    job: Job,
    @param.query.object('where', getWhereSchemaFor(Job)) where?: Where<Job>,
  ): Promise<Count> {
    return this.jobRepository.updateAll(job, where);
  }

  @get('/jobs/{id}')
  @response(200, {
    description: 'Job model instance',
    content: {'application/json': {schema: getModelSchemaRef(Job)}},
  })
  async findById(@param.path.number('id') id: number): Promise<Job> {
    return this.jobRepository.findById(id);
  }

  @patch('/jobs/{id}')
  @authenticate('jwt')
  @response(204, {description: 'Job PATCH success'})
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Job, {partial: true}),
        },
      },
    })
    job: Job,
  ): Promise<void> {
    await this.jobRepository.updateById(id, job);
  }

  @put('/jobs/{id}')
  @authenticate('jwt')
  @response(204, {description: 'Job PUT success'})
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() job: Job,
  ): Promise<void> {
    await this.jobRepository.replaceById(id, job);
  }

  @del('/jobs/{id}')
  @authenticate('jwt')
  @response(204, {description: 'Job DELETE success'})
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.jobRepository.deleteById(id);
  }
}
