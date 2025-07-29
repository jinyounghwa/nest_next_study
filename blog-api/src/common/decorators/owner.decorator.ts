import { SetMetadata } from '@nestjs/common';

export const OWNER_KEY = 'owner';
export const Owner = (field: string) => SetMetadata(OWNER_KEY, field); 