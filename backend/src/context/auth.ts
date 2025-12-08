import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { getUserFromToken } from '../utils/auth';
import { Context } from '../types';
import { createEmployeeLoader } from '../utils/dataloader';

export const createContext = async ({ req }: ExpressContext): Promise<Context> => {
  // Get token from header
  const token = req.headers.authorization?.replace('Bearer ', '') || null;

  // Get user from token
  const user = await getUserFromToken(token);

  // Create DataLoaders for this request (prevents N+1 query problems)
  const loaders = {
    employee: createEmployeeLoader(),
  };

  return { user, token, loaders };
};
