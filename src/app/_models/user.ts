export class User {
    id?: string;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    email?: string;
    birthdate?: string;
    city?: string;
    photourl?: File | null;
    emailVerified?: boolean;
    userVerified?: boolean;
    description?: string;
}