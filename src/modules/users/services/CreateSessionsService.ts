import AppError from '@shared/errors/AppErrors';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

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

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expireIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionsService;
