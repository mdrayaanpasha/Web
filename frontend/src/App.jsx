import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './index.css';
import ProductAdd from './components/ProductAdd';
import BillInt from './components/billInterface';
import UserAuth from './components/userAdd';
import ProductAnalysis from './components/Prod-Analysis';
import CustomerAnalysis from './components/CustomerAnalysis';
import CentralProductAnalysis from './components/P-Analysis';
import CentralCustomerAnalysis from './components/C-Analysis';
const App = () => {
    return (
        <Router>
            <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/ProductAdd' element={<ProductAdd />} />
            <Route path='/userAdd' element={<UserAuth />} />
            <Route path='/billing' element={<BillInt />} />
            <Route path="/product-analysis" element={<ProductAnalysis/>}/>
            <Route path="/customer-analysis" element={<CustomerAnalysis/>}/>
            <Route path='/PA' element={<CentralProductAnalysis/>}></Route>
            <Route path='/CA' element={<CentralCustomerAnalysis/>}></Route>
            </Routes>
        </Router>
    );
};

export default App;
