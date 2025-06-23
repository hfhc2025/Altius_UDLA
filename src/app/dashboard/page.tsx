import { cookies } from 'next/headers'
import DashboardLandingCards from '@/components/DashboardLandingCards'

export default function DashboardPage() {
  const userName = cookies().get('user_name')?.value ?? 'David'

  return <DashboardLandingCards userName={userName} />
}