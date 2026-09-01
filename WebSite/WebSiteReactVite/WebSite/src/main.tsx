import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { PrivateRoute } from './router/PrivateRoute';

import Home from './pages/HomePage/HomePage';
import Account from './pages/AccountPage/AccountPage';
import Course from './pages/CoursePage/CoursePage';
import Login from './pages/LoginPage/LoginPage';
import RecoverPassword from './pages/RecoverPasswordPage/RecoverPasswordPage';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />s
          <Route path="/login" element={<Login />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/course" element={<PrivateRoute><Course /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  </BrowserRouter>,
)
