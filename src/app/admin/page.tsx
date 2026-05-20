import { notFound } from 'next/navigation'
import AdminContent from './_components/AdminContent'
import { createServerSupabase } from '@/lib/supabase/server' 

export default async function page() {
  const supabase = createServerSupabase() 
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: dbUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (!dbUser || dbUser.role !== 'admin') {
    notFound()
  }

  return <AdminContent />
}