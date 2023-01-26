import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from '../components/Account'

export default function Profile() {
  const session = useSession()
  const supabase = useSupabaseClient()
  console.log('session', session)

  return (
    <div className="container">
      <h1>Profile</h1>
      <Account session={session} />
    </div>
  )
}