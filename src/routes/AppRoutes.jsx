import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import AddPage from "../pages/home/AddPage";

import Login from "../pages/auth/Login";
import Registration from "../pages/auth/Registration";

import Supplier from "../pages/contact/supplier/Supplier";
import Customer from "../pages/contact/customer/Customer";

import ListProducts from "../pages/product/ListProducts";
import AddProduct from "../pages/product/AddProduct";
import Categories from "../pages/product/Categories";
import SubCategories from "../pages/product/SubCategories";
import Brand from "../pages/product/Brand";
import Units from "../pages/product/Units";

import SaleInvoiceList from "../pages/sales/SaleInvoiceList";
import AddSale from "../pages/sales/AddSale";

import AddPurchase from "../pages/purchases/AddPurchase";
import PurchaseInvoiceList from "../pages/purchases/PurchaseInvoiceList";

import SupplierView from '../pages/contact/supplier/SupplierView'
import CustomerView from '../pages/contact/customer/CustomerView'
import AddPurchaseReturn from "../pages/purchaseReturn/AddPurchaseReturn";
import PurchaseReturnList from "../pages/purchaseReturn/PurchaseReturnList";

import Quotation from "../pages/Quotation/Quotation";
import QuotationInvoiceList from '../pages/Quotation/QuotationInvoiceList'
import Dashboard from "../pages/dashboard/Dashboard";
import BusinessProfile from "../pages/dashboard/BusinessProfile";

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

         <Route path="dashboard" element={<Dashboard/>}/>
         <Route path="businessProfile" element={<BusinessProfile/>}/>
         {/* product */}
         <Route path="listProduct" element={<ListProducts />} />
         <Route path="addProduct" element={<AddProduct />} />
         <Route path="categories" element={<Categories />} />
         <Route path="subCategories" element={<SubCategories />} />
         <Route path="brands" element={<Brand />} />
         <Route path="units" element={<Units />} />
         {/* contacts */}
         <Route path="supplier" element={<Supplier />} />
         <Route path="customer" element={<Customer />} />
         <Route path="viewPage" element={<SupplierView />} />
         <Route path="customerView" element={<CustomerView />} />
          {/* sale */}
          <Route path="addSale" element={<AddSale />} />
         <Route path="saleInvoiceList" element={<SaleInvoiceList />}/>
         {/* purchase */}
         <Route path="addPurchase" element={<AddPurchase />} />
         <Route path="purchaseInvoiceList" element={<PurchaseInvoiceList />} />
         {/* purchase return */}
         <Route path="purchaseReturn" element={<AddPurchaseReturn />} />
         <Route path="purchaseReturnList" element={<PurchaseReturnList />} />
          {/* quotation */}
         <Route path="quotation" element={<Quotation />} />
         <Route path="quotationInvoiceList" element={<QuotationInvoiceList />} />
       </Route>
       
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>

//     <Router>
//     <Routes>
//        <Route path="/" element={<Layout />}>
//           <Route index element={<AddPage />} />
//           <Route path="listProduct" element={<ListProducts />} />
//           <Route path="addProduct" element={<AddProduct />} />
//           <Route path="categories" element={<Categories />} />
//           <Route path="subCategories" element={<SubCategories />} />
//           <Route path="brands" element={<Brand />} />
//           <Route path="units" element={<Units />} />
//           <Route path="supplier" element={<Supplier />} />
//           <Route path="customer" element={<Customer />} />
//           <Route path="viewPage" element={<ViewPage />} />
//           <Route path="addSale" element={<AddSale />} />
//           <Route path="saleInvoiceList" element={<SaleInvoiceList />} />
//           <Route path="addPurchase" element={<AddPurchase />} />
//           <Route path="purchaseInvoiceList" element={<PurchaseInvoiceList />} />
//        </Route>
//     </Routes>
//  </Router>
 
    );
};

export default Route1;
