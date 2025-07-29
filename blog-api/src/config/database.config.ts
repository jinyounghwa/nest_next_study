import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  const dbType = configService.get('DB_TYPE') || 'sqlite';
  
  const baseConfig = {
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: !isProduction, // 프로덕션에서는 false
    logging: configService.get<boolean>('DB_LOGGING') || false,
    retryAttempts: 3,
    retryDelay: 3000,
  };

  if (dbType === 'sqlite') {
    return {
      type: 'sqlite',
      database: configService.get('DB_DATABASE') || './database.sqlite',
      ...baseConfig,
    };
  }

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: parseInt(configService.get('DB_PORT') || '5432'),
      username: configService.get<string>('DB_USERNAME') || 'postgres',
      password: configService.get<string>('DB_PASSWORD') || 'password',
      database: configService.get<string>('DB_NAME') || 'blog_db',
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      ...baseConfig,
    };
  }

  if (dbType === 'mysql') {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST') || 'localhost',
      port: parseInt(configService.get('DB_PORT') || '3306'),
      username: configService.get<string>('DB_USERNAME') || 'root',
      password: configService.get<string>('DB_PASSWORD') || '',
      database: configService.get<string>('DB_NAME') || 'blog_db',
      ...baseConfig,
    };
  }

  // 기본값: SQLite
  return {
    type: 'sqlite',
    database: './database.sqlite',
    ...baseConfig,
  };
}; 