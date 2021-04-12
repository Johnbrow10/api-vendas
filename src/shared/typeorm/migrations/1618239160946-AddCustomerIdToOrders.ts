import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCustomerIdToOrders1618239160946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criação da coluna de id na tabela orders com metodo AddColumn
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // entao para criar a chave estrangeira na coluna de curtomer_id com referencia na tabela de customers do campo id com acao de seta nullo quando o campo de customers for apagado na tabela de customers e assim nao perdendo os Pedidos `de produtos`
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'ordersCustomer',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders', 'OrdersCustomer');
    await queryRunner.dropColumn('orders', 'customer_id');
  }
}
