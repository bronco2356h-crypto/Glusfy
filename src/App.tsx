import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Configurator from './pages/Configurator';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/configurador" element={<Configurator />} />
      </Routes>
    </div>
  );
}

export default App;
