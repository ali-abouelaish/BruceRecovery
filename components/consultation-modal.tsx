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
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, CheckCircle, MapPin, Loader2, Calendar, Clock } from "lucide-react"

interface ConsultationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    issueType: "",
    issueDescription: "",
    preferredDate: "",
    preferredTime: "",
    emergencyService: false,
    onSiteService: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Import database service dynamically to avoid SSR issues
      const { databaseService } = await import("@/lib/database-service")
      
      // Log the data being sent for debugging
      const consultationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        issueType: formData.issueType,
        issueDescription: formData.issueDescription,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        emergencyService: formData.emergencyService,
        onSiteService: formData.onSiteService,
      }
      
      console.log('📤 Sending consultation data:', consultationData)
      
      // Submit the consultation request
      await databaseService.submitConsultation(consultationData)

      setIsLoading(false)
      setIsSubmitted(true)

      // Reset form after 4 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          vehicleMake: "",
          vehicleModel: "",
          vehicleYear: "",
          issueType: "",
          issueDescription: "",
          preferredDate: "",
          preferredTime: "",
          emergencyService: false,
          onSiteService: true,
        })
        onOpenChange(false)
      }, 4000)
    } catch (error) {
      console.error('Error submitting consultation request:', error)
      setIsLoading(false)
      // You could show an error message here
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Consultation Booked! 🎉</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our certified mechanic will contact you within
              <span className="text-green-600 font-semibold"> 1 hour</span> to confirm appointment details.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">
                  📧 Confirmation sent to <span className="text-gray-900">{formData.email}</span>
                </p>
              </div>
              {formData.emergencyService && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">
                    🚨 Emergency service requested - Priority response activated
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border-gray-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-gray-900 text-2xl">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            Book Mechanic Consultation
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-lg">
            Schedule a certified mobile mechanic for on-site diagnostics and repairs
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">
                    👤 Contact Information
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-700 font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        Service Address *
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter the complete address where service is needed (street, city, state, zip)..."
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors resize-none"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">
                    🚗 Vehicle Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake" className="text-gray-700 font-medium">
                        Make *
                      </Label>
                      <Input
                        id="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
                        placeholder="Toyota, Ford..."
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors"
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
                        placeholder="Camry, F-150..."
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors"
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
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">🔧 Issue Details</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issueType" className="text-gray-700 font-medium">
                        Issue Category *
                      </Label>
                      <Select
                        value={formData.issueType}
                        onValueChange={(value) => handleInputChange("issueType", value)}
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-green-500">
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="engine">🔧 Engine Problems</SelectItem>
                          <SelectItem value="brakes">🛑 Brake Issues</SelectItem>
                          <SelectItem value="transmission">⚙️ Transmission</SelectItem>
                          <SelectItem value="electrical">⚡ Electrical Issues</SelectItem>
                          <SelectItem value="suspension">🏎️ Suspension/Steering</SelectItem>
                          <SelectItem value="cooling">❄️ Cooling System</SelectItem>
                          <SelectItem value="diagnostic">🔍 General Diagnostic</SelectItem>
                          <SelectItem value="maintenance">🛠️ Routine Maintenance</SelectItem>
                          <SelectItem value="other">📦 Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issueDescription" className="text-gray-700 font-medium">
                        Describe the Issue *
                      </Label>
                      <Textarea
                        id="issueDescription"
                        value={formData.issueDescription}
                        onChange={(e) => handleInputChange("issueDescription", e.target.value)}
                        placeholder="Please describe the symptoms, when they occur, any sounds, warning lights, and any other relevant details..."
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 transition-colors min-h-[120px] resize-none"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="text-gray-900 font-semibold mb-6 text-lg flex items-center gap-2">
                    📅 Scheduling Preferences
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate" className="text-gray-700 font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-500" />
                          Preferred Date
                        </Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                          className="bg-white border-gray-300 text-gray-900 focus:border-green-500 transition-colors"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime" className="text-gray-700 font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          Preferred Time
                        </Label>
                        <Select
                          value={formData.preferredTime}
                          onValueChange={(value) => handleInputChange("preferredTime", value)}
                        >
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-green-500">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-200">
                            <SelectItem value="morning">🌅 Morning (8AM - 12PM)</SelectItem>
                            <SelectItem value="afternoon">☀️ Afternoon (12PM - 5PM)</SelectItem>
                            <SelectItem value="evening">🌆 Evening (5PM - 8PM)</SelectItem>
                            <SelectItem value="flexible">🕐 Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-300">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="emergencyService"
                          checked={formData.emergencyService}
                          onCheckedChange={(checked) => handleInputChange("emergencyService", checked as boolean)}
                          className="border-gray-400 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                        />
                        <Label
                          htmlFor="emergencyService"
                          className="text-gray-700 font-medium flex items-center gap-2"
                        >
                          🚨 This is an emergency
                          <span className="text-xs text-gray-500">(priority response, additional charges apply)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="onSiteService"
                          checked={formData.onSiteService}
                          onCheckedChange={(checked) => handleInputChange("onSiteService", checked as boolean)}
                          className="border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <Label htmlFor="onSiteService" className="text-gray-700 font-medium flex items-center gap-2">
                          🏠 On-site service preferred
                          <span className="text-xs text-gray-500">(we come to your location)</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-300">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking Consultation...
                </>
              ) : (
                <>
                  Book Consultation
                  <Wrench className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
