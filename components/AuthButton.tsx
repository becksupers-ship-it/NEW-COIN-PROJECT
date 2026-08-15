'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">{session.user?.name || session.user?.email}</div>
        <button onClick={() => signOut()} className="px-2 py-1 border rounded">Sign out</button>
      </div>
    )
  }

  return <button onClick={() => signIn()} className="px-2 py-1 border rounded">Sign in</button>
}
