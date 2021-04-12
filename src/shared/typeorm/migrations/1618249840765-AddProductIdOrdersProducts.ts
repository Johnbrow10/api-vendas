import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddProductIdOrdersProducts1618249840765
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona uma coluna na tabela orders_products com tipo uuid e com possibilidade de ser nulo
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'product_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // entao para criar a chave estrangeira na coluna de order_id com referencia na tabela de orders_product do campo id com acao de seta nullo quando o campo de id for apagado na tabela de orders_products e assim nao perdendo os Pedidos `de produtos`
    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'ordersProductsProduct',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'orders_products',
      'ordersProductsProduct',
    );
    await queryRunner.dropColumn('orders_products', 'product_id');
  }
}
