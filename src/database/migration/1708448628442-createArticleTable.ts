import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const table = 'articles';

export class CreateArticleTable1708448628442 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: table,
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'name', type: 'varchar(255)' },
                { name: 'description', type: 'text' },
                { name: 'authorId', type: 'int' },
                { name: 'createdAt', type: 'timestamp', default: 'now()' },
                { name: 'updatedAt', type: 'timestamp', default: 'now()', onUpdate: 'now()' },
            ]
        }));

        await queryRunner.createForeignKey(table, new TableForeignKey({
            columnNames: ['authorId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(table, true);
    }
}