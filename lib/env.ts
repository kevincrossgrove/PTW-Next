import { z } from "zod/v4";

const envVariables = z.object({
  BETTER_AUTH_SECRET: z.string(), // Any string - used by better-auth library
  BETTER_AUTH_URL: z.string(), // Frontend Application URL - used by better-auth library
  GOOGLE_CLIENT_ID: z.string(), // Google OAuth Client ID - required for Google Social Login to work
  GOOGLE_CLIENT_SECRET: z.string(), // Google OAuth Client Secret - required for Google Social Login to work

  MONGODB_CONNECTION_STRING: z.string(), // MongoDB Connection String
  MONGODB_DATABASE_NAME: z.string(), // MongoDB Database Name
});

envVariables.parse(process.env);

declare global {
  // eslint-disable-next-line
  namespace NodeJS {
    // eslint-disable-next-line
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
