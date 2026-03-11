import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/auth/Login"
import DashboardSiswa from "../pages/dashboard/DashboardSiswa"
import DataSiswa from "../pages/siswa/DataSiswa"
import SiswaDetail from "../pages/siswa/SiswaDetail"
import { CetakLaporanPage } from "../pages/siswa/CetakLaporanPage"
import LogAktivitas from "../pages/log/LogAktivitas"
import DataKelasPage from "../pages/kelas/DataKelas"
import MataPelajaranPage from "../pages/akademik/MataPelajaran"
import PrestasiPage from "../pages/kesiswaan/PrestasiPage"
import {
    BeasiswaPage,
    EkstrakurikulerPage,
    PKLPage,
    InputNilaiPage,
    InputNilaiEkskulPage,
    InputKetidakhadiranPage,
    KenaikanKelasPage
} from "../pages/kesiswaan/PlaceholderPages"
import ProtectedRoute from "../components/auth/ProtectedRoute"

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardSiswa /></ProtectedRoute>
                } />

                {/* Data Utama */}
                <Route path="/siswa" element={
                    <ProtectedRoute><DataSiswa /></ProtectedRoute>
                } />
                <Route path="/siswa/:id" element={
                    <ProtectedRoute><SiswaDetail /></ProtectedRoute>
                } />
                <Route path="/siswa/:id/cetak" element={
                    <ProtectedRoute><CetakLaporanPage /></ProtectedRoute>
                } />
                <Route path="/data-kelas" element={
                    <ProtectedRoute><DataKelasPage /></ProtectedRoute>
                } />

                {/* Kesiswaan */}
                <Route path="/prestasi" element={
                    <ProtectedRoute><PrestasiPage /></ProtectedRoute>
                } />
                <Route path="/beasiswa" element={
                    <ProtectedRoute><BeasiswaPage /></ProtectedRoute>
                } />
                <Route path="/ekstrakurikuler" element={
                    <ProtectedRoute><EkstrakurikulerPage /></ProtectedRoute>
                } />
                <Route path="/pkl" element={
                    <ProtectedRoute><PKLPage /></ProtectedRoute>
                } />

                {/* Akademik */}
                <Route path="/mata-pelajaran" element={
                    <ProtectedRoute><MataPelajaranPage /></ProtectedRoute>
                } />
                <Route path="/input-nilai" element={
                    <ProtectedRoute><InputNilaiPage /></ProtectedRoute>
                } />
                <Route path="/input-nilai-ekskul" element={
                    <ProtectedRoute><InputNilaiEkskulPage /></ProtectedRoute>
                } />
                <Route path="/input-ketidakhadiran" element={
                    <ProtectedRoute><InputKetidakhadiranPage /></ProtectedRoute>
                } />

                {/* Kenaikan Kelas */}
                <Route path="/kenaikan-kelas" element={
                    <ProtectedRoute><KenaikanKelasPage /></ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/log-aktivitas" element={
                    <ProtectedRoute><LogAktivitas /></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
