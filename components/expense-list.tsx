'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Receipt, Users } from 'lucide-react'

interface Expense {
  id: string
  title: string
  description?: string
  amount: number
  currency: string
  category: string
  date: string
  paidById: string
  paidByName: string
  splitType: 'EQUAL' | 'EXACT_AMOUNTS' | 'PERCENTAGES'
  participants: Array<{
    id: string
    name: string
    amount: number
  }>
}

interface Trip {
  id: string
  members: Array<{
    id: string
    name: string
    role: 'ADMIN' | 'MEMBER'
  }>
  currency: string
}

interface ExpenseListProps {
  expenses: Expense[]
  trip: Trip
  onDeleteExpense: (expenseId: string) => void
}

export default function ExpenseList({ expenses, trip, onDeleteExpense }: ExpenseListProps) {
  const { user } = useAuth()
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      FOOD: '🍽️',
      TRANSPORT: '🚗',
      ACCOMMODATION: '🏨',
      ENTERTAINMENT: '🎬',
      SHOPPING: '🛍️',
      GENERAL: '📝'
    }
    return emojis[category] || '📝'
  }

  const getUserParticipation = (expense: Expense) => {
    const participation = expense.participants.find(p => p.id === user?.id)
    return participation?.amount || 0
  }

  const canDeleteExpense = (expense: Expense) => {
    const userMember = trip.members.find(m => m.id === user?.id)
    return expense.paidById === user?.id || userMember?.role === 'ADMIN'
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Receipt className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No expenses yet</h3>
          <p className="text-gray-600 text-center max-w-sm">
            Add your first expense to start tracking shared costs.
          </p>
        </CardContent>
      </Card>
    )
  }

  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => (
        <Card key={expense.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getCategoryEmoji(expense.category)}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{expense.title}</CardTitle>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mt-1">{expense.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Paid by {expense.paidByName}</span>
                    <span>•</span>
                    <span>{formatDate(expense.date)}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {expense.participants.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">
                  {expense.currency} {expense.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  Your share: {expense.currency} {getUserParticipation(expense).toFixed(2)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExpense(
                  selectedExpense === expense.id ? null : expense.id
                )}
              >
                {selectedExpense === expense.id ? 'Hide Details' : 'Show Details'}
              </Button>

              {canDeleteExpense(expense) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {selectedExpense === expense.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid gap-3">
                  <div>
                    <h4 className="font-medium mb-2">Split Details ({expense.splitType.toLowerCase().replace('_', ' ')})</h4>
                    <div className="space-y-1">
                      {expense.participants.map(participant => (
                        <div key={participant.id} className="flex justify-between text-sm">
                          <span className={participant.id === user?.id ? 'font-medium' : ''}>
                            {participant.name} {participant.id === user?.id ? '(You)' : ''}
                          </span>
                          <span>{expense.currency} {participant.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <div><strong>Category:</strong> {expense.category}</div>
                    <div><strong>Split Type:</strong> {expense.splitType.replace('_', ' ').toLowerCase()}</div>
                    <div><strong>Added:</strong> {new Date(expense.date).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}