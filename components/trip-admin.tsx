'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Plus, Trash2, Crown, Settings, UserPlus } from 'lucide-react'

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

interface TripAdminProps {
  trip: Trip
  onUpdateTrip: (trip: Trip) => void
  onClose: () => void
}

export default function TripAdmin({ trip, onUpdateTrip, onClose }: TripAdminProps) {
  const { user } = useAuth()
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [bulkMembers, setBulkMembers] = useState('')
  const [showBulkAdd, setShowBulkAdd] = useState(false)

  const isAdmin = trip.members.find(m => m.id === user?.id)?.role === 'ADMIN'

  const addMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return

    // Check if member already exists
    const memberExists = trip.members.some(m => m.email.toLowerCase() === newMemberEmail.trim().toLowerCase())
    if (memberExists) {
      alert('A member with this email already exists in this trip!')
      return
    }

    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      role: 'MEMBER' as const
    }

    const updatedTrip = {
      ...trip,
      members: [...trip.members, newMember]
    }

    onUpdateTrip(updatedTrip)

    // Save member addition to enhanced cache
    const existingData = JSON.parse(localStorage.getItem('splitwise_app_data') || '{}')
    localStorage.setItem('splitwise_app_data', JSON.stringify({
      ...existingData,
      lastUpdated: new Date().toISOString(),
      lastAction: `Added member ${newMemberName.trim()} to ${trip.name}`
    }))

    setNewMemberName('')
    setNewMemberEmail('')
    setShowAddMember(false)
  }

  const removeMember = (memberId: string) => {
    if (memberId === user?.id) return // Can't remove yourself

    const removedMember = trip.members.find(m => m.id === memberId)
    const updatedTrip = {
      ...trip,
      members: trip.members.filter(m => m.id !== memberId)
    }

    onUpdateTrip(updatedTrip)

    // Save removal to enhanced cache
    const existingData = JSON.parse(localStorage.getItem('splitwise_app_data') || '{}')
    localStorage.setItem('splitwise_app_data', JSON.stringify({
      ...existingData,
      lastUpdated: new Date().toISOString(),
      lastAction: `Removed member ${removedMember?.name} from ${trip.name}`
    }))
  }

  const addBulkMembers = () => {
    if (!bulkMembers.trim()) return

    const lines = bulkMembers.split('\n').filter(line => line.trim())
    const newMembers = []
    const errors = []

    for (const line of lines) {
      const parts = line.split(',').map(part => part.trim())
      if (parts.length >= 2) {
        const [name, email] = parts
        if (name && email) {
          // Check if member already exists
          const memberExists = trip.members.some(m => m.email.toLowerCase() === email.toLowerCase())
          if (!memberExists) {
            newMembers.push({
              id: Math.random().toString(36).substr(2, 9),
              name,
              email,
              role: 'MEMBER' as const
            })
          } else {
            errors.push(`${email} already exists`)
          }
        }
      }
    }

    if (errors.length > 0) {
      alert(`Some members were skipped:\n${errors.join('\n')}`)
    }

    if (newMembers.length > 0) {
      const updatedTrip = {
        ...trip,
        members: [...trip.members, ...newMembers]
      }

      onUpdateTrip(updatedTrip)

      // Save bulk addition to enhanced cache
      const existingData = JSON.parse(localStorage.getItem('splitwise_app_data') || '{}')
      localStorage.setItem('splitwise_app_data', JSON.stringify({
        ...existingData,
        lastUpdated: new Date().toISOString(),
        lastAction: `Added ${newMembers.length} members to ${trip.name}`
      }))
    }

    setBulkMembers('')
    setShowBulkAdd(false)
  }

  const toggleCentralMoneyKeeper = () => {
    const updatedTrip = {
      ...trip,
      centralMoneyKeeperId: trip.centralMoneyKeeperId ? undefined : user?.id,
      centralMoneyKeeperName: trip.centralMoneyKeeperId ? undefined : user?.name
    }

    onUpdateTrip(updatedTrip)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Trip Settings</h2>
        </div>
        <Button variant="outline" onClick={onClose}>
          Done
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Trip Members ({trip.members.length})</span>
            </CardTitle>
            <CardDescription>
              Manage who has access to this trip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {trip.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <span>{member.name}</span>
                        {member.role === 'ADMIN' && <Crown className="h-4 w-4 text-yellow-500" />}
                        {member.id === user?.id && <span className="text-xs text-gray-500">(You)</span>}
                      </div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                  </div>
                  {isAdmin && member.id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Button
                  onClick={() => setShowAddMember(true)}
                  className="w-full"
                  variant="outline"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
                <Button
                  onClick={() => setShowBulkAdd(true)}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Bulk Add Members
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip Configuration</CardTitle>
            <CardDescription>
              Central money keeper and other settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Central Money Keeper</div>
                  <div className="text-sm text-gray-600">
                    {trip.centralMoneyKeeperId ?
                      `${trip.centralMoneyKeeperName} handles group payments` :
                      'No central money keeper assigned'
                    }
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    onClick={toggleCentralMoneyKeeper}
                    variant={trip.centralMoneyKeeperId ? "destructive" : "default"}
                    size="sm"
                  >
                    {trip.centralMoneyKeeperId ? 'Remove' : 'Set as Me'}
                  </Button>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Trip Details</div>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <div><strong>Name:</strong> {trip.name}</div>
                  {trip.description && <div><strong>Description:</strong> {trip.description}</div>}
                  <div><strong>Currency:</strong> {trip.currency}</div>
                  <div><strong>Members:</strong> {trip.members.length}</div>
                </div>
              </div>

              {trip.centralMoneyKeeperId && (
                <div className="text-xs bg-blue-50 text-blue-700 p-3 rounded-lg">
                  <strong>Central Money Keeper Mode:</strong> The central money keeper handles most group payments.
                  Other members can send money ad-hoc to cover their share of expenses.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Add a new person to this trip
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">Name *</Label>
              <Input
                id="member-name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-email">Email *</Label>
              <Input
                id="member-email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter member's email"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMember(false)}>
                Cancel
              </Button>
              <Button
                onClick={addMember}
                disabled={!newMemberName.trim() || !newMemberEmail.trim()}
              >
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBulkAdd} onOpenChange={setShowBulkAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Add Members</DialogTitle>
            <DialogDescription>
              Add multiple members at once. Enter one member per line in the format: Name, Email
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-members">Members *</Label>
              <textarea
                id="bulk-members"
                value={bulkMembers}
                onChange={(e) => setBulkMembers(e.target.value)}
                placeholder={`John Doe, john@example.com
Jane Smith, jane@example.com
Bob Wilson, bob@example.com`}
                className="w-full h-32 p-3 border rounded-md text-sm"
                rows={6}
              />
              <div className="text-xs text-gray-500">
                Format: Name, Email (one per line)
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBulkAdd(false)}>
                Cancel
              </Button>
              <Button
                onClick={addBulkMembers}
                disabled={!bulkMembers.trim()}
              >
                Add Members
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}