import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Orders from './pages/Orders';
import AddCatalog from './pages/AddCatalog';
import AddProduct from './pages/AddProduct';
import Subscriber from './pages/Subscriber';


function App() {
  return (
    <Router>
      <Routes>
        {/*<Route path="/" element={<Admin />} /> */}
        {/* <Route path="/" element={<MainPage />} /> */}
        {/*<Route path="/PieChart" element={<PieChart />} />  */}
        {/*<Route path="/DataDemonstration" element={<DataDemonstration />} /> */}

        <Route path="/" element={<Orders />} />
        {/*<Route path="/overview" element={<Overview />} /> */}


        <Route path="/add-catalog" element={<AddCatalog />} />

        <Route path="/add-product" element={<AddProduct />} />
        <Route path="subscribers" element={<Subscriber />}/>


      </Routes>
    </Router>
  );
}

export default App;
