'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Crown, DollarSign } from 'lucide-react'

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

interface TripListProps {
  trips: Trip[]
  onSelectTrip: (trip: Trip) => void
  onUpdateTrip: (trip: Trip) => void
}

export default function TripList({ trips, onSelectTrip }: TripListProps) {
  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 text-center max-w-sm">
            Create your first trip to start sharing expenses with friends and family.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <Card key={trip.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{trip.name}</CardTitle>
                {trip.description && (
                  <CardDescription className="mt-1">
                    {trip.description}
                  </CardDescription>
                )}
              </div>
              {trip.centralMoneyKeeperId && (
                <div title="Has Central Money Keeper">
                  <Crown className="h-4 w-4 text-yellow-500" />
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {trip.members.length} member{trip.members.length !== 1 ? 's' : ''}
              </div>
              <div className="text-gray-600">{trip.currency}</div>
            </div>

            {trip.centralMoneyKeeperId && (
              <div className="text-xs bg-yellow-50 text-yellow-700 p-2 rounded">
                Central Money Keeper: {trip.centralMoneyKeeperName}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Total Expenses</div>
                <div className="font-semibold">{trip.currency} {trip.totalExpenses.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600">Your Balance</div>
                <div className={`font-semibold ${trip.yourBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trip.yourBalance >= 0 ? '+' : ''}{trip.currency} {trip.yourBalance.toFixed(2)}
                </div>
              </div>
            </div>

            <Button
              onClick={() => onSelectTrip(trip)}
              className="w-full"
              size="sm"
            >
              View Trip
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}