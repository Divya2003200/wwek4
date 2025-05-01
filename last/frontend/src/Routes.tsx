
// // src/AppRoutes.tsximport React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import RoleProtectedRoute from './routes/protectedRoutes'; // Assuming the path is correct
// import ClientDashboard from './pages/clientDashboard'; // Client dashboard page
// import ProjectList from './components/ProjectList'; // List of projects
// import CreateProject from './components/createProject'; // Create new project page
// import ProjectDetails from './components/projectDetails'; // View project details page

// import Login from './components/Login'; // Login page
// import Profile from './pages/Profile';
// import FreelancerDashboard from './pages/FreelancerDashboard';
// import Register from './components/Register';

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<Login />} />
//       <Route path="/register" element={<Register />} />
      
//       {/* Protected Routes - accessible only if logged in and has valid role */}
//       <Route
//         path="/dashboard/*"
//         element={
//           <RoleProtectedRoute role="client">
//             <ClientDashboard />
//           </RoleProtectedRoute>
//         }
//       >
//         <Route path="" element={<ProjectList />} />
//         <Route path="create-project" element={<CreateProject />} />
//         <Route path="projects/:id" element={<ProjectDetails />} />
//         <Route path='profile' element={<Profile/>}/>
        
//       </Route>




//       <Route
//   path="/freelancer-dashboard/*"
//   element={
//     <RoleProtectedRoute role="freelancer">
//       <FreelancerDashboard />
//     </RoleProtectedRoute>
//   }
// >
//   <Route path="projects" element={<ProjectList />} />
//   <Route path="projects/:id" element={<ProjectDetails />} />
//   {/* Add other nested routes if needed */}
// </Route>

//       {/* Add more protected routes as necessary */}
//     </Routes>
//   );
// };

// export default AppRoutes; 

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoleProtectedRoute from './routes/protectedRoutes';

import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './pages/clientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ProjectList from './components/ProjectList';
import CreateProject from './components/createProject';

import Profile from './pages/Profile';





 const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} /> {/* Explicit login route */}
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - accessible only if logged in and has valid role */}
      <Route
        path="/dashboard/*"
        element={
          <RoleProtectedRoute role="client">
            <ClientDashboard />
          </RoleProtectedRoute>
        }
      >
        <Route path="" element={<ProjectList />} />
        <Route path="create-project" element={<CreateProject />} />
        {/* <Route path="projects/:id" element={<ProjectDetails />} /> */}
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="/freelancer-dashboard/*"
        element={
          <RoleProtectedRoute role="freelancer">
            <FreelancerDashboard />
          </RoleProtectedRoute>
        }
      >
        <Route path="projects" element={<ProjectList />} />
        {/* <Route path="projects/:id" element={<ProjectDetails />} /> */}
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login if the route is not found */}
    </Routes>
  );
};
export default AppRoutes;