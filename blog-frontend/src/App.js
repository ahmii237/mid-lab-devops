import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PostDetailPage from './PostDetailPage'; // You can comment this out if not using yet

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id/" element={<PostDetailPage />} /> {/* Optional */}
      </Routes>
    </Router>
  );
}

export default App;
