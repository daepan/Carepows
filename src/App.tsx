import {
  Routes,
  Route,
} from 'react-router-dom';
import Main from './pages/Main';
import Detect from './pages/detect';
import Location from './pages/location';
import './fonts.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/detect" element={<Detect />} />
      <Route path="/location" element={<Location />} />
    </Routes>
  );
}

export default App;
