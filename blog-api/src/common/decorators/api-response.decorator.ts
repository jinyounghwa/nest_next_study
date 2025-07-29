import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiSuccessResponse(description: string, type?: any) {
  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiResponse({
      status: 200,
      description: '성공',
      type,
    }),
    ApiResponse({
      status: 400,
      description: '잘못된 요청',
    }),
    ApiResponse({
      status: 401,
      description: '인증 실패',
    }),
    ApiResponse({
      status: 403,
      description: '권한 없음',
    }),
    ApiResponse({
      status: 500,
      description: '서버 오류',
    }),
  );
} 