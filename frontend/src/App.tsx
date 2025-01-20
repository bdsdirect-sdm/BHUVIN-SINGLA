// import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Sidebar1 from './components/Sidebar1';
import Signup from './components/Signup';
import Login from './components/Login';
import Sidebar2 from './components/Sidebar2';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Preferences from './components/Preferences';
import CreateWave from './components/CreateWave';
import Friends from './components/Friends';
import ChangePassword from './components/ChangePassword';
import InviteFriend from './components/InviteFriend';

const App:React.FC = () => {

  const router = createBrowserRouter([
    {
      path:'/',
      element: <Sidebar1 />,
      children: [
        {
          path: '/',
          element: <Signup />
        },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/:url',
          element: <Signup />
        },
        {
          path: '/login/:url',
          element: <Login />
        }
      ]
    },
    {
      path: '/app',
      element: <Sidebar2 />,
      children:[
        {
          path: '/app/dashboard',
          element: <Dashboard />
        },
        {
          path: '/app/profile',
          element: <Profile />
        },
        {
          path: '/app/preferences',
          element: <Preferences />
        },
        {
          path: '/app/create-waves',
          element: <CreateWave />
        },
        {
          path: '/app/friends',
          element: <Friends />
        },
        {
          path: '/app/change-password',
          element: <ChangePassword />
        },
        {
          path: '/app/invite-friends',
          element: <InviteFriend />
        }
      ]
    }
  ])

  return (
    <>
    <RouterProvider router={router} />
    <ToastContainer newestOnTop={false} closeOnClick />
    </>
  )
}

export default App
