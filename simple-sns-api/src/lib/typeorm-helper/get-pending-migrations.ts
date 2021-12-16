// https://github.com/typeorm/typeorm/issues/5425
import { MigrationExecutor, Connection } from 'typeorm'

export async function getPendingMigrations(connection: Connection) {
  const migrationExecuter = new MigrationExecutor(
    connection,
    connection.createQueryRunner('master')
  )
  const allMigrations = await migrationExecuter.getAllMigrations()
  const executedMigrations = await migrationExecuter.getExecutedMigrations()
  return allMigrations.filter(
    migration =>
      !executedMigrations.find(
        executedMigration => executedMigration.name === migration.name
      )
  )
}
