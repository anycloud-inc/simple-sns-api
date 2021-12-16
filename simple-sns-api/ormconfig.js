module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'mysql',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'simple_sns',
  synchronize: false,
  legacySpatialSupport: false,
  migrationsRun: process.env.DB_MIGRATIONS_RUN === '1',
  logging:
    process.env.DB_LOGGING != null
      ? process.env.DB_LOGGING.split(',')
      : ['query', 'error', 'log'],
  entities: [process.env.DB_TYPEORM_ENTITIES || 'src/**/*.entity.ts'],
  migrations: [process.env.DB_TYPEORM_MIGRATIONS || 'src/migration/**/*.ts'],
  subscribers: [process.env.DB_TYPEORM_SUBSCRIBERS || 'src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
  extra: {
    charset: 'utf8mb4',
    socketPath: process.env.DB_SOCKET_PATH,
  },
}
