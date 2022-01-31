import {MigrationInterface, QueryRunner} from "typeorm";

export class ModifyRoomuser1643613304395 implements MigrationInterface {
    name = 'ModifyRoomuser1643613304395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room_user\` DROP COLUMN \`readAt\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room_user\` ADD \`readAt\` timestamp NULL`);
    }

}
