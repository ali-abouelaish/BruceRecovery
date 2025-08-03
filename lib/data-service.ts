// Data service for managing quote requests and consultation bookings
// This would typically connect to a database, but for now we'll use localStorage

export interface QuoteRequest {
  id: string
  name: string
  email: string
  phone: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  transportType: string
  transportDetails: string
  urgency: string
  status: 'pending' | 'quoted' | 'completed' | 'cancelled'
  createdAt: string
  quoteAmount?: number
}

export interface ConsultationBooking {
  id: string
  name: string
  email: string
  phone: string
  address: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  issueType: string
  issueDescription: string
  preferredDate: string
  preferredTime: string
  emergencyService: boolean
  onSiteService: boolean
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  mechanicAssigned?: string
}

class DataService {
  // Private synchronous localStorage getters/setters renamed with underscore prefix

  private _getQuoteRequests(): QuoteRequest[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('quoteRequests')
    return stored ? JSON.parse(stored) : []
  }

  private _setQuoteRequests(requests: QuoteRequest[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('quoteRequests', JSON.stringify(requests))
  }

  private _getConsultations(): ConsultationBooking[] {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('consultations')
    return stored ? JSON.parse(stored) : []
  }

  private _setConsultations(consultations: ConsultationBooking[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('consultations', JSON.stringify(consultations))
  }

  // Quote Requests

  async submitQuoteRequest(data: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>): Promise<QuoteRequest> {
    const requests = this._getQuoteRequests()
    const newRequest: QuoteRequest = {
      ...data,
      id: `QR${String(requests.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    requests.push(newRequest)
    this._setQuoteRequests(requests)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return newRequest
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    const requests = this._getQuoteRequests()
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    return requests
  }

  async updateQuoteRequest(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest | null> {
    const requests = this._getQuoteRequests()
    const index = requests.findIndex(r => r.id === id)
    
    if (index === -1) return null
    
    requests[index] = { ...requests[index], ...updates }
    this._setQuoteRequests(requests)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return requests[index]
  }

  async deleteQuoteRequest(id: string): Promise<boolean> {
    const requests = this._getQuoteRequests()
    const filtered = requests.filter(r => r.id !== id)
    
    if (filtered.length === requests.length) return false
    
    this._setQuoteRequests(filtered)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
  }

  // Consultations

  async submitConsultation(data: Omit<ConsultationBooking, 'id' | 'status' | 'createdAt'>): Promise<ConsultationBooking> {
    const consultations = this._getConsultations()
    const newConsultation: ConsultationBooking = {
      ...data,
      id: `CB${String(consultations.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    
    consultations.push(newConsultation)
    this._setConsultations(consultations)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return newConsultation
  }

  async getConsultations(): Promise<ConsultationBooking[]> {
    const consultations = this._getConsultations()
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    return consultations
  }

  async updateConsultation(id: string, updates: Partial<ConsultationBooking>): Promise<ConsultationBooking | null> {
    const consultations = this._getConsultations()
    const index = consultations.findIndex(c => c.id === id)
    
    if (index === -1) return null
    
    consultations[index] = { ...consultations[index], ...updates }
    this._setConsultations(consultations)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return consultations[index]
  }

  async deleteConsultation(id: string): Promise<boolean> {
    const consultations = this._getConsultations()
    const filtered = consultations.filter(c => c.id !== id)
    
    if (filtered.length === consultations.length) return false
    
    this._setConsultations(filtered)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return true
  }

  // Analytics

  async getAnalytics() {
    const quoteRequests = this._getQuoteRequests()
    const consultations = this._getConsultations()
    
    const totalQuoteRequests = quoteRequests.length
    const totalConsultations = consultations.length
    const pendingQuotes = quoteRequests.filter(q => q.status === 'pending').length
    const pendingConsultations = consultations.filter(c => c.status === 'pending').length
    const emergencyRequests = consultations.filter(c => c.emergencyService).length
    const totalRevenue = quoteRequests
      .filter(q => q.quoteAmount && q.status === 'completed')
      .reduce((sum, q) => sum + (q.quoteAmount || 0), 0)
    
    return {
      totalQuoteRequests,
      totalConsultations,
      pendingQuotes,
      pendingConsultations,
      emergencyRequests,
      totalRevenue
    }
  }

  // Initialize with mock data if empty

  initializeMockData() {
    if (typeof window === 'undefined') return
    
    const quoteRequests = this._getQuoteRequests()
    const consultations = this._getConsultations()
    
    if (quoteRequests.length === 0) {
      const mockQuoteRequests: QuoteRequest[] = [
        {
          id: "QR001",
          name: "John Smith",
          email: "john.smith@email.com",
          phone: "(555) 123-4567",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleYear: "2020",
          transportType: "local",
          transportDetails: "Need transport from downtown to suburban area, vehicle in good condition",
          urgency: "urgent",
          status: "quoted",
          createdAt: "2024-01-15T10:30:00Z",
          quoteAmount: 450
        },
        {
          id: "QR002",
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "(555) 234-5678",
          vehicleMake: "Ford",
          vehicleModel: "F-150",
          vehicleYear: "2019",
          transportType: "long-distance",
          transportDetails: "Long distance transport from city to rural area, truck needs special handling",
          urgency: "normal",
          status: "pending",
          createdAt: "2024-01-16T14:20:00Z"
        },
        {
          id: "QR003",
          name: "Mike Wilson",
          email: "mike.w@email.com",
          phone: "(555) 345-6789",
          vehicleMake: "BMW",
          vehicleModel: "X3",
          vehicleYear: "2021",
          transportType: "interstate",
          transportDetails: "Interstate transport for luxury vehicle, requires enclosed transport",
          urgency: "emergency",
          status: "completed",
          createdAt: "2024-01-14T09:15:00Z",
          quoteAmount: 320
        }
      ]
      this._setQuoteRequests(mockQuoteRequests)
    }
    
    if (consultations.length === 0) {
      const mockConsultations: ConsultationBooking[] = [
        {
          id: "CB001",
          name: "Emily Davis",
          email: "emily.d@email.com",
          phone: "(555) 456-7890",
          address: "123 Main St, Anytown, ST 12345",
          vehicleMake: "Honda",
          vehicleModel: "Civic",
          vehicleYear: "2018",
          issueType: "engine",
          issueDescription: "Engine making strange knocking sound, check engine light on",
          preferredDate: "2024-01-20",
          preferredTime: "morning",
          emergencyService: false,
          onSiteService: true,
          status: "confirmed",
          createdAt: "2024-01-15T11:45:00Z",
          mechanicAssigned: "Tom"
        },
        {
          id: "CB002",
          name: "David Lee",
          email: "david.l@email.com",
          phone: "(555) 567-8901",
          address: "456 Oak St, Othertown, ST 23456",
          vehicleMake: "Chevrolet",
          vehicleModel: "Silverado",
          vehicleYear: "2017",
          issueType: "transmission",
          issueDescription: "Transmission slipping during gear changes",
          preferredDate: "2024-01-22",
          preferredTime: "afternoon",
          emergencyService: true,
          onSiteService: false,
          status: "pending",
          createdAt: "2024-01-16T13:30:00Z"
        },
        {
          id: "CB003",
          name: "Linda Martinez",
          email: "linda.m@email.com",
          phone: "(555) 678-9012",
          address: "789 Pine St, Elsewhere, ST 34567",
          vehicleMake: "Tesla",
          vehicleModel: "Model 3",
          vehicleYear: "2022",
          issueType: "electrical",
          issueDescription: "Battery drain and electrical system faults",
          preferredDate: "2024-01-18",
          preferredTime: "evening",
          emergencyService: false,
          onSiteService: true,
          status: "completed",
          createdAt: "2024-01-14T10:00:00Z",
          mechanicAssigned: "Alice"
        }
      ]
      this._setConsultations(mockConsultations)
    }
  }
}

export default new DataService()
