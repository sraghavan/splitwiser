'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Settings, DollarSign, Users, CreditCard } from 'lucide-react'
import TripAdmin from '@/components/trip-admin'
import AddExpenseDialog from '@/components/add-expense-dialog'
import ExpenseList from '@/components/expense-list'
import BalancesSummary from '@/components/balances-summary'
import CentralMoneyKeeperPanel from '@/components/central-money-keeper-panel'
import DatabaseStatusMonitor from '@/components/database-status-monitor'

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

interface Payment {
  id: string
  amount: number
  currency: string
  description?: string
  date: string
  payerId: string
  payerName: string
  receiverId: string
  receiverName: string
}

interface AdhocPayment {
  id: string
  amount: number
  currency: string
  description?: string
  date: string
  payerId: string
  payerName: string
  receiverId: string
  receiverName: string
}

interface ExpenseTrackerProps {
  trip: Trip
  onBack: () => void
  onUpdateTrip: (trip: Trip) => void
}

export default function ExpenseTracker({ trip, onBack, onUpdateTrip }: ExpenseTrackerProps) {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<'expenses' | 'balances' | 'payments' | 'admin'>('expenses')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [adhocPayments, setAdhocPayments] = useState<AdhocPayment[]>([])

  useEffect(() => {
    const savedExpenses = localStorage.getItem(`expenses_${trip.id}`)
    const savedPayments = localStorage.getItem(`payments_${trip.id}`)
    const savedAdhocPayments = localStorage.getItem(`adhoc_payments_${trip.id}`)

    if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
    if (savedPayments) setPayments(JSON.parse(savedPayments))
    if (savedAdhocPayments) setAdhocPayments(JSON.parse(savedAdhocPayments))
  }, [trip.id])

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses)
    localStorage.setItem(`expenses_${trip.id}`, JSON.stringify(newExpenses))
    updateTripBalances(newExpenses, payments, adhocPayments)
  }

  const savePayments = (newPayments: Payment[]) => {
    setPayments(newPayments)
    localStorage.setItem(`payments_${trip.id}`, JSON.stringify(newPayments))
    updateTripBalances(expenses, newPayments, adhocPayments)
  }

  const saveAdhocPayments = (newAdhocPayments: AdhocPayment[]) => {
    setAdhocPayments(newAdhocPayments)
    localStorage.setItem(`adhoc_payments_${trip.id}`, JSON.stringify(newAdhocPayments))
    updateTripBalances(expenses, payments, newAdhocPayments)
  }

  const updateTripBalances = (expenses: Expense[], payments: Payment[], adhocPayments: AdhocPayment[]) => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    let userBalance = 0

    expenses.forEach(expense => {
      if (expense.paidById === user?.id) {
        userBalance += expense.amount
      }

      const userParticipation = expense.participants.find(p => p.id === user?.id)
      if (userParticipation) {
        userBalance -= userParticipation.amount
      }
    })

    payments.forEach(payment => {
      if (payment.payerId === user?.id) {
        userBalance -= payment.amount
      }
      if (payment.receiverId === user?.id) {
        userBalance += payment.amount
      }
    })

    adhocPayments.forEach(payment => {
      if (payment.payerId === user?.id) {
        userBalance -= payment.amount
      }
      if (payment.receiverId === user?.id) {
        userBalance += payment.amount
      }
    })

    const updatedTrip = {
      ...trip,
      totalExpenses,
      yourBalance: userBalance
    }

    onUpdateTrip(updatedTrip)
  }

  const addExpense = (expenseData: {
    title: string
    description?: string
    amount: number
    category: string
    paidById: string
    splitType: 'EQUAL' | 'EXACT_AMOUNTS' | 'PERCENTAGES'
    participants: Array<{ id: string; amount: number }>
  }) => {
    const paidBy = trip.members.find(m => m.id === expenseData.paidById)

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      ...expenseData,
      currency: trip.currency,
      date: new Date().toISOString(),
      paidByName: paidBy?.name || 'Unknown',
      participants: expenseData.participants.map(p => {
        const member = trip.members.find(m => m.id === p.id)
        return {
          ...p,
          name: member?.name || 'Unknown'
        }
      })
    }

    saveExpenses([...expenses, newExpense])
  }

  const addPayment = (paymentData: {
    amount: number
    description?: string
    receiverId: string
  }) => {
    const receiver = trip.members.find(m => m.id === paymentData.receiverId)

    const newPayment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      ...paymentData,
      currency: trip.currency,
      date: new Date().toISOString(),
      payerId: user!.id,
      payerName: user!.name,
      receiverName: receiver?.name || 'Unknown'
    }

    savePayments([...payments, newPayment])
  }

  const addAdhocPayment = (paymentData: {
    amount: number
    description?: string
    payerId: string
  }) => {
    const payer = trip.members.find(m => m.id === paymentData.payerId)

    const newAdhocPayment: AdhocPayment = {
      id: Math.random().toString(36).substr(2, 9),
      ...paymentData,
      currency: trip.currency,
      date: new Date().toISOString(),
      payerName: payer?.name || 'Unknown',
      receiverId: trip.centralMoneyKeeperId!,
      receiverName: trip.centralMoneyKeeperName || 'Central Money Keeper'
    }

    saveAdhocPayments([...adhocPayments, newAdhocPayment])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{trip.name}</h1>
                <p className="text-sm text-gray-600">{trip.members.length} members</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView('admin')}
                className="hidden sm:flex"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => setShowAddExpense(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'admin' ? (
          <TripAdmin
            trip={trip}
            onUpdateTrip={onUpdateTrip}
            onClose={() => setCurrentView('expenses')}
          />
        ) : (
          <>
            <div className="flex space-x-1 mb-6">
              <Button
                variant={currentView === 'expenses' ? 'default' : 'outline'}
                onClick={() => setCurrentView('expenses')}
                className="flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Expenses</span>
              </Button>
              <Button
                variant={currentView === 'balances' ? 'default' : 'outline'}
                onClick={() => setCurrentView('balances')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Balances</span>
              </Button>
              <Button
                variant={currentView === 'payments' ? 'default' : 'outline'}
                onClick={() => setCurrentView('payments')}
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Payments</span>
              </Button>
            </div>

            {currentView === 'expenses' && (
              <ExpenseList
                expenses={expenses}
                trip={trip}
                onDeleteExpense={(expenseId) => {
                  saveExpenses(expenses.filter(e => e.id !== expenseId))
                }}
              />
            )}

            {currentView === 'balances' && (
              <BalancesSummary
                trip={trip}
                expenses={expenses}
                payments={payments}
                adhocPayments={adhocPayments}
                onAddPayment={addPayment}
              />
            )}

            {currentView === 'payments' && trip.centralMoneyKeeperId && (
              <CentralMoneyKeeperPanel
                trip={trip}
                payments={payments}
                adhocPayments={adhocPayments}
                onAddAdhocPayment={addAdhocPayment}
              />
            )}
          </>
        )}

        <AddExpenseDialog
          open={showAddExpense}
          onOpenChange={setShowAddExpense}
          trip={trip}
          onAddExpense={addExpense}
        />

        {/* Database Status Monitor */}
        <DatabaseStatusMonitor />
      </div>
    </div>
  )
}