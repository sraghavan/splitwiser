'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react'

interface Trip {
  id: string
  name: string
  currency: string
  members: Array<{
    id: string
    name: string
    email: string
  }>
}

interface Expense {
  id: string
  paidById: string
  participants: Array<{
    id: string
    amount: number
  }>
}

interface Payment {
  id: string
  payerId: string
  receiverId: string
  amount: number
  date: string
  description?: string
}

interface AdhocPayment {
  id: string
  payerId: string
  receiverId: string
  amount: number
  date: string
  description?: string
}

interface BalancesSummaryProps {
  trip: Trip
  expenses: Expense[]
  payments: Payment[]
  adhocPayments: AdhocPayment[]
  onAddPayment: (payment: { amount: number; description?: string; receiverId: string }) => void
}

interface MemberBalance {
  memberId: string
  memberName: string
  balance: number
  owedToUser: number
  owesUser: number
}

export default function BalancesSummary({
  trip,
  expenses,
  payments,
  adhocPayments,
  onAddPayment
}: BalancesSummaryProps) {
  const { user } = useAuth()
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedReceiver, setSelectedReceiver] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')

  const calculateBalances = (): MemberBalance[] => {
    const balances: Record<string, number> = {}

    trip.members.forEach(member => {
      balances[member.id] = 0
    })

    expenses.forEach(expense => {
      balances[expense.paidById] = (balances[expense.paidById] || 0) + expense.amount

      expense.participants.forEach(participant => {
        balances[participant.id] = (balances[participant.id] || 0) - participant.amount
      })
    })

    payments.forEach(payment => {
      balances[payment.payerId] = (balances[payment.payerId] || 0) - payment.amount
      balances[payment.receiverId] = (balances[payment.receiverId] || 0) + payment.amount
    })

    adhocPayments.forEach(payment => {
      balances[payment.payerId] = (balances[payment.payerId] || 0) - payment.amount
      balances[payment.receiverId] = (balances[payment.receiverId] || 0) + payment.amount
    })

    return trip.members.map(member => {
      const balance = balances[member.id] || 0
      const userBalance = balances[user?.id || ''] || 0

      let owedToUser = 0
      let owesUser = 0

      if (member.id !== user?.id) {
        const netBetweenUsers = balance - userBalance
        if (netBetweenUsers > 0) {
          owedToUser = netBetweenUsers
        } else if (netBetweenUsers < 0) {
          owesUser = Math.abs(netBetweenUsers)
        }
      }

      return {
        memberId: member.id,
        memberName: member.name,
        balance,
        owedToUser,
        owesUser
      }
    }).sort((a, b) => b.balance - a.balance)
  }

  const memberBalances = calculateBalances()
  const userBalance = memberBalances.find(b => b.memberId === user?.id)?.balance || 0

  const handlePayment = () => {
    if (!paymentAmount || !selectedReceiver) return

    onAddPayment({
      amount: parseFloat(paymentAmount),
      description: paymentDescription.trim() || undefined,
      receiverId: selectedReceiver
    })

    setPaymentAmount('')
    setPaymentDescription('')
    setSelectedReceiver('')
    setShowPaymentDialog(false)
  }

  const openPaymentDialog = (receiverId: string) => {
    setSelectedReceiver(receiverId)
    setShowPaymentDialog(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Your Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold mb-2 ${userBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {userBalance >= 0 ? '+' : ''}{trip.currency} {userBalance.toFixed(2)}
          </div>
          <p className="text-sm text-gray-600">
            {userBalance > 0 && 'You are owed money overall'}
            {userBalance < 0 && 'You owe money overall'}
            {userBalance === 0 && 'You are all settled up'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Member Balances</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {memberBalances.map((member) => {
              if (member.memberId === user?.id) return null

              return (
                <div key={member.memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                      {member.memberName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{member.memberName}</div>
                      <div className="text-sm text-gray-600">
                        Overall: {member.balance >= 0 ? '+' : ''}{trip.currency} {member.balance.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    {member.owedToUser > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="text-green-600 text-sm">
                          <ArrowDownLeft className="h-4 w-4 inline mr-1" />
                          Owes you {trip.currency} {member.owedToUser.toFixed(2)}
                        </div>
                      </div>
                    )}

                    {member.owesUser > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="text-red-600 text-sm">
                          <ArrowUpRight className="h-4 w-4 inline mr-1" />
                          You owe {trip.currency} {member.owesUser.toFixed(2)}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => openPaymentDialog(member.memberId)}
                        >
                          Pay
                        </Button>
                      </div>
                    )}

                    {member.owedToUser === 0 && member.owesUser === 0 && (
                      <div className="text-gray-500 text-sm">Settled up</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment to {trip.members.find(m => m.id === selectedReceiver)?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Amount ({trip.currency}) *</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-description">Description</Label>
              <Input
                id="payment-description"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                Record Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}