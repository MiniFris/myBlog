import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const table = 'users';

export class CreateUserTable1708398644897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: table,
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'firstName', type: 'varchar(50)' },
                { name: 'email', type: 'varchar(50)', isUnique: true },
                { name: 'password', type: 'text' },
                { name: 'refreshToken', type: 'text', isNullable: true },
                { name: 'createdAt', type: 'timestamp', default: 'now()' },
                { name: 'updatedAt', type: 'timestamp', default: 'now()', onUpdate: 'now()' },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(table, true);
    }

}
