const verifyAccess = (
  is_verified: boolean,
  is_terminated: boolean
) => {
  if (is_terminated)
    throw new Error('Your Permissions have been Revoked.');
  if (!is_verified)
    throw new Error(
      'Please sign into your account with the registration email that was sent to you, please make sure to ckeck the junk and spam folders, if you did not receive it please contact your manager.'
    );
};

export default verifyAccess;
