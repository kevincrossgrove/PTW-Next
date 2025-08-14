import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 60 * 1000,
      },
    },
  });
}

function makeBrowserQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: 0, staleTime: 60 * 1000 } },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeBrowserQueryClient();
    return browserQueryClient;
  }
}