import { randomBytes } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export const WRONG_LOGIN_OR_PASSWORD = () => 'wrong login or password';

// Используется только для тестового проекта. Для быстрой развёртки
export const getJWTSecret = (type: 'access' | 'refresh') => {
    const filename = `jwt-${type}.secret`;
    if(existsSync(filename)) return readFileSync(filename).toString();

    const secret = randomBytes(256).toString('base64');
    writeFileSync(filename, secret);
    return secret;
};