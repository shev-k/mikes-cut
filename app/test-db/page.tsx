import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Test connection and fetch todos
  const { data: todos, error: todosError } = await supabase.from('todos').select('*')
  
  // Also try to fetch barbers to see if the main schema is set up
  const { data: barbers, error: barbersError } = await supabase.from('barbers').select('*')

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

      {/* Todos Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Todos Table</span>
            {todosError ? (
              <Badge variant="destructive">Error</Badge>
            ) : (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">Connected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todosError ? (
            <Alert variant="destructive">
              <AlertTitle>Error fetching todos</AlertTitle>
              <AlertDescription>
                Code: {todosError.code} <br/>
                Message: {todosError.message} <br/>
                Details: {todosError.details}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {todos?.length === 0 ? "No records found in 'todos' table." : `Found ${todos?.length} records.`}
              </p>
              {todos && todos.length > 0 && (
                <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[300px]">
                  <pre className="text-xs">{JSON.stringify(todos, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Barbers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Barbers Table</span>
            {barbersError ? (
              <Badge variant="destructive">Error</Badge>
            ) : (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">Connected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barbersError ? (
            <Alert variant="destructive">
              <AlertTitle>Error fetching barbers</AlertTitle>
              <AlertDescription>
                Code: {barbersError.code} <br/>
                Message: {barbersError.message} <br/>
                Details: {barbersError.details}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {barbers?.length === 0 ? "No records found in 'barbers' table." : `Found ${barbers?.length} records.`}
              </p>
              {barbers && barbers.length > 0 && (
                <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[300px]">
                  <pre className="text-xs">{JSON.stringify(barbers, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
