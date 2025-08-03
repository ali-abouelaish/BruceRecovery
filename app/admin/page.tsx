"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  BarChart3, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  ShoppingCart,
  MapPin,
  Car,
  RefreshCw,
  LogOut
} from "lucide-react"
import { databaseService, type QuoteRequest, type ConsultationBooking } from "@/lib/database-service"

export default function AdminDashboard() {
  const router = useRouter()
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<QuoteRequest | ConsultationBooking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)

    const loadData = async () => {
      try {
        // Initialize mock data if needed
        await databaseService.initializeMockData()
        
        // Load data from service
        const [quotes, consults] = await Promise.all([
          databaseService.getQuoteRequests(),
          databaseService.getConsultations()
        ])
        
        setQuoteRequests(quotes)
        setConsultations(consults)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  // Analytics calculations
  const totalQuoteRequests = quoteRequests.length
  const totalConsultations = consultations.length
  const pendingQuotes = quoteRequests.filter(q => q.status === 'pending').length
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length
  const emergencyRequests = consultations.filter(c => c.emergencyService).length
  const totalRevenue = quoteRequests
    .filter(q => q.quote_amount && q.status === 'completed')
    .reduce((sum, q) => sum + (q.quote_amount || 0), 0)

  const handleViewDetails = (record: QuoteRequest | ConsultationBooking) => {
    setSelectedRecord(record)
    setShowDetailsModal(true)
  }

  const handleStatusChange = async (id: string, newStatus: string, type: 'quote' | 'consultation') => {
    try {
      if (type === 'quote') {
        const updated = await databaseService.updateQuoteRequest(id, { status: newStatus as any })
        if (updated) {
          setQuoteRequests(prev => 
            prev.map(q => q.id === id ? updated : q)
          )
        }
      } else {
        const updated = await databaseService.updateConsultation(id, { status: newStatus as any })
        if (updated) {
          setConsultations(prev => 
            prev.map(c => c.id === id ? updated : c)
          )
        }
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('No data to export')
      return
    }

    // Get headers from the first object
    const headers = Object.keys(data[0])
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Handle values that contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportQuoteRequests = () => {
    const exportData = filteredQuoteRequests.map(quote => ({
      'Customer Name': quote.name,
      'Email': quote.email,
      'Phone': quote.phone,
      'Vehicle Make': quote.vehicleMake,
      'Vehicle Model': quote.vehicleModel,
      'Vehicle Year': quote.vehicleYear,
      'Transport Type': quote.transportType,
      'Transport Details': quote.transportDetails,
      'Urgency': quote.urgency,
      'Status': quote.status,
      'Quote Amount': quote.quote_amount || '',
      'Created Date': new Date(quote.created_at).toLocaleDateString()
    }))
    exportToCSV(exportData, 'quote_requests')
  }

  const handleExportConsultations = () => {
    const exportData = filteredConsultations.map(consultation => ({
      'Customer Name': consultation.name,
      'Email': consultation.email,
      'Phone': consultation.phone,
      'Address': consultation.address,
      'Vehicle Make': consultation.vehicleMake,
      'Vehicle Model': consultation.vehicleModel,
      'Vehicle Year': consultation.vehicleYear,
      'Issue Type': consultation.issueType,
      'Issue Description': consultation.issueDescription,
      'Preferred Date': consultation.preferredDate,
      'Preferred Time': consultation.preferredTime,
      'Emergency Service': consultation.emergencyService ? 'Yes' : 'No',
      'On-site Service': consultation.onSiteService ? 'Yes' : 'No',
      'Status': consultation.status,
      'Mechanic Assigned': consultation.mechanicAssigned || '',
      'Created Date': new Date(consultation.created_at).toLocaleDateString()
    }))
    exportToCSV(exportData, 'consultations')
  }

  const filteredQuoteRequests = quoteRequests.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      quoted: { color: "bg-blue-500", text: "Quoted" },
      confirmed: { color: "bg-blue-500", text: "Confirmed" },
      "in-progress": { color: "bg-orange-500", text: "In Progress" },
      completed: { color: "bg-green-500", text: "Completed" },
      cancelled: { color: "bg-red-500", text: "Cancelled" }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.text}</Badge>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage quote requests and consultation bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Quote Requests</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalQuoteRequests}</div>
              <p className="text-xs text-slate-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Consultations</CardTitle>
              <Wrench className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalConsultations}</div>
              <p className="text-xs text-slate-400">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Emergency Requests</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{emergencyRequests}</div>
              <p className="text-xs text-slate-400">Priority attention needed</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Completed quotes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="quotes" className="data-[state=active]:bg-blue-500">
              Quote Requests ({totalQuoteRequests})
            </TabsTrigger>
            <TabsTrigger value="consultations" className="data-[state=active]:bg-green-500">
              Consultations ({totalConsultations})
            </TabsTrigger>
          </TabsList>

          {/* Quote Requests Tab */}
          <TabsContent value="quotes" className="space-y-6">
                         {/* Filters */}
             <Card className="bg-slate-800/50 border-slate-700">
               <CardContent className="p-6">
                 <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input
                         placeholder="Search by name, email, or vehicle..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                       />
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                       <SelectTrigger className="w-[180px] bg-slate-700/50 border-slate-600 text-white">
                         <SelectValue placeholder="Filter by status" />
                       </SelectTrigger>
                       <SelectContent className="bg-slate-800 border-slate-700">
                         <SelectItem value="all" className="text-white hover:bg-slate-700 focus:bg-slate-700">All Status</SelectItem>
                         <SelectItem value="pending" className="text-white hover:bg-slate-700 focus:bg-slate-700">Pending</SelectItem>
                         <SelectItem value="quoted" className="text-white hover:bg-slate-700 focus:bg-slate-700">Quoted</SelectItem>
                         <SelectItem value="completed" className="text-white hover:bg-slate-700 focus:bg-slate-700">Completed</SelectItem>
                         <SelectItem value="cancelled" className="text-white hover:bg-slate-700 focus:bg-slate-700">Cancelled</SelectItem>
                       </SelectContent>
                     </Select>
                     <Button 
                       variant="outline" 
                       className="border-slate-600 text-slate-300 hover:bg-slate-700"
                       onClick={handleExportQuoteRequests}
                     >
                       <Download className="h-4 w-4 mr-2" />
                       Export
                     </Button>
                   </div>
                 </div>
               </CardContent>
             </Card>

                         {/* Quote Requests Table */}
             <Card className="bg-slate-800/50 border-slate-700">
               <CardHeader>
                 <CardTitle className="text-white">Quote Requests</CardTitle>
                 <CardDescription className="text-slate-400">
                   Manage customer quote requests for vehicle parts
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow className="border-slate-700">
                       <TableHead className="text-slate-300">Customer</TableHead>
                       <TableHead className="text-slate-300">Vehicle</TableHead>
                                              <TableHead className="text-slate-300">Transport Type</TableHead>
                       <TableHead className="text-slate-300">Urgency</TableHead>
                       <TableHead className="text-slate-300">Status</TableHead>
                       <TableHead className="text-slate-300">Quote Amount</TableHead>
                       <TableHead className="text-slate-300">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredQuoteRequests.map((quote) => (
                       <TableRow key={quote.id} className="border-slate-700">
                         <TableCell className="text-white">
                           <div>
                             <div className="font-medium">{quote.name}</div>
                             <div className="text-sm text-slate-400">{quote.email}</div>
                             <div className="text-sm text-slate-400">{quote.phone}</div>
                           </div>
                         </TableCell>
                         <TableCell className="text-white">
                           <div className="flex items-center gap-2">
                             <Car className="h-4 w-4 text-blue-400" />
                             <div>
                               <div className="font-medium">{quote.vehicleYear} {quote.vehicleMake}</div>
                               <div className="text-sm text-slate-400">{quote.vehicleModel}</div>
                             </div>
                           </div>
                         </TableCell>
                                                  <TableCell className="text-white">
                            <Badge variant="outline" className="border-slate-600">
                              {quote.transportType}
                            </Badge>
                          </TableCell>
                         <TableCell className="text-white">
                           <Badge 
                             className={
                               quote.urgency === 'emergency' ? 'bg-red-500' :
                               quote.urgency === 'urgent' ? 'bg-orange-500' :
                               'bg-blue-500'
                             }
                           >
                             {quote.urgency}
                           </Badge>
                         </TableCell>
                         <TableCell>{getStatusBadge(quote.status)}</TableCell>
                         <TableCell className="text-white">
                           {quote.quote_amount ? `$${quote.quote_amount}` : '-'}
                         </TableCell>
                                                  <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(quote)}
                                className="border-slate-600 text-slate-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Select
                                value={quote.status}
                                onValueChange={(value) => handleStatusChange(quote.id, value, 'quote')}
                              >
                                <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-700/50 border-slate-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem value="pending" className="text-white hover:bg-slate-700 focus:bg-slate-700">Pending</SelectItem>
                                  <SelectItem value="quoted" className="text-white hover:bg-slate-700 focus:bg-slate-700">Quoted</SelectItem>
                                  <SelectItem value="completed" className="text-white hover:bg-slate-700 focus:bg-slate-700">Completed</SelectItem>
                                  <SelectItem value="cancelled" className="text-white hover:bg-slate-700 focus:bg-slate-700">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
          </TabsContent>

                     {/* Consultations Tab */}
           <TabsContent value="consultations" className="space-y-6">
             {/* Filters */}
             <Card className="bg-slate-800/50 border-slate-700">
               <CardContent className="p-6">
                 <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1">
                     <div className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input
                         placeholder="Search by name, email, or vehicle..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                       />
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <Select value={statusFilter} onValueChange={setStatusFilter}>
                       <SelectTrigger className="w-[180px] bg-slate-700/50 border-slate-600 text-white">
                         <SelectValue placeholder="Filter by status" />
                       </SelectTrigger>
                       <SelectContent className="bg-slate-800 border-slate-700">
                         <SelectItem value="all" className="text-white hover:bg-slate-700 focus:bg-slate-700">All Status</SelectItem>
                         <SelectItem value="pending" className="text-white hover:bg-slate-700 focus:bg-slate-700">Pending</SelectItem>
                         <SelectItem value="confirmed" className="text-white hover:bg-slate-700 focus:bg-slate-700">Confirmed</SelectItem>
                         <SelectItem value="in-progress" className="text-white hover:bg-slate-700 focus:bg-slate-700">In Progress</SelectItem>
                         <SelectItem value="completed" className="text-white hover:bg-slate-700 focus:bg-slate-700">Completed</SelectItem>
                         <SelectItem value="cancelled" className="text-white hover:bg-slate-700 focus:bg-slate-700">Cancelled</SelectItem>
                       </SelectContent>
                     </Select>
                     <Button 
                       variant="outline" 
                       className="border-slate-600 text-slate-300 hover:bg-slate-700"
                       onClick={handleExportConsultations}
                     >
                       <Download className="h-4 w-4 mr-2" />
                       Export
                     </Button>
                   </div>
                 </div>
               </CardContent>
             </Card>

                         {/* Consultations Table */}
             <Card className="bg-slate-800/50 border-slate-700">
               <CardHeader>
                 <CardTitle className="text-white">Consultation Bookings</CardTitle>
                 <CardDescription className="text-slate-400">
                   Manage mechanic consultation appointments
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow className="border-slate-700">
                       <TableHead className="text-slate-300">Customer</TableHead>
                       <TableHead className="text-slate-300">Vehicle</TableHead>
                       <TableHead className="text-slate-300">Issue</TableHead>
                       <TableHead className="text-slate-300">Service Type</TableHead>
                       <TableHead className="text-slate-300">Scheduled</TableHead>
                       <TableHead className="text-slate-300">Status</TableHead>
                       <TableHead className="text-slate-300">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredConsultations.map((consultation) => (
                       <TableRow key={consultation.id} className="border-slate-700">
                         <TableCell className="text-white">
                           <div>
                             <div className="font-medium">{consultation.name}</div>
                             <div className="text-sm text-slate-400">{consultation.email}</div>
                             <div className="text-sm text-slate-400">{consultation.phone}</div>
                           </div>
                         </TableCell>
                         <TableCell className="text-white">
                           <div className="flex items-center gap-2">
                             <Car className="h-4 w-4 text-green-400" />
                             <div>
                               <div className="font-medium">{consultation.vehicleYear} {consultation.vehicleMake}</div>
                               <div className="text-sm text-slate-400">{consultation.vehicleModel}</div>
                             </div>
                           </div>
                         </TableCell>
                         <TableCell className="text-white">
                           <div>
                             <Badge variant="outline" className="border-slate-600 mb-1">
                               {consultation.issueType}
                             </Badge>
                             {consultation.emergencyService && (
                               <Badge className="bg-red-500 text-xs">Emergency</Badge>
                             )}
                           </div>
                         </TableCell>
                         <TableCell className="text-white">
                           <div className="flex items-center gap-2">
                             {consultation.onSiteService ? (
                               <>
                                 <MapPin className="h-4 w-4 text-green-400" />
                                 <span className="text-sm">On-site</span>
                               </>
                             ) : (
                               <>
                                 <Wrench className="h-4 w-4 text-blue-400" />
                                 <span className="text-sm">Workshop</span>
                               </>
                             )}
                           </div>
                         </TableCell>
                         <TableCell className="text-white">
                           <div>
                             <div className="font-medium">{consultation.preferredDate}</div>
                             <div className="text-sm text-slate-400">{consultation.preferredTime}</div>
                           </div>
                         </TableCell>
                         <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                                                  <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(consultation)}
                                className="border-slate-600 text-slate-300"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Select
                                value={consultation.status}
                                onValueChange={(value) => handleStatusChange(consultation.id, value, 'consultation')}
                              >
                                <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-700/50 border-slate-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                  <SelectItem value="pending" className="text-white hover:bg-slate-700 focus:bg-slate-700">Pending</SelectItem>
                                  <SelectItem value="confirmed" className="text-white hover:bg-slate-700 focus:bg-slate-700">Confirmed</SelectItem>
                                  <SelectItem value="in-progress" className="text-white hover:bg-slate-700 focus:bg-slate-700">In Progress</SelectItem>
                                  <SelectItem value="completed" className="text-white hover:bg-slate-700 focus:bg-slate-700">Completed</SelectItem>
                                  <SelectItem value="cancelled" className="text-white hover:bg-slate-700 focus:bg-slate-700">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>

             {/* Details Modal */}
       <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
         <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
           <DialogHeader>
             <DialogTitle className="text-white">
               {selectedRecord && 'id' in selectedRecord && selectedRecord.id.startsWith('QR') 
                 ? 'Quote Request Details' 
                 : 'Consultation Details'
               }
             </DialogTitle>
             <DialogDescription className="text-slate-400">
               View complete information for this record
             </DialogDescription>
           </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              {selectedRecord.id.startsWith('QR') ? (
                // Quote Request Details
                <div className="space-y-4">
                                     <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-slate-300">Customer Name</label>
                       <p className="text-white">{(selectedRecord as QuoteRequest).name}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Email</label>
                       <p className="text-white">{(selectedRecord as QuoteRequest).email}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Phone</label>
                       <p className="text-white">{(selectedRecord as QuoteRequest).phone}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Vehicle</label>
                       <p className="text-white">
                         {(selectedRecord as QuoteRequest).vehicleYear} {(selectedRecord as QuoteRequest).vehicleMake} {(selectedRecord as QuoteRequest).vehicleModel}
                       </p>
                     </div>
                                          <div>
                        <label className="text-sm font-medium text-slate-300">Transport Type</label>
                        <p className="text-white">{(selectedRecord as QuoteRequest).transportType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300">Urgency</label>
                        <p className="text-white">{(selectedRecord as QuoteRequest).urgency}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Transport Details</label>
                      <p className="text-white mt-1">{(selectedRecord as QuoteRequest).transportDetails}</p>
                    </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-slate-300">Status</label>
                       <div className="mt-1">{getStatusBadge((selectedRecord as QuoteRequest).status)}</div>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Quote Amount</label>
                       <p className="text-white">
                         {(selectedRecord as QuoteRequest).quote_amount 
                           ? `$${(selectedRecord as QuoteRequest).quote_amount}` 
                           : 'Not quoted yet'
                         }
                       </p>
                     </div>
                   </div>
                </div>
              ) : (
                                 // Consultation Details
                 <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-slate-300">Customer Name</label>
                       <p className="text-white">{(selectedRecord as ConsultationBooking).name}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Email</label>
                       <p className="text-white">{(selectedRecord as ConsultationBooking).email}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Phone</label>
                       <p className="text-white">{(selectedRecord as ConsultationBooking).phone}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Vehicle</label>
                       <p className="text-white">
                         {(selectedRecord as ConsultationBooking).vehicleYear} {(selectedRecord as ConsultationBooking).vehicleMake} {(selectedRecord as ConsultationBooking).vehicleModel}
                       </p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Issue Type</label>
                       <p className="text-white">{(selectedRecord as ConsultationBooking).issueType}</p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Service Type</label>
                       <p className="text-white">
                         {(selectedRecord as ConsultationBooking).onSiteService ? 'On-site' : 'Workshop'}
                       </p>
                     </div>
                   </div>
                   <div>
                     <label className="text-sm font-medium text-slate-300">Address</label>
                     <p className="text-white mt-1">{(selectedRecord as ConsultationBooking).address}</p>
                   </div>
                   <div>
                     <label className="text-sm font-medium text-slate-300">Issue Description</label>
                     <p className="text-white mt-1">{(selectedRecord as ConsultationBooking).issueDescription}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-sm font-medium text-slate-300">Scheduled Date</label>
                       <p className="text-white">
                         {(selectedRecord as ConsultationBooking).preferredDate} - {(selectedRecord as ConsultationBooking).preferredTime}
                       </p>
                     </div>
                     <div>
                       <label className="text-sm font-medium text-slate-300">Status</label>
                       <div className="mt-1">{getStatusBadge((selectedRecord as ConsultationBooking).status)}</div>
                     </div>
                   </div>
                   {(selectedRecord as ConsultationBooking).emergencyService && (
                     <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                       <p className="text-red-300 text-sm font-medium">
                         🚨 Emergency service requested - Priority response needed
                       </p>
                     </div>
                   )}
                 </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 