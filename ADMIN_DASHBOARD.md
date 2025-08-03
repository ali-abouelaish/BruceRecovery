# Admin Dashboard

The admin dashboard provides comprehensive management capabilities for the roadside recovery business, allowing administrators to view and manage quote requests and consultation bookings.

## Features

### 📊 Analytics Overview
- **Total Quote Requests**: Track all parts quote requests
- **Total Consultations**: Monitor mechanic consultation bookings
- **Emergency Requests**: Highlight priority emergency service requests
- **Total Revenue**: Calculate revenue from completed quotes

### 🔍 Quote Requests Management
- View all customer quote requests for vehicle parts
- Search and filter by customer name, email, or vehicle
- Filter by status (Pending, Quoted, Completed, Cancelled)
- Update request status directly from the dashboard
- View detailed information including:
  - Customer contact details
  - Vehicle information
  - Part type and description
  - Urgency level
  - Quote amount (if provided)

### 🛠️ Consultation Bookings Management
- Manage mechanic consultation appointments
- Search and filter by customer or vehicle information
- Filter by status (Pending, Confirmed, In Progress, Completed, Cancelled)
- Update booking status with dropdown selectors
- View comprehensive details including:
  - Customer contact and address
  - Vehicle information
  - Issue type and description
  - Service preferences (on-site vs workshop)
  - Emergency service indicators
  - Scheduled date and time

### 📋 Data Management
- **Real-time Updates**: Status changes are immediately reflected
- **Data Persistence**: All data is stored in localStorage (can be easily replaced with database)
- **Mock Data**: Pre-populated with sample data for demonstration
- **Export Functionality**: Ready for CSV/Excel export implementation

## Access

The admin dashboard can be accessed via:
- **URL**: `/admin`
- **Navigation**: Click "Admin Dashboard" button in the top navigation bar

## Data Flow

1. **Customer Submissions**: When customers submit quote requests or consultation bookings through the main forms, the data is stored using the data service
2. **Admin View**: Administrators can view all submissions in the dashboard
3. **Status Management**: Admins can update the status of requests/bookings
4. **Real-time Updates**: Changes are immediately saved and reflected in the interface

## Technical Implementation

### Data Service (`lib/data-service.ts`)
- Handles all data operations (CRUD)
- Uses localStorage for data persistence
- Provides mock data initialization
- Simulates API delays for realistic experience

### Admin Dashboard (`app/admin/page.tsx`)
- React component with TypeScript
- Responsive design with Tailwind CSS
- Tabbed interface for different data types
- Search and filter functionality
- Modal dialogs for detailed views

### Integration
- Quote request modal (`components/quote-request-modal.tsx`)
- Consultation modal (`components/consultation-modal.tsx`)
- Both forms now submit data to the data service

## Future Enhancements

- **Database Integration**: Replace localStorage with real database
- **User Authentication**: Add login system for admin access
- **Email Notifications**: Send status updates to customers
- **Advanced Analytics**: Charts and reporting features
- **Bulk Operations**: Select multiple records for batch updates
- **Export Features**: Download data as CSV/Excel
- **Real-time Updates**: WebSocket integration for live updates

## Usage Instructions

1. **View Data**: Navigate to `/admin` to see all submissions
2. **Search**: Use the search bar to find specific customers or vehicles
3. **Filter**: Use status filters to view specific types of requests
4. **Update Status**: Use the dropdown in the Actions column to change status
5. **View Details**: Click the eye icon to see complete information
6. **Refresh**: Use the refresh button to reload data

The dashboard provides a complete administrative interface for managing the roadside recovery business operations efficiently. 