import {
  Routes,
  Route,
} from 'react-router-dom';
import IndexPage from './pages/Index';
import Main from './pages/Main';
import Detect from './pages/detect';
import Location from './pages/location';
import './fonts.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<IndexPage />}>
        <Route path="/" element={<Main />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/location" element={<Location />} />
      </Route>
    </Routes>
  );
}

export default App;
