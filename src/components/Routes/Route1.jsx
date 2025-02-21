import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../HomePage/Layout";
import AddPage from "../HomePage/AddPage";
import Supplier from "../Pages/Contacts/Supplier";
import Categories from "../Categories";
import SubCategories from '../SubCategories'
import Customer from "../Pages/Contacts/Customer";
import ListProducts from "../Pages/Products/ListProducts";
import Brand from "../Brand";
import Units from "../Units";
import AddProduct from "../AddProduct";


const Route1 = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<AddPage/>}/>
           <Route path="/" element={<AddPage/>}></Route>
           <Route path="listproduct" element={<ListProducts/>}></Route>
           <Route path="addproduct" element={<AddProduct/>}></Route>
           <Route path="brand" element={<Brand/>}></Route>
           <Route path="units" element={<Units/>}></Route>
           <Route path="subCategories" element={<SubCategories/>}></Route>
           <Route path="supplier" element={<Supplier/>}></Route>
           <Route path="customer" element={<Customer/>}></Route>
           <Route path="Categories" element={<Categories/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default Route1;
