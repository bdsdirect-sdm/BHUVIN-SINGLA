import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AddPatient from './components/AddPatient';
import DoctorList from './components/DoctorList';
import StaffList from './components/StaffList';
import AddStaff from './components/AddStaff';
import Signup from './components/Signup';
import Header from './components/Header';
import Verify from './components/Verify';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile.tsx'; // Add the new EditProfile route
import ChangePassword from './components/ChangePassword'; // Add ChangePassword
import Chat from './components/Chat.tsx';
import './App.css';
import AddAddress from './components/AddAddress.tsx';
import Appointment from './components/Appointment.tsx';
import AddAppointment from './components/AddAppointment.tsx';

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Signup />
    },
    {
      path: '/add-appointment',
      element: <AddAppointment />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/verify',
      element: <Verify />
    },
    {
      path: '/',
      element: <Header />,
      children: [
        {
          path: '/dashboard',
          element: <Dashboard />
        },
        {
          path: '/patient',
          element: <PatientList />
        },
        {
          path: '/add-patient',
          element: <AddPatient />
        },
        {
          path: '/doctor',
          element: <DoctorList />
        },
        {
          path: '/staff',
          element: <StaffList />
        },
        {
          path: '/add-staff',
          element: <AddStaff />
        },
        {
          path: '/add-address',
          element: <AddAddress />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/edit-profile',
          element: <EditProfile />
        },
        {
          path: '/add-appointment',
          element: <Appointment />
        },
        {
          path: '/appointment',
          element: <Appointment />
        },
        {
          path: '/chat',
          element: <Chat />
        },
        {
          path: '/change-password',
          element: <ChangePassword />
        }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer newestOnTop={false} closeOnClick />
    </>
  );
}

export default App;
