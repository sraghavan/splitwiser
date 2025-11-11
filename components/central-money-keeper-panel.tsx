'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Crown, Plus, Wallet, ArrowDownRight, History, DollarSign } from 'lucide-react'

interface Trip {
  id: string
  name: string
  currency: string
  centralMoneyKeeperId?: string
  centralMoneyKeeperName?: string
  members: Array<{
    id: string
    name: string
    email: string
  }>
}

interface Payment {
  id: string
  payerId: string
  payerName: string
  receiverId: string
  receiverName: string
  amount: number
  date: string
  description?: string
}

interface AdhocPayment {
  id: string
  payerId: string
  payerName: string
  receiverId: string
  receiverName: string
  amount: number
  date: string
  description?: string
}

interface CentralMoneyKeeperPanelProps {
  trip: Trip
  payments: Payment[]
  adhocPayments: AdhocPayment[]
  onAddAdhocPayment: (payment: { amount: number; description?: string; payerId: string }) => void
}

export default function CentralMoneyKeeperPanel({
  trip,
  payments,
  adhocPayments,
  onAddAdhocPayment
}: CentralMoneyKeeperPanelProps) {
  const { user } = useAuth()
  const [showAdhocDialog, setShowAdhocDialog] = useState(false)
  const [selectedPayer, setSelectedPayer] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')

  const isCentralMoneyKeeper = trip.centralMoneyKeeperId === user?.id

  const allPayments = [
    ...payments.map(p => ({ ...p, type: 'regular' as const })),
    ...adhocPayments.map(p => ({ ...p, type: 'adhoc' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateMemberContributions = () => {
    const contributions: Record<string, number> = {}

    trip.members.forEach(member => {
      contributions[member.id] = 0
    })

    adhocPayments.forEach(payment => {
      if (payment.receiverId === trip.centralMoneyKeeperId) {
        contributions[payment.payerId] = (contributions[payment.payerId] || 0) + payment.amount
      }
    })

    return trip.members
      .filter(member => member.id !== trip.centralMoneyKeeperId)
      .map(member => ({
        ...member,
        totalContributed: contributions[member.id] || 0
      }))
      .sort((a, b) => b.totalContributed - a.totalContributed)
  }

  const memberContributions = calculateMemberContributions()
  const totalReceived = adhocPayments
    .filter(p => p.receiverId === trip.centralMoneyKeeperId)
    .reduce((sum, p) => sum + p.amount, 0)

  const handleAdhocPayment = () => {
    if (!paymentAmount || !selectedPayer) return

    onAddAdhocPayment({
      amount: parseFloat(paymentAmount),
      description: paymentDescription.trim() || undefined,
      payerId: selectedPayer
    })

    setPaymentAmount('')
    setPaymentDescription('')
    setSelectedPayer('')
    setShowAdhocDialog(false)
  }

  if (!trip.centralMoneyKeeperId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Crown className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Central Money Keeper</h3>
          <p className="text-gray-600 text-center max-w-sm">
            This trip doesn't have a central money keeper assigned. Set one up in the trip settings to enable ad-hoc payments.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <Crown className="h-5 w-5" />
            <span>Central Money Keeper: {trip.centralMoneyKeeperName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-yellow-700">
            <p>
              As the central money keeper, you handle most group payments.
              Other members can send you money ad-hoc to cover their share of expenses.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Ad-hoc Contributions</span>
            </CardTitle>
            {isCentralMoneyKeeper && (
              <Button size="sm" onClick={() => setShowAdhocDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Record Payment
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="text-2xl font-bold text-green-600">
                {trip.currency} {totalReceived.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total received from members</div>
            </div>

            <div className="space-y-3">
              {memberContributions.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {trip.currency} {member.totalContributed.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">contributed</div>
                  </div>
                </div>
              ))}

              {memberContributions.every(m => m.totalContributed === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No contributions yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Payment History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {allPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      payment.type === 'adhoc' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {payment.type === 'adhoc' ? (
                        <ArrowDownRight className={`h-4 w-4 ${
                          payment.type === 'adhoc' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {payment.payerName} → {payment.receiverName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.date)}
                        {payment.description && ` • ${payment.description}`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {payment.type === 'adhoc' ? 'Ad-hoc payment' : 'Settlement'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {trip.currency} {payment.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              {allPayments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No payments yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAdhocDialog} onOpenChange={setShowAdhocDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Ad-hoc Payment</DialogTitle>
            <DialogDescription>
              Record money received from a trip member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payer">From Member *</Label>
              <select
                id="payer"
                value={selectedPayer}
                onChange={(e) => setSelectedPayer(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a member...</option>
                {trip.members
                  .filter(member => member.id !== trip.centralMoneyKeeperId)
                  .map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adhoc-amount">Amount ({trip.currency}) *</Label>
              <Input
                id="adhoc-amount"
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adhoc-description">Description</Label>
              <Input
                id="adhoc-description"
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAdhocDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdhocPayment}
                disabled={!paymentAmount || !selectedPayer || parseFloat(paymentAmount) <= 0}
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