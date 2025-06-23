import { cookies } from 'next/headers'
import DashboardLandingCards from '@/components/DashboardLandingCards'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const userName = cookieStore.get('user_name')?.value ?? 'David'

  return <DashboardLandingCards userName={userName} />
}