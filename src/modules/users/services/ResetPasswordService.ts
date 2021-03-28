import AppError from '@shared/errors/AppErrors';
import { hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import { isAfter, addHours } from 'date-fns';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists!!');
    }

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User Token does not exists!!');
    }

    const tokenCreatedAdt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAdt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token Expired');
    }

    user.password = await hash(password, 8);
    // esqueci de colocar o save para uma nova senha
    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
