'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users, DollarSign, TrendingUp, Settings } from 'lucide-react'
import TripList from '@/components/trip-list'
import CreateTripDialog from '@/components/create-trip-dialog'
import ExpenseTracker from '@/components/expense-tracker'

interface Trip {
  id: string
  name: string
  description?: string
  currency: string
  centralMoneyKeeperId?: string
  centralMoneyKeeperName?: string
  members: Array<{
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
  }>
  totalExpenses: number
  yourBalance: number
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [showCreateTrip, setShowCreateTrip] = useState(false)

  useEffect(() => {
    const savedTrips = localStorage.getItem('trips')
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips))
    }
  }, [])

  const saveTrips = (newTrips: Trip[]) => {
    setTrips(newTrips)
    localStorage.setItem('trips', JSON.stringify(newTrips))
  }

  const createTrip = (tripData: { name: string; description?: string; currency: string; centralMoneyKeeperId?: string }) => {
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      ...tripData,
      centralMoneyKeeperName: tripData.centralMoneyKeeperId === user?.id ? user.name : undefined,
      members: [{
        id: user!.id,
        name: user!.name,
        email: user!.email,
        role: 'ADMIN' as const
      }],
      totalExpenses: 0,
      yourBalance: 0
    }

    const updatedTrips = [...trips, newTrip]
    saveTrips(updatedTrips)

    // Save to both localStorage and a more persistent cache
    localStorage.setItem('splitwise_user_trips', JSON.stringify(updatedTrips))
    localStorage.setItem('splitwise_app_data', JSON.stringify({
      user,
      trips: updatedTrips,
      lastUpdated: new Date().toISOString()
    }))

    setSelectedTrip(newTrip)
  }

  const updateTrip = (updatedTrip: Trip) => {
    const updatedTrips = trips.map(trip =>
      trip.id === updatedTrip.id ? updatedTrip : trip
    )
    saveTrips(updatedTrips)

    // Save to enhanced cache
    localStorage.setItem('splitwise_user_trips', JSON.stringify(updatedTrips))
    localStorage.setItem('splitwise_app_data', JSON.stringify({
      user,
      trips: updatedTrips,
      lastUpdated: new Date().toISOString()
    }))

    if (selectedTrip?.id === updatedTrip.id) {
      setSelectedTrip(updatedTrip)
    }
  }

  const totalBalance = trips.reduce((sum, trip) => sum + trip.yourBalance, 0)
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.totalExpenses, 0)

  if (selectedTrip) {
    return (
      <ExpenseTracker
        trip={selectedTrip}
        onBack={() => setSelectedTrip(null)}
        onUpdateTrip={updateTrip}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Splitwise</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalBalance).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalBalance >= 0 ? 'You are owed' : 'You owe'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Across all trips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trips.length}</div>
              <p className="text-xs text-muted-foreground">
                Trips you're part of
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Trips</h2>
          <Button onClick={() => setShowCreateTrip(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Trip
          </Button>
        </div>

        <TripList
          trips={trips}
          onSelectTrip={setSelectedTrip}
          onUpdateTrip={updateTrip}
        />

        <CreateTripDialog
          open={showCreateTrip}
          onOpenChange={setShowCreateTrip}
          onCreateTrip={createTrip}
        />
      </main>
    </div>
  )
}