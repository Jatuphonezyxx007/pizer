import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// นี่คือ Decorator ที่เราจะใช้: @Roles('admin', 'user')
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
