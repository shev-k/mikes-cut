import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboard } from './components/admin-dashboard'
import { BarberDashboard } from './components/barber-dashboard'
import { Button } from "@/components/ui/button"
import { logout } from '@/app/login/actions'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch user profile to get role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role || 'customer'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wider">
            MIKE'S CUT <span className="text-primary text-sm font-normal ml-2">DASHBOARD</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground capitalize">
              {user.email} ({role})
            </span>
            <form action={logout}>
              <Button variant="outline" size="sm">Sign Out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {role === 'admin' && <AdminDashboard />}
        {role === 'employee' && <BarberDashboard userId={user.id} />}
        {role === 'customer' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Customer Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! You can view your bookings here soon.</p>
          </div>
        )}
      </main>
    </div>
  )
}
