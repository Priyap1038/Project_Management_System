import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://127.0.0.1:8000/graphql/",
    headers: { "X-ORG-SLUG": "acme" },
  }),
  cache: new InMemoryCache(),
});

export default client;
