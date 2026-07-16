export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  RESIDENT = 'RESIDENT',
}

export interface LoginResult {
  accessToken: string;
  user: {
    id: number;
    name: string;
    code: string;
    email: string;
    roles: UserRole[];
  };
}
