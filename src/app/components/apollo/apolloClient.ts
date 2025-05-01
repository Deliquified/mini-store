import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const universalGraphLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_UNIVERSAL_GRAPH_URL,
});

export const client = new ApolloClient({
  link: universalGraphLink,
  cache: new InMemoryCache(),
});