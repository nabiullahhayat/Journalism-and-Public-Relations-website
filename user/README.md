# Journalism Faculty Website - Frontend

A modern, fully responsive React-based frontend application for the Journalism Faculty Management System.

## 🚀 Features

### Public Website
- **Home Page**: Hero section, statistics, featured news, faculty showcase
- **About**: Faculty information, mission, vision, history
- **Departments**: Browse all departments with search functionality
- **Courses**: Filter courses by department and level
- **Teachers**: Faculty directory with department filtering
- **News**: Latest news with pagination and category filtering
- **Monographs**: Academic publications by year
- **Contact**: Contact form with office information

### Admin Dashboard
- **Dashboard**: Overview with statistics and quick actions
- **News Management**: Full CRUD operations with image upload
- **Role-based Access Control**: SuperAdmin, Admin, Editor, Viewer roles
- **Responsive Sidebar**: Mobile-friendly navigation
- **Real-time Updates**: React Query for data synchronization

## 🛠️ Tech Stack

- **React 19.2.0** - UI framework
- **Vite** - Build tool
- **React Router 7.10.1** - Routing
- **Tailwind CSS 4.1.17** - Styling
- **Axios** - HTTP client
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   
   The `.env` file is already configured:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Responsive Design

The entire application is fully responsive:

- **Mobile** (320px+): Single column layouts, hamburger menu, touch-friendly buttons
- **Tablets** (768px+): Two-column grids, optimized spacing
- **iPads** (1024px+): Three-column layouts, expanded navigation
- **Desktops** (1280px+): Full features, multi-column layouts, permanent sidebar

## 🔐 Default Admin Credentials

```
Username: superadmin
Password: Admin@123456
```

## 📂 Project Structure

```
user/
├── src/
│   ├── Admin/              # Admin pages
│   │   ├── AdminLayout.jsx # Admin dashboard layout
│   │   ├── Dashboard.jsx   # Dashboard home
│   │   ├── Login.jsx       # Admin login
│   │   └── NewsManagement.jsx # News CRUD example
│   ├── Pages/              # Public pages
│   │   ├── HomePage.jsx
│   │   ├── About.jsx
│   │   ├── Departments.jsx
│   │   ├── Courses.jsx
│   │   ├── Teachers.jsx
│   │   ├── News.jsx
│   │   ├── Monographs.jsx
│   │   └── Contact.jsx
│   ├── components/         # Reusable components
│   │   ├── Layout.jsx      # Public layout
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── ui/             # UI components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Table.jsx
│   │       └── ...
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx
│   ├── hooks/              # Custom hooks
│   │   └── useAuth.js
│   ├── services/           # API services
│   │   └── api/
│   │       ├── client.js   # Axios instance
│   │       ├── auth.js
│   │       ├── departments.js
│   │       └── ...
│   ├── store/              # Zustand stores
│   │   └── authStore.js
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 UI Components

All components are production-ready with:
- Multiple variants and sizes
- Loading states
- Error handling
- Full accessibility
- Responsive design

Available components:
- Button (8 variants, 5 sizes)
- Input, Textarea, Select
- Card, Modal, Table
- Spinner, Alert, Badge
- Pagination, EmptyState

## 🔄 API Integration

The app uses Axios with interceptors for:
- Automatic token refresh
- Request/response logging (dev mode)
- Error handling
- Cookie-based authentication

## ✅ Features Implemented

- ✅ Complete routing setup
- ✅ Authentication & authorization
- ✅ Protected routes with role-based access
- ✅ API integration with React Query
- ✅ Global state management
- ✅ Toast notifications
- ✅ Image upload with preview
- ✅ Form validation
- ✅ Search & filtering
- ✅ Pagination
- ✅ Loading & error states
- ✅ Responsive design for all devices
- ✅ Mobile-first approach

## 🧪 Testing

The application has been tested for:
- Build success (no compilation errors)
- Responsive design (mobile, tablet, desktop)
- Authentication flow
- API integration
- Form validation
- File uploads

## 🚧 Future Enhancements

The News Management page serves as a complete template. The same pattern can be used for:
- Admins Management
- Departments Management
- Courses Management
- Teachers Management
- Monographs Management
- About Page Editor
- Contact Info Editor

## 📝 Notes

- All public pages fetch data from the backend API
- Admin pages require authentication
- Images are stored on Cloudinary via backend
- Token refresh happens automatically on 401 errors
- All forms include client-side validation

## 🤝 Contributing

1. Follow the established component patterns
2. Maintain responsive design principles
3. Use the existing UI component library
4. Add proper error handling
5. Include loading states

## 📄 License

This project is part of the Journalism Faculty Management System.

---

**Built with ❤️ using React + Vite + Tailwind CSS**
