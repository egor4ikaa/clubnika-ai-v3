import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
import { ClassifierPage } from '@/pages/ClassifierPage';
import { AssistantPage } from '@/pages/AssistantPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/classifier" element={<ClassifierPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
