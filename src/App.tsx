import {
  Routes,
  Route,
} from 'react-router-dom';
import Main from './pages/Main';
import Detect from './pages/detect';
import './fonts.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/detect" element={<Detect />} />
    </Routes>
  );
}

export default App;
