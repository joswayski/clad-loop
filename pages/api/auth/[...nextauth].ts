import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";

export const authOptions = {
  debug: true,

  session: {
    strategy: "database",
    jwt: false,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  //   session: {
  //     strategy: "database",
  //     // maxAge: 30 * 24 * 60 * 60, // 30 days
  //     // updateAge: 24 * 60 * 60, // 24 hours
  //     // generateSessionToken: () => {
  //     //   return Math.random().toString();
  //     // },
  //   },
  //   jwt: {
  //     // The maximum age of the NextAuth.js issued JWT in seconds.
  //     // Defaults to `session.maxAge`.
  //     maxAge: 60 * 60 * 24 * 30,
  //     // You can define your own encode/decode functions for signing and encryption
  //     // async encode() {},
  //     // async decode() {},
  //   },

  //   jwt: {
  //     // The maximum age of the NextAuth.js issued JWT in seconds.
  //     // Defaults to `session.maxAge`.
  //     maxAge: 60 * 60 * 24 * 30,
  //     // You can define your own encode/decode functions for signing and encryption
  //     async encode() {},
  //     async decode() {},
  //   },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],

  adapter: SupabaseAdapter({
    url: "https://kxsmkqqydhyzuqlqxcit.supabase.co",
    secret:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4c21rcXF5ZGh5enVxbHF4Y2l0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDg2NTMxMywiZXhwIjoyMDAwNDQxMzEzfQ.hrCGcFK_NrS6hRlPPaeX1L9_oBT5c9PxddJH8_lhcW4",
  }),
  secret: "test",
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return "/dashboard";
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
