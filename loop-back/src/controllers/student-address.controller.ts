import {repository} from '@loopback/repository';
import {StudentRepository} from '../repositories';
import {post, param, requestBody} from '@loopback/rest';
import {Address, Student} from '../models';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class StudentAddressController {
  constructor(
    @repository(StudentRepository)
    protected studentRepository: StudentRepository,
  ) {}

  @post('/students/{id}/address')
  async createAddress(
    @param.path.number('id')
    studentId: typeof Student.prototype.id,
    @requestBody()
    addressData: Address,
  ): Promise<Address> {
    return await this.studentRepository.address(studentId).create(addressData);
  }
}
