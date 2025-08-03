# SupercarBruce Recovery - Vehicle Transport & Roadside Assistance

A modern web application for vehicle transport quotes and roadside assistance services with an admin dashboard for managing requests.

## 🚀 Features

### Customer Features
- **Emergency Roadside Assistance**: Instant help with emergency button
- **Transport Quote Requests**: Get quotes for vehicle transport services
- **Mechanic Consultation Booking**: Schedule on-site or workshop services
- **Responsive Design**: Works on all devices
- **Real-time Status Updates**: Track your requests

### Admin Features
- **Dashboard Analytics**: View total requests, revenue, and statistics
- **Quote Management**: Manage transport quote requests
- **Consultation Management**: Handle mechanic bookings
- **Search & Filter**: Find specific requests quickly
- **Status Updates**: Update request statuses in real-time

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Data Storage**: localStorage (ready for database integration)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recovery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Follow the prompts** and your app will be deployed!

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `out`

### Option 3: Railway

1. **Connect to Railway**
   - Link your GitHub repository
   - Railway will auto-detect Next.js

2. **Deploy**
   - Railway will automatically build and deploy

### Option 4: Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
recovery/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── consultation-modal.tsx # Mechanic booking modal
│   ├── quote-request-modal.tsx # Transport quote modal
│   └── ui/                   # UI components
├── lib/
│   └── data-service.ts       # Data management
├── public/                   # Static assets
└── styles/                   # Additional styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Production Environment

For production deployment, set these environment variables:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` to:

- View all transport quote requests
- Manage mechanic consultation bookings
- Update request statuses
- Search and filter data
- View analytics and revenue

## 🔄 Data Management

Currently using localStorage for data persistence. To integrate with a real database:

1. **Set up a database** (PostgreSQL, MySQL, MongoDB)
2. **Create API routes** in `app/api/`
3. **Update data service** to use API calls
4. **Add authentication** for admin access

## 🎨 Customization

### Colors and Branding

Update the color scheme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3B82F6', // Blue
        600: '#2563EB',
      },
      // Add your brand colors
    }
  }
}
```

### Content Updates

- **Company Name**: Update in `app/page.tsx`
- **Contact Information**: Update phone numbers and addresses
- **Services**: Modify transport types and consultation options

## 🚨 Emergency Features

The emergency button opens WhatsApp with a pre-filled message. Update the phone number in `app/page.tsx`:

```typescript
const whatsappNumber = "YOUR_PHONE_NUMBER"
```

## 📱 Mobile Optimization

The application is fully responsive and optimized for:

- Mobile phones
- Tablets
- Desktop computers
- Touch interfaces

## 🔒 Security

- HTTPS enforced in production
- Security headers configured
- Input validation with Zod
- XSS protection

## 📈 Performance

- Optimized images
- Code splitting
- Lazy loading
- Compression enabled

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   npm run build
   ```

2. **Port Already in Use**
   ```bash
   npm run dev -- -p 3001
   ```

3. **Dependencies Issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using Next.js and Tailwind CSS** 