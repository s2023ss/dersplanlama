import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import OzelDersPlanForm from './components/Plans/OzelDersPlanForm';
import OzelDersPlanList from './components/Plans/OzelDersPlanList';
import CreateOzelDersPlan from './components/Plans/CreateOzelDersPlan';
import AiDestekliPlan from './components/Plans/AiDestekliPlan';
import DersPlanDetay from './components/Plans/DersPlanDetay';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<div>Ana Sayfa</div>} />
                  <Route path="/profile" element={<div>Profil</div>} />
                  <Route path="/ozel-plans" element={<OzelDersPlanList />} />
                  <Route path="/create-plan" element={<CreateOzelDersPlan />} />
                  <Route path="/ai-plan" element={<AiDestekliPlan />} />
                  <Route path="/plan/:id" element={<DersPlanDetay />} />
                  <Route path="/edit-plan/:id" element={<OzelDersPlanForm />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App; 