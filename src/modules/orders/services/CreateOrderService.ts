import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppErrors';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existsProducts = await productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    // Aquilo que nao tiverem nos produtos pesquisados no repositorio que seria na api vai cair nessa variavel de checkar
    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    // caso nao tiver esse produto inexistente na api ira cancelar o processo
    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );
    }

    // Do array que foi enviado vou percorrer cada produto e comprar se aquele produto tem no repositorio pelo id.
    const quantityAvailable = products.filter(
      // entao ele compara se a quantidade que tivermos e menor que o cliente estra pedindo
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );
    // e depois faz uma verificao na quantidade que tem no estoque, se nao tiver suficiente retornar uma mensagem de erro
    if (quantityAvailable.length) {
      throw new AppError(
        `A quantidade de ${quantityAvailable[0].quantity} nao e valida para ${quantityAvailable[0].id}`,
      );
    }
  }
}

export default CreateOrderService;
