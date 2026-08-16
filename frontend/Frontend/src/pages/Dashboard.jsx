import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AdminOverview from './admin/Overview'
import ManagePositions from './admin/ManagePositions'
import ManageCandidates from './admin/ManageCandidates'
import ManageVoters from './admin/ManageVoters'
import ElectionSettings from './admin/ElectionSettings'
import ResultsAnalytics from './admin/ResultsAnalytics'
import BlockchainLog from './admin/BlockchainLog'
import AdminUsers from './admin/AdminUsers'

export default function Dashboard(){
  return (
    <AdminLayout>
      <Routes>
        <Route path="" element={<AdminOverview/>} />
        <Route path="overview" element={<AdminOverview/>} />
        <Route path="positions" element={<ManagePositions/>} />
        <Route path="candidates" element={<ManageCandidates/>} />
        <Route path="voters" element={<ManageVoters/>} />
        <Route path="settings" element={<ElectionSettings/>} />
        <Route path="results" element={<ResultsAnalytics/>} />
        <Route path="audit" element={<BlockchainLog/>} />
        <Route path="admins" element={<AdminUsers/>} />
      </Routes>
    </AdminLayout>
  )
}
