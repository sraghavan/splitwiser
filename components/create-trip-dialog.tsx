'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface CreateTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTrip: (trip: {
    name: string
    description?: string
    currency: string
    centralMoneyKeeperId?: string
  }) => void
}

export default function CreateTripDialog({
  open,
  onOpenChange,
  onCreateTrip
}: CreateTripDialogProps) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [isCentralMoneyKeeper, setIsCentralMoneyKeeper] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onCreateTrip({
      name: name.trim(),
      description: description.trim() || undefined,
      currency,
      centralMoneyKeeperId: isCentralMoneyKeeper ? user?.id : undefined
    })

    setName('')
    setDescription('')
    setCurrency('USD')
    setIsCentralMoneyKeeper(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Set up a new trip to start tracking shared expenses with your group.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trip-name">Trip Name *</Label>
            <Input
              id="trip-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Weekend in Paris"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trip-description">Description</Label>
            <Textarea
              id="trip-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of your trip"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="central-money-keeper"
              checked={isCentralMoneyKeeper}
              onCheckedChange={(checked) => setIsCentralMoneyKeeper(checked as boolean)}
            />
            <Label htmlFor="central-money-keeper" className="text-sm">
              I will be the central money keeper for this trip
            </Label>
          </div>

          {isCentralMoneyKeeper && (
            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md">
              As the central money keeper, you'll handle most payments and other members can send you money ad-hoc to cover their share of expenses.
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}