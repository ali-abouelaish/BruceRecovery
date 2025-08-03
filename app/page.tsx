"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  MessageCircle,
  Wrench,
  ShoppingCart,
  Clock,
  Car,
} from "lucide-react"
import QuoteRequestModal from "@/components/quote-request-modal"
import ConsultationModal from "@/components/consultation-modal"

export default function RoadsideRecoveryLanding() {
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEmergencyCall = () => {
    const whatsappNumber = "1234567890"
    const message = "🚨 EMERGENCY: I need immediate roadside assistance!"
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 p-3 rounded-2xl">
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SupercarBruce Recovery</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Live</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 container mx-auto px-6 py-8 lg:py-12">
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3 mb-6 lg:mb-8">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700 font-medium">12min response</span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight">
            <span className="text-gray-900">Emergency</span>
            <br />
            <span className="text-blue-600">Roadside</span>
          </h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {/* Book Mechanic (left on desktop, 2nd on mobile) */}
          <Card
            className="order-2 lg:order-none lg:col-start-1 group bg-white border border-gray-200 hover:border-green-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
            onClick={() => setShowConsultationModal(true)}
          >
            <CardContent className="p-8 lg:p-12 text-center flex flex-col items-center gap-4 lg:gap-6">
              <div className="h-8 lg:h-10" />
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl w-24 h-24 mx-auto mb-6 lg:mb-8 shadow-lg">
                <Wrench className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Book Mechanic</h3>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base lg:text-lg py-6 rounded-2xl h-16 shadow-lg hover:shadow-xl transition-all duration-300">
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Emergency (1st on mobile, center on desktop) */}
          <Card
            className="order-1 lg:order-none lg:col-start-2 group bg-white border border-gray-200 hover:border-red-500 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
            onClick={handleEmergencyCall}
          >
            <CardContent className="p-8 lg:p-12 text-center flex flex-col items-center gap-4 lg:gap-6">
              <div>
                <div className="mb-6 lg:mb-8">
                  <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-4 py-3 text-sm lg:text-base shadow-lg">🚨 EMERGENCY</Badge>
                </div>
                <div className="h-8 lg:h-10" />
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 lg:p-8 rounded-3xl w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-6 lg:mb-8 shadow-xl">
                  <MessageCircle className="h-14 w-14 lg:h-16 lg:w-16 text-white" />
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8">Need Help?</h3>
              </div>
              <div className="w-full">
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg lg:text-xl py-8 lg:py-8 rounded-2xl h-20 lg:h-16 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Phone className="mr-3 h-6 w-6 lg:h-7 lg:w-7" />
                  <span className="text-base lg:text-xl">Get Instant Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transport Quote (3rd on mobile, right on desktop) */}
          <Card
            className="order-3 lg:order-none lg:col-start-3 group bg-white border border-gray-200 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
            onClick={() => setShowQuoteModal(true)}
          >
            <CardContent className="p-8 lg:p-12 text-center flex flex-col items-center gap-4 lg:gap-6">
              <div className="h-8 lg:h-10" />
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl w-24 h-24 mx-auto mb-6 lg:mb-8 shadow-lg">
                <Car className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Transport Quote</h3>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-base lg:text-lg py-6 rounded-2xl h-16 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Vehicles</div>
          </div>
          <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">12min</div>
            <div className="text-gray-600">Response</div>
          </div>
          <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-2">4.9★</div>
            <div className="text-gray-600">Rating</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-50 border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 p-3 rounded-2xl mr-4">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-gray-900 font-semibold text-xl">SupercarBruce Recovery</span>
          </div>
          <p className="text-gray-600">© 2024 Licensed & Insured</p>
        </div>
      </footer>

      {/* Modals */}
      <QuoteRequestModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
      <ConsultationModal open={showConsultationModal} onOpenChange={setShowConsultationModal} />
    </div>
  )
}
