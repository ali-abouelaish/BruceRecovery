# Database Setup Guide

This guide will help you connect your roadside recovery application to a live database using Supabase.

## Option 1: Supabase (Recommended)

### Step 1: Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Your Project Credentials
1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Set Up Database Tables
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database-schema.sql`
3. Run the SQL to create your tables

### Step 4: Test the Connection
1. Restart your development server: `npm run dev`
2. Try submitting a quote request or consultation
3. Check your Supabase dashboard to see the data

## Option 2: PostgreSQL with Prisma

### Step 1: Install Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### Step 2: Configure Database
1. Update `prisma/schema.prisma` with your database URL
2. Create the schema based on the interfaces in `lib/database-service.ts`

### Step 3: Generate and Run Migrations
```bash
npx prisma generate
npx prisma db push
```

## Option 3: MongoDB with Mongoose

### Step 1: Install Dependencies
```bash
npm install mongoose
```

### Step 2: Create Models
Create `lib/models/QuoteRequest.ts` and `lib/models/Consultation.ts` with Mongoose schemas

### Step 3: Update Database Service
Modify `lib/database-service.ts` to use Mongoose instead of Supabase

## Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase (Option 1)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostgreSQL (Option 2)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# MongoDB (Option 3)
MONGODB_URI="mongodb://localhost:27017/roadside_recovery"
```

## Security Considerations

### For Production:
1. **Row Level Security (RLS)**: Already configured in the schema
2. **API Keys**: Use service role keys for admin operations
3. **Environment Variables**: Never commit `.env.local` to version control
4. **CORS**: Configure allowed origins in Supabase dashboard

### Admin Authentication:
- The current admin login is client-side only
- For production, implement server-side authentication
- Consider using Supabase Auth or NextAuth.js

## Database Schema

### Quote Requests Table
- `id`: UUID primary key
- `name`: Customer name
- `email`: Customer email
- `phone`: Customer phone
- `vehicle_make`: Vehicle manufacturer
- `vehicle_model`: Vehicle model
- `vehicle_year`: Vehicle year
- `transport_type`: Type of transport needed
- `transport_details`: Detailed description
- `urgency`: Normal, urgent, or emergency
- `status`: Pending, quoted, completed, or cancelled
- `quote_amount`: Optional quote amount
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Consultations Table
- `id`: UUID primary key
- `name`: Customer name
- `email`: Customer email
- `phone`: Customer phone
- `address`: Service address
- `vehicle_make`: Vehicle manufacturer
- `vehicle_model`: Vehicle model
- `vehicle_year`: Vehicle year
- `issue_type`: Type of issue
- `issue_description`: Detailed description
- `preferred_date`: Preferred service date
- `preferred_time`: Preferred service time
- `emergency_service`: Boolean flag
- `on_site_service`: Boolean flag
- `status`: Pending, confirmed, in-progress, completed, or cancelled
- `mechanic_assigned`: Assigned mechanic name
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Restart your development server after adding `.env.local`
   - Ensure variable names start with `NEXT_PUBLIC_` for client-side access

2. **Database Connection Errors**
   - Check your database URL and credentials
   - Ensure your database is running and accessible
   - Check firewall settings if using a remote database

3. **CORS Errors**
   - Configure allowed origins in your database provider
   - For Supabase, go to Settings > API > CORS

4. **Authentication Issues**
   - Verify your API keys are correct
   - Check Row Level Security policies
   - Ensure proper permissions are set

### Testing the Connection:

```javascript
// Test in browser console
import { supabase } from '@/lib/supabase'

// Test connection
const { data, error } = await supabase
  .from('quote_requests')
  .select('*')
  .limit(1)

console.log('Connection test:', { data, error })
```

## Migration from Local Storage

The application now uses a live database instead of localStorage. All existing data will be automatically migrated when you first run the application with the new database service.

## Performance Optimization

1. **Indexes**: Already created for common query fields
2. **Pagination**: Implement for large datasets
3. **Caching**: Consider Redis for frequently accessed data
4. **Connection Pooling**: Configure for high-traffic applications

## Backup Strategy

1. **Regular Backups**: Set up automated database backups
2. **Point-in-Time Recovery**: Enable if supported by your database
3. **Data Export**: Regular exports to JSON/CSV for additional safety

## Monitoring

1. **Database Performance**: Monitor query performance
2. **Error Logging**: Set up error tracking
3. **Usage Analytics**: Track database usage patterns
4. **Alerting**: Set up alerts for critical issues 