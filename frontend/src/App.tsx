import { Route, Routes } from "react-router-dom"

import { RequireAuth } from "@/components/require-auth"
import HomePage from "@/pages/Home"
import LoginPage from "@/pages/Login"
import AdminPage from "@/pages/Admin"
import NotFoundPage from "@/pages/NotFound"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
