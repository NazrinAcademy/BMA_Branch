import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../HomePage/Layout";
import AddPage from "../HomePage/AddPage";
import AddProduct from "../components/AddProduct";
// import PGDetails from "../PGDetails";
// import Supplier from "../Pages/Category/Supplier";
import Categories from '../components/Categories'
import SubCategories from "../components/SubCategories";
import Brand from "../components/Brand";
import Units from "../components/Units";
import ListProducts from "../components/ListProducts";
import AddSale from "../components/AddSale";

const Route1 = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<AddPage/>}/>
           <Route path="listProduct" element={<ListProducts/>}></Route>
           <Route path="addproduct" element={<AddProduct/>}></Route>
           <Route path="category" element={<Categories/>}></Route>
           <Route path="subCategory" element={<SubCategories/>}></Route>
           <Route path="brand" element={<Brand/>}></Route>
           <Route path="unit" element={<Units/>}></Route>


           <Route path="addSale" element={<AddSale/>}></Route>
           {/* <Route path="/" element={<AddPage/>}></Route> */}
           {/* <Route path="pgDetails" element={<PGDetails/>}></Route> */}
           {/* <Route path="supplier" element={<Supplier/>}></Route> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default Route1;
