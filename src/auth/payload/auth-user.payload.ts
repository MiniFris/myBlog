
export interface AuthUserPayload {
    id: number;
    firstName: string;
    email: string;
    exp: number,
    iat: number,
    refreshToken?: string;
    accessToken?: string;
}