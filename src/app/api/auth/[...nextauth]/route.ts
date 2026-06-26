import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        // temporary demo auth
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        return {
          id: "1",
          name: "SkillSage User",
          email: credentials.email as string,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };