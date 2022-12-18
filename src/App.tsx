
import Home from './pages/Home/Home'
import './App.css';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import EstoquePage from './pages/Produtos/Estoque';
import Providers from './Providers';
import Graficos from './pages/Vendas/Vendas';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPassword';
import ChangePasswordPage from './pages/ChangePassword/ChangePassword';
import PersonsPage from './pages/Persons/Persons';
import SuppliersPage from './pages/Suppliers/Suppliers';






const App = () => {

  return (
  <>
    <Providers>
      <HashRouter>
     
          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/estoque' element={<EstoquePage />} />
            <Route path='/vendas' element={<Graficos />} />
            {/* <Route path='*' element={<LoginPage />} /> */}
            <Route path='/' element={<LoginPage />} />
            <Route path='/cadastro' element={<RegisterPage />} />
            <Route path='/esqueceuSenha' element={<ForgotPasswordPage />} />
            <Route path='/recuperar-senha/:id' element={<ChangePasswordPage />} />
            <Route path='/clientes' element={<PersonsPage />} />
            <Route path='/fornecedores' element={<SuppliersPage />} />
          </Routes>
      
      </HashRouter>
    </Providers>
  </>
  );
}



export default App
