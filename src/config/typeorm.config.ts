import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  url: process.env.DB_URL || dbConfig.url,
  //   host: process.env.DB_HOSTNAME || dbConfig.host,
  //   port: process.env.DB_PORT || dbConfig.port,
  //   username: process.env.DB_USERNAME || dbConfig.username,
  //   password: process.env.DB_PASSWORD || dbConfig.password,
  //   database: process.env.DB_NAME || dbConfig.database,
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  useUnifiedTopology: true, //mongodb specific - purpose not clear, perhaps to be used to handle some depreciation in future
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  cache: {
    duration: 10000,
  },
};
