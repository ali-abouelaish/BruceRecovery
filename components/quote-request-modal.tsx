"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, CheckCircle, Loader2, Sparkles, Car } from "lucide-react"

interface QuoteRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function QuoteRequestModal({ open, onOpenChange }: QuoteRequestModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    transportType: "",
    transportDetails: "",
    urgency: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Import database service dynamically to avoid SSR issues
      const { databaseService } = await import("@/lib/database-service")
      
      // Log the data being sent for debugging
      const quoteData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        transportType: formData.transportType,
        transportDetails: formData.transportDetails,
        urgency: formData.urgency,
      }
      
      console.log('📤 Sending quote request data:', quoteData)
      
      // Submit the quote request
      await databaseService.submitQuoteRequest(quoteData)

      setIsLoading(false)
      setIsSubmitted(true)

      // Reset form after 4 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: "",
          transportType: "",
          transportDetails: "",
          urgency: "",
        })
        onOpenChange(false)
      }, 4000)
    } catch (error) {
      console.error('Error submitting quote request:', error)
      setIsLoading(false)
      // You could show an error message here
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 shadow-xl">
          <div className="text-center py-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Transport Quote Request Sent! ✨</h3>
            <p className="text-gray-600 leading-relaxed">
              Our transport specialists will review your request and send you a detailed quote within
              <span className="text-green-600 font-semibold"> 2 hours</span>.
            </p>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">
                📧 Confirmation sent to <span className="text-gray-900">{formData.email}</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-white border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-gray-900 text-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            Request Transport Quote
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Get competitive pricing for vehicle transport services with professional handling
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">👤 Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">🚗 Vehicle Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake" className="text-gray-700 font-medium">
                    Make *
                  </Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
                    placeholder="Toyota, Ford, BMW..."
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel" className="text-gray-700 font-medium">
                    Model *
                  </Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                    placeholder="Camry, F-150, X3..."
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear" className="text-gray-700 font-medium">
                    Year *
                  </Label>
                  <Input
                    id="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
                    placeholder="2020"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">🚛 Transport Information</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="transportType" className="text-gray-700 font-medium">
                    Transport Type *
                  </Label>
                  <Select value={formData.transportType} onValueChange={(value) => handleInputChange("transportType", value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                      <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="local">🚗 Local Transport</SelectItem>
                      <SelectItem value="long-distance">🛣️ Long Distance</SelectItem>
                      <SelectItem value="interstate">🌉 Interstate</SelectItem>
                      <SelectItem value="international">✈️ International</SelectItem>
                      <SelectItem value="specialized">🚛 Specialized Transport</SelectItem>
                      <SelectItem value="emergency">🚨 Emergency Transport</SelectItem>
                      <SelectItem value="other">📦 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportDetails" className="text-gray-700 font-medium">
                    Transport Details *
                  </Label>
                  <Textarea
                    id="transportDetails"
                    value={formData.transportDetails}
                    onChange={(e) => handleInputChange("transportDetails", e.target.value)}
                    placeholder="Please describe your transport needs, including pickup and delivery locations, vehicle condition, special requirements, and any specific handling instructions..."
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 transition-colors min-h-[120px] resize-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency" className="text-gray-700 font-medium">
                    Urgency Level *
                  </Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500">
                      <SelectValue placeholder="How urgent is this request?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="emergency">🚨 Emergency (Same Day)</SelectItem>
                      <SelectItem value="urgent">⚡ Urgent (1-2 Days)</SelectItem>
                      <SelectItem value="normal">📅 Normal (3-5 Days)</SelectItem>
                      <SelectItem value="flexible">🕐 Flexible (1-2 Weeks)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Quote Request
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
