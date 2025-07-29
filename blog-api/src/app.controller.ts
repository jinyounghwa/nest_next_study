import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '기본 헬스 체크' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/db')
  @Public()
  @ApiOperation({ summary: '데이터베이스 연결 상태 확인' })
  async checkDatabase() {
    return this.appService.checkDatabaseConnection();
  }
}
