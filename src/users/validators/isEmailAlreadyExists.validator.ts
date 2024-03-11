import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAllreadyExists implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: string, args: ValidationArguments) {
    return this.usersService.checkEmailExists(value);
  }
}
