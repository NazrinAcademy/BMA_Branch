import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../HomePage/Layout";
import AddPage from "../HomePage/AddPage";

import Login from "../LoginPage/Login";
import Registration from "../LoginPage/Registration";

import Supplier from "../Pages/Contacts/Supplier";
import ViewPage from "../Pages/Contacts/ViewPage";
import Customer from "../Pages/Contacts/Customer";

import ListProducts from "../Pages/Products/ListProducts";
import AddProduct from "../Pages/Products/AddProduct";
import Categories from "../Pages/Products/Categories";
import SubCategories from "../Pages/Products/SubCategories";
import Brand from "../Pages/Products/Brand";
import Units from "../Pages/Products/Units";

import SaleInvoiceList from "../Pages/Sale/SaleInvoiceList";
import AddSale from "../Pages/Sale/AddSale";

import AddPurchase from "../Pages/Purchase/AddPurchase";
import PurchaseInvoiceList from "../Pages/Purchase/PurchaseInvoiceList";

// Authentication Check
const isAuthenticated = () => {
  return localStorage.getItem("user") ? true : false;
};

const Route1 = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route - Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected Routes */}
        {isAuthenticated() ? (
         <Route path="/dashboard" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}>
         <Route index element={<AddPage />} />
         <Route path="listProduct" element={<ListProducts />} />
         <Route path="addProduct" element={<AddProduct />} />
         <Route path="categories" element={<Categories />} />
         <Route path="subCategories" element={<SubCategories />} />
         <Route path="brands" element={<Brand />} />
         <Route path="units" element={<Units />} />
         <Route path="supplier" element={<Supplier />} />
         <Route path="customer" element={<Customer />} />
         <Route path="viewPage" element={<ViewPage />} />
         <Route path="addSale" element={<AddSale />} />
         <Route path="saleInvoiceList" element={<SaleInvoiceList />} />
         <Route path="addPurchase" element={<AddPurchase />} />
         <Route path="purchaseInvoiceList" element={<PurchaseInvoiceList />} />
       </Route>
       
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default Route1;
