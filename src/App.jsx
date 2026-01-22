import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Characters from './pages/Characters';
import Genres from './pages/Genres';
import Schedules from './pages/Schedules';
import Seasonal from './pages/Seasonal';
import SeasonArchive from './pages/SeasonArchive';
import Upcoming from './pages/Upcoming';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/genres" element={<Genres />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/seasonal" element={<Seasonal />} />
                <Route path="/archive" element={<SeasonArchive />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
