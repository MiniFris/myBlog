import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const table = 'users';

export class CreateUserTable1708398644897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: table,
            columns: [
                { name: 'id', type: 'INT', isPrimary: true, generationStrategy: 'increment' },
                { name: 'firstName', type: 'VARCHAR(50)' },
                { name: 'email', type: 'VARCHAR(50)', isUnique: true },
                { name: 'password', type: 'TEXT' },
                { name: 'createdAt', type: 'TIMESTAMP', default: 'NOW()' },
                { name: 'updatedAt', type: 'TIMESTAMP', default: 'NOW()', onUpdate: 'NOW()' },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(table, true);
    }

}
