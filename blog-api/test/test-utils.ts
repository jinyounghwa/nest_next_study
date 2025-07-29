import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTestDatabaseConfig } from '../src/config/test-database.config';

export async function createTestingModule(imports: any[] = []): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: getTestDatabaseConfig,
        inject: [ConfigService],
      }),
      ...imports,
    ],
  }).compile();
} 