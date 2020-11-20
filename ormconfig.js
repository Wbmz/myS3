const DEFAULT_DB_URL = 'postgres://user:pwd@localhost:3000/db';
const founded = (process.env.DATABASE_URL || DEFAULT_DB_URL).match(
    /^(postgres):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/,
);

const [, , DB_USER, DB_USER_PWD, DB_HOST, DB_PORT, DB_NAME] = founded;
const SOURCE_DIR_BASE = process.env.NODE_ENV === 'production' ? '.dist' : 'src';
module.exports = {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_USER_PWD,
    database: DB_NAME,
    synchronize: false,
    logging: false,
    entities: [`${SOURCE_DIR_BASE}/entities/**/*`],
    migrations: [`${SOURCE_DIR_BASE}/migrations/**/*`],
    migrationsRun: true,
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
    },
};
