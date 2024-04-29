export const extractToken = (authorization: string): string => {
  const parts = authorization.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Basic')
    throw new Error('Invalid token');

  return parts[1];
};
