import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMessage1640153190449 implements MigrationInterface {
  name = 'CreateMessage1640153190449'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`room\` (\`id\` varchar(36) NOT NULL, \`usersId\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e7f4a7ee79c02f200ec4c225a9\` (\`usersId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`room_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`roomId\` varchar(255) NOT NULL, \`readAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_27dad61266db057665ee1b13d3\` (\`userId\`), INDEX \`IDX_507b03999779b22e06538595de\` (\`roomId\`), UNIQUE INDEX \`unique-user-room\` (\`userId\`, \`roomId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(2000) NOT NULL, \`userId\` int NULL, \`roomId\` varchar(255) NOT NULL, \`postId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_446251f8ceb2132af01b68eb59\` (\`userId\`), INDEX \`IDX_fdfe54a21d1542c564384b74d5\` (\`roomId\`), INDEX \`IDX_04a090968149bb6f728a253d68\` (\`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` ADD CONSTRAINT \`FK_27dad61266db057665ee1b13d3d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` ADD CONSTRAINT \`FK_507b03999779b22e06538595dec\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_446251f8ceb2132af01b68eb593\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_fdfe54a21d1542c564384b74d5c\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` ADD CONSTRAINT \`FK_04a090968149bb6f728a253d683\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_04a090968149bb6f728a253d683\``
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_fdfe54a21d1542c564384b74d5c\``
    )
    await queryRunner.query(
      `ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_446251f8ceb2132af01b68eb593\``
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` DROP FOREIGN KEY \`FK_507b03999779b22e06538595dec\``
    )
    await queryRunner.query(
      `ALTER TABLE \`room_user\` DROP FOREIGN KEY \`FK_27dad61266db057665ee1b13d3d\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_04a090968149bb6f728a253d68\` ON \`message\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_fdfe54a21d1542c564384b74d5\` ON \`message\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_446251f8ceb2132af01b68eb59\` ON \`message\``
    )
    await queryRunner.query(`DROP TABLE \`message\``)
    await queryRunner.query(`DROP INDEX \`unique-user-room\` ON \`room_user\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_507b03999779b22e06538595de\` ON \`room_user\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_27dad61266db057665ee1b13d3\` ON \`room_user\``
    )
    await queryRunner.query(`DROP TABLE \`room_user\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_e7f4a7ee79c02f200ec4c225a9\` ON \`room\``
    )
    await queryRunner.query(`DROP TABLE \`room\``)
  }
}
