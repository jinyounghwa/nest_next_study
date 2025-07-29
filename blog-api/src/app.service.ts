import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkDatabaseConnection(): Promise<{
    connected: boolean;
    database: string;
    entities: number;
  }> {
    try {
      const isConnected = this.dataSource.isInitialized;
      const database = this.dataSource.options.database as string;
      const entities = this.dataSource.entityMetadatas.length;

      return {
        connected: isConnected,
        database,
        entities,
      };
    } catch (error) {
      return {
        connected: false,
        database: 'unknown',
        entities: 0,
      };
    }
  }
}
