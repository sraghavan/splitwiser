'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Wifi, WifiOff, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface DatabaseStatus {
  connected: boolean
  lastChecked: string
  responseTime?: number
  error?: string
}

interface SyncStatus {
  localTrips: number
  databaseTrips: number
  synced: boolean
  lastSync: string
}

export default function DatabaseStatusMonitor() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: false,
    lastChecked: 'Never'
  })
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    localTrips: 0,
    databaseTrips: 0,
    synced: false,
    lastSync: 'Never'
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkDatabaseConnection = async () => {
    setIsChecking(true)
    const startTime = Date.now()

    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        setDbStatus({
          connected: true,
          lastChecked: new Date().toLocaleTimeString(),
          responseTime
        })
      } else {
        setDbStatus({
          connected: false,
          lastChecked: new Date().toLocaleTimeString(),
          error: `HTTP ${response.status}`
        })
      }
    } catch (error) {
      setDbStatus({
        connected: false,
        lastChecked: new Date().toLocaleTimeString(),
        error: error instanceof Error ? error.message : 'Connection failed'
      })
    } finally {
      setIsChecking(false)
    }
  }

  const checkSyncStatus = () => {
    const localTrips = JSON.parse(localStorage.getItem('trips') || '[]')
    const appData = JSON.parse(localStorage.getItem('splitwise_app_data') || '{}')

    setSyncStatus({
      localTrips: localTrips.length,
      databaseTrips: 0, // Will be updated when we can query the database
      synced: dbStatus.connected,
      lastSync: appData.lastUpdated || 'Never'
    })
  }

  useEffect(() => {
    checkSyncStatus()
  }, [dbStatus])

  const getStatusIcon = () => {
    if (!dbStatus.connected) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    if (syncStatus.synced) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusColor = () => {
    if (!dbStatus.connected) return 'bg-red-500'
    if (syncStatus.synced) return 'bg-green-500'
    return 'bg-yellow-500'
  }

  return (
    <>
      {/* Floating Status Icon */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowModal(true)}
          size="sm"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 shadow-lg bg-white border-2"
        >
          <div className="relative">
            <Database className="h-5 w-5" />
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getStatusColor()}`}
            />
          </div>
        </Button>
      </div>

      {/* Status Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Status Monitor</span>
            </DialogTitle>
            <DialogDescription>
              Check your database connection and data sync status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Database Connection Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  {dbStatus.connected ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  <span>Database Connection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Status</div>
                    <div className={`${dbStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                      {dbStatus.connected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Last Checked</div>
                    <div className="text-gray-600">{dbStatus.lastChecked}</div>
                  </div>
                  {dbStatus.responseTime && (
                    <div>
                      <div className="font-medium">Response Time</div>
                      <div className="text-gray-600">{dbStatus.responseTime}ms</div>
                    </div>
                  )}
                  {dbStatus.error && (
                    <div>
                      <div className="font-medium">Error</div>
                      <div className="text-red-600 text-xs">{dbStatus.error}</div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={checkDatabaseConnection}
                  disabled={isChecking}
                  size="sm"
                  className="w-full"
                >
                  {isChecking ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </CardContent>
            </Card>

            {/* Data Sync Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  {getStatusIcon()}
                  <span>Data Sync Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Local Trips</div>
                    <div className="text-gray-600">{syncStatus.localTrips}</div>
                  </div>
                  <div>
                    <div className="font-medium">Database Trips</div>
                    <div className="text-gray-600">
                      {dbStatus.connected ? 'Checking...' : 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Sync Status</div>
                    <div className={`${syncStatus.synced ? 'text-green-600' : 'text-yellow-600'}`}>
                      {syncStatus.synced ? 'In Sync' : 'Using Local Cache'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Last Update</div>
                    <div className="text-gray-600 text-xs">
                      {syncStatus.lastSync !== 'Never'
                        ? new Date(syncStatus.lastSync).toLocaleString()
                        : 'Never'
                      }
                    </div>
                  </div>
                </div>

                {user && (
                  <div className="pt-3 border-t">
                    <div className="text-sm">
                      <div className="font-medium">Logged in as:</div>
                      <div className="text-gray-600">{user.name} ({user.email})</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Storage Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Local Storage Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Cache Strategy:</span> Local storage with database sync
                  </div>
                  <div>
                    <span className="font-medium">Data Persistence:</span> {dbStatus.connected ? 'Database + Local' : 'Local Only'}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {!dbStatus.connected
                      ? 'Working offline - data will sync when connection restored'
                      : 'All changes are being saved to database'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}