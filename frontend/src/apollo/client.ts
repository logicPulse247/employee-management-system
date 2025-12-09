import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { env } from '../config';
import { logger } from '../utils/logger';
import { getValidToken, clearAuthData, redirectToLogin } from '../utils/auth';

const httpLink = createHttpLink({
  uri: env.VITE_GRAPHQL_URL,
});

let navigateFunction: ((path: string) => void) | null = null;

export const setNavigateFunction = (navigate: (path: string) => void) => {
  navigateFunction = navigate;
};

const authLink = setContext((_, { headers }) => {
  const token = getValidToken();

  if (!token && navigateFunction) {
    redirectToLogin(navigateFunction);
  } else if (!token) {
    redirectToLogin();
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError((error: any) => {
  const { graphQLErrors, networkError } = error;

  if (graphQLErrors && graphQLErrors.length > 0) {
    graphQLErrors.forEach((err: any) => {
      const { message, locations, path, extensions } = err;
      const errorCode = extensions?.code as string;
      const statusCode = extensions?.statusCode as number;

      logger.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

      if (errorCode === 'AUTHENTICATION_ERROR' || statusCode === 401) {
        clearAuthData();
        redirectToLogin(navigateFunction || undefined);
        return;
      }

      if (errorCode === 'AUTHORIZATION_ERROR' || statusCode === 403) {
        return;
      }

      if (errorCode === 'VALIDATION_ERROR' || statusCode === 400) {
        return;
      }

      if (errorCode === 'NOT_FOUND' || statusCode === 404) {
        return;
      }

      if (errorCode === 'CONFLICT' || statusCode === 409) {
        return;
      }
    });
  }

  if (networkError) {
    logger.error(`[Network error]: ${networkError}`);

    if ('statusCode' in networkError && networkError.statusCode === 401) {
      clearAuthData();
      redirectToLogin(navigateFunction || undefined);
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          employees: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
