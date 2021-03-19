import AppError from '@shared/errors/AppErrors';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface UserRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}
class CreateSessionsService {
  public async execute({ email, password }: UserRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incoreect email/password combination.', 401);
    }

    const passwordConfirm = await compare(password, user.password);

    if (!passwordConfirm) {
      throw new AppError('Incoreect email/password combination.', 401);
    }

    const token = sign({}, 'f3773c3c37eed0cab778f5d6f71b6001', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionsService;
