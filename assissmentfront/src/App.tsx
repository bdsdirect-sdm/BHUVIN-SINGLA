import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';

import UpdateForm from './components/UpdateForm';
import Profile from './components/Profile';
import Login from './components/Login';
import AgencyDeshboard from './components/AgencyDeshboard';
import SeekerDashBoard from './components/SeekerDashBoard';
import Error from './components/Error';
import { useSelector } from 'react-redux';
import OpenRoute from './components/routeComponent/OpenRoute';

const App: React.FC = () => {

  const { user_type } = useSelector((state: any) => state.user)
  console.log(user_type, "userType from redux")

  // const user_type : string | null = localStorage.getItem("user_type")
  return (
    <div className="App">
      <Routes>
        {/* <Route path='/' element = {<Home/>}/> */}
        <Route path="/" element={<Register />} />
        <Route path='/login' element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        } />


        {
          user_type === "Job_Seeker" && (<Route path="/dashboard" element={<SeekerDashBoard />} />)
        }
        {
          user_type === "Agency" && (<Route path="/dashboard" element={<AgencyDeshboard />} />)
        }
        <Route path='*' element={<Navigate to={"/login"} />} />

      </Routes>
    </div>
  );
}

export default App;
