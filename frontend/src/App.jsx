import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './index.css';
import ProductAdd from './components/ProductAdd';
import BillInt from './components/billInterface';
import UserAuth from './components/userAdd';

const App = () => {
    return (
        <Router>
            <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/ProductAdd' element={<ProductAdd />} />
            <Route path='/userAdd' element={<UserAuth />} />
            <Route path='/Billing' element={<BillInt />} />
            </Routes>
        </Router>
    );
};

export default App;