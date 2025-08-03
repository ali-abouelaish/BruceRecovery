import { supabase } from './supabase'

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
  created_at: string
  quote_amount?: number
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
  created_at: string
  mechanicAssigned?: string
}

class DatabaseService {
  // Quote Requests
  async submitQuoteRequest(data: Omit<QuoteRequest, 'id' | 'status' | 'created_at'>): Promise<QuoteRequest> {
    // Convert camelCase to snake_case for database columns
    const dbData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      vehicle_year: data.vehicleYear,
      transport_type: data.transportType,
      transport_details: data.transportDetails,
      urgency: data.urgency,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data: newRequest, error } = await supabase
      .from('quote_requests')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      console.error('Error submitting quote request:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to submit quote request: ${error.message}`)
    }

    // Convert back to camelCase for the frontend
    return {
      id: newRequest.id,
      name: newRequest.name,
      email: newRequest.email,
      phone: newRequest.phone,
      vehicleMake: newRequest.vehicle_make,
      vehicleModel: newRequest.vehicle_model,
      vehicleYear: newRequest.vehicle_year,
      transportType: newRequest.transport_type,
      transportDetails: newRequest.transport_details,
      urgency: newRequest.urgency,
      status: newRequest.status,
      created_at: newRequest.created_at,
      quote_amount: newRequest.quote_amount
    }
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching quote requests:', error)
        // Return empty array instead of throwing for better UX
        return []
      }

      // Convert snake_case to camelCase for the frontend
      return (data || []).map(request => ({
        id: request.id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        vehicleMake: request.vehicle_make,
        vehicleModel: request.vehicle_model,
        vehicleYear: request.vehicle_year,
        transportType: request.transport_type,
        transportDetails: request.transport_details,
        urgency: request.urgency,
        status: request.status,
        created_at: request.created_at,
        quote_amount: request.quote_amount
      }))
    } catch (error) {
      console.error('Database connection error:', error)
      return []
    }
  }

  async updateQuoteRequest(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest | null> {
    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating quote request:', error)
      throw new Error('Failed to update quote request')
    }

    return data
  }

  async deleteQuoteRequest(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting quote request:', error)
      throw new Error('Failed to delete quote request')
    }

    return true
  }

  // Consultations
  async submitConsultation(data: Omit<ConsultationBooking, 'id' | 'status' | 'created_at'>): Promise<ConsultationBooking> {
    // Convert camelCase to snake_case for database columns
    const dbData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      vehicle_make: data.vehicleMake,
      vehicle_model: data.vehicleModel,
      vehicle_year: data.vehicleYear,
      issue_type: data.issueType,
      issue_description: data.issueDescription,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      emergency_service: data.emergencyService,
      on_site_service: data.onSiteService,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { data: newConsultation, error } = await supabase
      .from('consultations')
      .insert([dbData])
      .select()
      .single()

    if (error) {
      console.error('Error submitting consultation:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to submit consultation: ${error.message}`)
    }

    // Convert back to camelCase for the frontend
    return {
      id: newConsultation.id,
      name: newConsultation.name,
      email: newConsultation.email,
      phone: newConsultation.phone,
      address: newConsultation.address,
      vehicleMake: newConsultation.vehicle_make,
      vehicleModel: newConsultation.vehicle_model,
      vehicleYear: newConsultation.vehicle_year,
      issueType: newConsultation.issue_type,
      issueDescription: newConsultation.issue_description,
      preferredDate: newConsultation.preferred_date,
      preferredTime: newConsultation.preferred_time,
      emergencyService: newConsultation.emergency_service,
      onSiteService: newConsultation.on_site_service,
      status: newConsultation.status,
      created_at: newConsultation.created_at,
      mechanicAssigned: newConsultation.mechanic_assigned
    }
  }

  async getConsultations(): Promise<ConsultationBooking[]> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching consultations:', error)
        // Return empty array instead of throwing for better UX
        return []
      }

      // Convert snake_case to camelCase for the frontend
      return (data || []).map(consultation => ({
        id: consultation.id,
        name: consultation.name,
        email: consultation.email,
        phone: consultation.phone,
        address: consultation.address,
        vehicleMake: consultation.vehicle_make,
        vehicleModel: consultation.vehicle_model,
        vehicleYear: consultation.vehicle_year,
        issueType: consultation.issue_type,
        issueDescription: consultation.issue_description,
        preferredDate: consultation.preferred_date,
        preferredTime: consultation.preferred_time,
        emergencyService: consultation.emergency_service,
        onSiteService: consultation.on_site_service,
        status: consultation.status,
        created_at: consultation.created_at,
        mechanicAssigned: consultation.mechanic_assigned
      }))
    } catch (error) {
      console.error('Database connection error:', error)
      return []
    }
  }

  async updateConsultation(id: string, updates: Partial<ConsultationBooking>): Promise<ConsultationBooking | null> {
    const { data, error } = await supabase
      .from('consultations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating consultation:', error)
      throw new Error('Failed to update consultation')
    }

    return data
  }

  async deleteConsultation(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting consultation:', error)
      throw new Error('Failed to delete consultation')
    }

    return true
  }

  // Analytics
  async getAnalytics() {
    const [quoteRequests, consultations] = await Promise.all([
      this.getQuoteRequests(),
      this.getConsultations()
    ])

    const totalQuoteRequests = quoteRequests.length
    const totalConsultations = consultations.length
    const pendingQuotes = quoteRequests.filter(q => q.status === 'pending').length
    const pendingConsultations = consultations.filter(c => c.status === 'pending').length
    const emergencyRequests = consultations.filter(c => c.emergencyService).length
    const totalRevenue = quoteRequests
      .filter(q => q.quote_amount && q.status === 'completed')
      .reduce((sum, q) => sum + (q.quote_amount || 0), 0)

    return {
      totalQuoteRequests,
      totalConsultations,
      pendingQuotes,
      pendingConsultations,
      emergencyRequests,
      totalRevenue
    }
  }

  // Initialize with mock data if tables are empty
  async initializeMockData() {
    const [quoteRequests, consultations] = await Promise.all([
      this.getQuoteRequests(),
      this.getConsultations()
    ])

    if (quoteRequests.length === 0) {
      const mockQuoteRequests = [
        {
          name: "John Smith",
          email: "john.smith@email.com",
          phone: "(555) 123-4567",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleYear: "2020",
          transportType: "local",
          transportDetails: "Need transport from downtown to suburban area, vehicle in good condition",
          urgency: "urgent",
          quote_amount: 450
        },
        {
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "(555) 234-5678",
          vehicleMake: "Ford",
          vehicleModel: "F-150",
          vehicleYear: "2019",
          transportType: "long-distance",
          transportDetails: "Long distance transport from city to rural area, truck needs special handling",
          urgency: "normal"
        },
        {
          name: "Mike Wilson",
          email: "mike.w@email.com",
          phone: "(555) 345-6789",
          vehicleMake: "BMW",
          vehicleModel: "X3",
          vehicleYear: "2021",
          transportType: "interstate",
          transportDetails: "Interstate transport for luxury vehicle, requires enclosed transport",
          urgency: "emergency",
          quote_amount: 320
        }
      ]

      for (const request of mockQuoteRequests) {
        await this.submitQuoteRequest(request)
      }
    }

    if (consultations.length === 0) {
      const mockConsultations = [
        {
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
          mechanicAssigned: "Bruce Wayne"
        },
        {
          name: "David Brown",
          email: "david.b@email.com",
          phone: "(555) 567-8901",
          address: "456 Oak Ave, Somewhere, ST 67890",
          vehicleMake: "Chevrolet",
          vehicleModel: "Silverado",
          vehicleYear: "2020",
          issueType: "brakes",
          issueDescription: "Brake pedal feels soft, possible brake fluid leak",
          preferredDate: "2024-01-18",
          preferredTime: "afternoon",
          emergencyService: true,
          onSiteService: true,
          mechanicAssigned: "Tony Stark"
        },
        {
          name: "Lisa Anderson",
          email: "lisa.a@email.com",
          phone: "(555) 678-9012",
          address: "789 Pine Rd, Elsewhere, ST 11111",
          vehicleMake: "Nissan",
          vehicleModel: "Altima",
          vehicleYear: "2019",
          issueType: "transmission",
          issueDescription: "Transmission slipping, won't shift properly",
          preferredDate: "2024-01-22",
          preferredTime: "flexible",
          emergencyService: false,
          onSiteService: false
        }
      ]

      for (const consultation of mockConsultations) {
        await this.submitConsultation(consultation)
      }
    }
  }
}

export const databaseService = new DatabaseService() 