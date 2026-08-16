import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Candidates from './pages/Candidates'
import Verify from './pages/Vote/Verify'
import Ballot from './pages/Vote/Ballot'
import Receipt from './pages/Vote/Receipt'
import Dashboard from './pages/Dashboard'
import RequireAdmin from './components/RequireAdmin'
import RequireVoter from './components/RequireVoter'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyAccount from './pages/VerifyAccount'
import Logout from './pages/Logout'
import SessionExpired from './pages/SessionExpired'
import Unauthorized from './pages/Unauthorized'
import VoterLayout from './layouts/VoterLayout'


function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<VoterLayout><Home /></VoterLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/forgot" element={<ForgotPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route path="/auth/verify" element={<VerifyAccount />} />
          <Route path="/auth/logout" element={<Logout />} />
          <Route path="/auth/session-expired" element={<SessionExpired />} />
          <Route path="/auth/unauthorized" element={<Unauthorized />} />

          <Route path="/positions" element={<VoterLayout><Candidates/></VoterLayout>} />
          <Route path="/vote/verify" element={<VoterLayout><Verify /></VoterLayout>} />
          <Route path="/vote/ballot" element={<RequireVoter><VoterLayout><Ballot /></VoterLayout></RequireVoter>} />
          <Route path="/vote/receipt" element={<RequireVoter><VoterLayout><Receipt /></VoterLayout></RequireVoter>} />

          <Route path="/dashboard/*" element={<RequireAdmin><Dashboard/></RequireAdmin>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
