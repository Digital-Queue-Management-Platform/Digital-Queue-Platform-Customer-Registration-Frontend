# Digital Queue Management Platform - Frontend

A modern, responsive web application for digital queue management built with React, TypeScript, and Tailwind CSS.


## Features

- **Customer Registration**: Easy-to-use registration form with real-time validation
- **Queue Status Board**: Live queue monitoring and status updates
- **Analytics Dashboard**: Comprehensive analytics with charts and performance metrics
- **Responsive Design**: Works seamlessly across all device sizes
- **Real-time Updates**: Live queue status and wait time information
- **Professional UI**: Clean, modern interface with intuitive navigation

## Live Demo

**Frontend**: [https://digital-queue-platform-customer-reg.vercel.app](https://digital-queue-platform-customer-reg.vercel.app)

**Backend API**: [https://digital-queue-platform-customer.onrender.com](https://digital-queue-platform-customer.onrender.com)

## Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.8
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel

## Pages & Features

### 1. Customer Registration (`/`)
- Customer information form with validation
- Service type selection with estimated wait times
- Real-time form validation
- Token generation and QR code display

### 2. Queue Status Board (`/queue-board`)
- Live queue monitoring
- Currently serving display
- Next in line information
- Real-time status updates

### 3. Analytics Dashboard (`/analytics`)
- Performance metrics and KPIs
- Wait time trends and charts
- Officer performance tracking
- Service type breakdowns

## Project Structure

```
frontend/
├── public/
│   ├── Logo.jpg                 # Application logo
│   ├── favicon.svg              # Favicon
│   └── _redirects              # Vercel routing configuration
├── src/
│   ├── components/
│   │   ├── analytics/          # Analytics dashboard components
│   │   ├── common/             # Shared components
│   │   ├── layout/             # Layout and navigation
│   │   ├── queue/              # Queue-related components
│   │   ├── registration/       # Registration form components
│   │   └── ui/                 # Reusable UI components
│   ├── context/
│   │   └── QueueContext.tsx    # Global state management
│   ├── pages/
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── QueueStatusBoard.tsx
│   │   └── RegistrationPage.tsx
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── api.ts              # API client configuration
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── vercel.json                 # Vercel deployment configuration
└── package.json                # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Digital-Queue-Management-Platform/Digital-Queue-Platform-Customer-Registration-Frontend.git
   cd Digital-Queue-Platform-Customer-Registration-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_BASE_URL=https://digital-queue-platform-customer.onrender.com/api
   VITE_WEBSOCKET_URL=wss://digital-queue-platform-customer.onrender.com
   VITE_OUTLET_ID=outlet-001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_WEBSOCKET_URL` | WebSocket connection URL | `ws://localhost:5000` |
| `VITE_OUTLET_ID` | Default outlet identifier | `outlet-001` |

### API Endpoints

The frontend communicates with the following API endpoints:

- `GET /api/services/types` - Get available service types
- `POST /api/customer/register` - Register new customer
- `GET /api/queue/status/:tokenId` - Get queue status
- `GET /api/analytics/*` - Analytics data endpoints

## UI Components

### Layout Components
- **ResponsiveSidebar**: Collapsible navigation sidebar
- **TopHeader**: Application header with title and breadcrumbs
- **Layout**: Main layout wrapper component

### Form Components
- **Input**: Styled input field with validation
- **Select**: Custom dropdown component
- **Button**: Reusable button with loading states

### Data Visualization
- **StatCard**: Metric display cards
- **WaitTimeChart**: Line chart for wait time trends
- **OfficerPerformanceChart**: Bar chart for performance metrics
- **ServiceTypeBreakdown**: Pie chart for service distribution

## Routing

The application uses React Router for client-side routing:

- `/` - Customer Registration (default)
- `/queue-board` - Queue Status Board
- `/analytics` - Analytics Dashboard

## Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

### Key Responsive Features
- Collapsible sidebar navigation
- Adaptive grid layouts
- Touch-friendly interfaces
- Optimized font sizes and spacing

## Deployment

### Vercel Deployment (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

### Manual Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Related Repositories

- **Backend API**: [Digital-Queue-Platform-Customer-Registration-Backend](https://github.com/Digital-Queue-Management-Platform/Digital-Queue-Platform-Customer-Registration-Backend)

## API Documentation

For detailed API documentation, please refer to the backend repository or visit the API health endpoint:
[https://digital-queue-platform-customer.onrender.com/api/health](https://digital-queue-platform-customer.onrender.com/api/health)

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` in environment variables
   - Check backend server status

2. **Routing Issues on Deployed Site**
   - Ensure `vercel.json` is properly configured
   - Check Vercel deployment logs

3. **Build Failures**
   - Clear `node_modules` and reinstall dependencies
   - Check for TypeScript errors

## Performance

The application is optimized for performance with:

- Code splitting with React Router
- Lazy loading of components
- Optimized bundle sizes with Vite
- Efficient state management with React Context

## Version History

- **v1.0.0** - Initial release with core functionality
- Professional responsive design implementation
- React Router integration
- Production deployment optimization

## 🔗 Links

- **Live Application**: [https://digital-queue-platform-customer-reg.vercel.app](https://digital-queue-platform-customer-reg.vercel.app)
- **Backend Repository**: [Digital-Queue-Platform-Customer-Registration-Backend](https://github.com/Digital-Queue-Management-Platform/Digital-Queue-Platform-Customer-Registration-Backend)
- **Organization**: [Digital-Queue-Management-Platform](https://github.com/Digital-Queue-Management-Platform)
