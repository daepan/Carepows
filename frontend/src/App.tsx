import {
  Routes,
  Route,
} from 'react-router-dom';
import IndexPage from './pages/Index';
import Main from './pages/Main';
import Detect from './pages/detect';
import Location from './pages/location';
import Doctor from './pages/doctor';
import Register from 'pages/register';
import ReserveDoctor from './pages/reserveDoctor';
import DoctorDetail from './pages/doctorDetail';
import SocketRoom from './pages/socketRoom';
import Reserve from './pages/reserve';
import './fonts.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<IndexPage />}>
        <Route path="/" element={<Main />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/location" element={<Location />} />
        <Route path="/login" element={<Doctor />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reserve" element={<ReserveDoctor />} />
        <Route path="/doctorDetail" element={<DoctorDetail />} />
        <Route path="/room" element={<SocketRoom />} />
        <Route path="/reserveDetail/:doctorId" element={<Reserve />} />
      </Route>
    </Routes>
  );
}

export default App;
