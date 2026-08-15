import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    // To enable GitHub auth, set GITHUB_ID and GITHUB_SECRET in env
    GithubProvider({ clientId: process.env.GITHUB_ID || '', clientSecret: process.env.GITHUB_SECRET || '' }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
