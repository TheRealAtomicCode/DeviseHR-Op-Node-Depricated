export type DecodedToken = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  iat: number;
};

export type DecodedVerificationToken = {
  id: string;
  iat: number;
  verificationCode: string;
};
