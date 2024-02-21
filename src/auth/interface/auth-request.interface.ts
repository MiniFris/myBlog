import { Request } from 'express';

import { AuthUserPayload } from '../payload/auth-user.payload';

export interface AuthRequest extends Request {
    user: AuthUserPayload;
}