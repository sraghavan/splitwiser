'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface Trip {
  id: string
  name: string
  members: Array<{
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
  }>
  currency: string
}

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: Trip
  onAddExpense: (expense: {
    title: string
    description?: string
    amount: number
    category: string
    paidById: string
    splitType: 'EQUAL' | 'EXACT_AMOUNTS' | 'PERCENTAGES'
    participants: Array<{ id: string; amount: number }>
  }) => void
}

const EXPENSE_CATEGORIES = [
  { value: 'FOOD', label: 'Food & Dining' },
  { value: 'TRANSPORT', label: 'Transportation' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'GENERAL', label: 'General' }
]

export default function AddExpenseDialog({ open, onOpenChange, trip, onAddExpense }: AddExpenseDialogProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [paidById, setPaidById] = useState(user?.id || '')
  const [splitType, setSplitType] = useState<'EQUAL' | 'EXACT_AMOUNTS' | 'PERCENTAGES'>('EQUAL')
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set([user?.id || '']))
  const [exactAmounts, setExactAmounts] = useState<Record<string, string>>({})
  const [percentages, setPercentages] = useState<Record<string, string>>({})

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setAmount('')
    setCategory('GENERAL')
    setPaidById(user?.id || '')
    setSplitType('EQUAL')
    setSelectedParticipants(new Set([user?.id || '']))
    setExactAmounts({})
    setPercentages({})
  }

  const handleParticipantToggle = (memberId: string) => {
    const newSelected = new Set(selectedParticipants)
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId)
    } else {
      newSelected.add(memberId)
    }
    setSelectedParticipants(newSelected)
  }

  const calculateSplitAmounts = () => {
    const totalAmount = parseFloat(amount)
    const participants = Array.from(selectedParticipants)

    if (splitType === 'EQUAL') {
      const amountPerPerson = totalAmount / participants.length
      return participants.map(id => ({ id, amount: amountPerPerson }))
    }

    if (splitType === 'EXACT_AMOUNTS') {
      return participants.map(id => ({
        id,
        amount: parseFloat(exactAmounts[id] || '0')
      }))
    }

    if (splitType === 'PERCENTAGES') {
      return participants.map(id => ({
        id,
        amount: (totalAmount * parseFloat(percentages[id] || '0')) / 100
      }))
    }

    return []
  }

  const validateForm = () => {
    if (!title.trim() || !amount || selectedParticipants.size === 0) return false

    const totalAmount = parseFloat(amount)
    if (isNaN(totalAmount) || totalAmount <= 0) return false

    if (splitType === 'EXACT_AMOUNTS') {
      const totalExactAmounts = Array.from(selectedParticipants)
        .reduce((sum, id) => sum + parseFloat(exactAmounts[id] || '0'), 0)
      return Math.abs(totalExactAmounts - totalAmount) < 0.01
    }

    if (splitType === 'PERCENTAGES') {
      const totalPercentage = Array.from(selectedParticipants)
        .reduce((sum, id) => sum + parseFloat(percentages[id] || '0'), 0)
      return Math.abs(totalPercentage - 100) < 0.01
    }

    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const participantAmounts = calculateSplitAmounts()

    onAddExpense({
      title: title.trim(),
      description: description.trim() || undefined,
      amount: parseFloat(amount),
      category,
      paidById,
      splitType,
      participants: participantAmounts
    })

    resetForm()
    onOpenChange(false)
  }

  const getValidationMessage = () => {
    if (splitType === 'EXACT_AMOUNTS') {
      const totalExactAmounts = Array.from(selectedParticipants)
        .reduce((sum, id) => sum + parseFloat(exactAmounts[id] || '0'), 0)
      const diff = Math.abs(totalExactAmounts - parseFloat(amount || '0'))
      if (diff > 0.01) {
        return `Exact amounts total ${trip.currency} ${totalExactAmounts.toFixed(2)}, but expense is ${trip.currency} ${amount}`
      }
    }

    if (splitType === 'PERCENTAGES') {
      const totalPercentage = Array.from(selectedParticipants)
        .reduce((sum, id) => sum + parseFloat(percentages[id] || '0'), 0)
      if (Math.abs(totalPercentage - 100) > 0.01) {
        return `Percentages must add up to 100% (currently ${totalPercentage.toFixed(1)}%)`
      }
    }

    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Record a new expense and split it among trip members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-title">Title *</Label>
              <Input
                id="expense-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dinner at restaurant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount ({trip.currency}) *</Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description">Description</Label>
            <Textarea
              id="expense-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details about this expense"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paid-by">Paid by</Label>
              <select
                id="paid-by"
                value={paidById}
                onChange={(e) => setPaidById(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {trip.members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.id === user?.id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Split Type</Label>
            <div className="space-y-2">
              {(['EQUAL', 'EXACT_AMOUNTS', 'PERCENTAGES'] as const).map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`split-${type}`}
                    name="splitType"
                    checked={splitType === type}
                    onChange={() => setSplitType(type)}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`split-${type}`} className="text-sm">
                    {type === 'EQUAL' && 'Split equally'}
                    {type === 'EXACT_AMOUNTS' && 'Enter exact amounts'}
                    {type === 'PERCENTAGES' && 'Enter percentages'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Participants</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {trip.members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedParticipants.has(member.id)}
                      onCheckedChange={() => handleParticipantToggle(member.id)}
                    />
                    <span className="text-sm">
                      {member.name} {member.id === user?.id ? '(You)' : ''}
                    </span>
                  </div>

                  {selectedParticipants.has(member.id) && (
                    <div className="flex items-center space-x-2">
                      {splitType === 'EQUAL' && (
                        <span className="text-sm text-gray-500">
                          {trip.currency} {amount ? (parseFloat(amount) / selectedParticipants.size).toFixed(2) : '0.00'}
                        </span>
                      )}

                      {splitType === 'EXACT_AMOUNTS' && (
                        <Input
                          type="number"
                          step="0.01"
                          value={exactAmounts[member.id] || ''}
                          onChange={(e) => setExactAmounts(prev => ({ ...prev, [member.id]: e.target.value }))}
                          placeholder="0.00"
                          className="w-20 h-8 text-xs"
                        />
                      )}

                      {splitType === 'PERCENTAGES' && (
                        <div className="flex items-center space-x-1">
                          <Input
                            type="number"
                            step="0.1"
                            value={percentages[member.id] || ''}
                            onChange={(e) => setPercentages(prev => ({ ...prev, [member.id]: e.target.value }))}
                            placeholder="0"
                            className="w-16 h-8 text-xs"
                          />
                          <span className="text-xs">%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {getValidationMessage() && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {getValidationMessage()}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!validateForm()}>
              Add Expense
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}