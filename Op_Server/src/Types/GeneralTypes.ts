export type DecodedToken = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: UserRole;
  iat: number;
};

export type DecodedVerificationToken = {
  id: string;
  iat: number;
  verificationCode: string;
};

export enum UserRole {
  Root = 'root',
  Sudo = 'sudo',
  Admin = 'admin',
  Manager = 'manager',
  Employee = 'employee',
}
