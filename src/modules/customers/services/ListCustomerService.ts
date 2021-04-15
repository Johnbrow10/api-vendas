import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: Customer[];
}

class ListCustomerService {
  public async execute(): Promise<IPaginateCustomer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    //  Criando uma lista com pagination com o midleware de typeorm a funcao paginate
    const customers = await customersRepository.createQueryBuilder().paginate();

    // E para o retorno funcionar, tem que criar uma interface com os campos padrões da documentação de IPaginateCustomer com a data como array dos dadso da entidade de customer
    return customers as IPaginateCustomer;
  }
}

export default ListCustomerService;
