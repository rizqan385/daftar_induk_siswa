import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DashboardSiswa from "../pages/dashboard/DashboardSiswa"
import DataSiswa from "../pages/siswa/DataSiswa"
import SiswaDetail from "../pages/siswa/SiswaDetail"

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect absolute root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                <Route path="/dashboard" element={<DashboardSiswa />} />
                <Route path="/siswa" element={<DataSiswa />} />
                <Route path="/siswa/:id" element={<SiswaDetail />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
