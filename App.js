// In App.js in a new project
// import * as React from 'react';
import 'react-native-reanimated';

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Auth/Login';
import Register from './src/Auth/Register';
import SplashScreen from './src/pages/SplashScreen';
import Home from './src/Production/Home';
// import Navbaritem from './src/Layout/Navbaritem';
// import AddMember from './src/Layout/Members/AddMember';
// import EmptyMember from './src/Layout/Members/EmptyMember';
// import UpdateMember from './src/Layout/Members/UpdateMember';
// import AddProduct from './src/Layout/Product/AddProduct';
import ProductList from './src/Production/ProductList';
// import AddShop from './src/Layout/Vendor/AddShop';
import ProcessTime from './src/pages/Processtime';
// import VendorList from './src/Layout/Vendor/VendorList';
// import Member from './src/Layout/Member';
// import UpdateVendor from './src/Layout/Vendor/UpdateVendor';
import Colorshade from './src/pages/Colorshade';
// import EmptyVendor from './src/Layout/Vendor/EmptyVendor';
import AccountOrderList from './src/Account/AccountOrderList';
// import Order from './src/Layout/Order';
import AccountOrder from './src/Account/AccountOrder';
// import SaleProduct from './src/Layout/Product/SaleProduct';
// import OrderConfirmation from './src/Layout/Product/OrderConfirmation';
import Navbaritemproduction from './src/Production/Navbaritemproduction';
import OrderAccept from './src/Production/Order/OrderAccept';
import OrderDetails from './src/Production/Order/OrderDetails';
import Defected from './src/Qc/Order/Defected';
import SalesNavbaritem from './src/Sales/SalesNavbaritem';
import SalesOrderAccept from './src/Sales/SalesOrderAccept';
import SalesOrderDetails from './src/Sales/SalesOrderDetails';
import AddShop from './src/Sales/Vendor/AddShop';
import UpdateVendor from './src/Sales/Vendor/UpdateVendor';
import EmptyVendor from './src/Sales/Vendor/EmptyVendor';
import VendorList from './src/Sales/Vendor/VendorList';
import AccountNavbar from './src/Account/AccountNavbar';
import ReminderTime from './src/pages/ReminderTime';
import Profile from './src/pages/Profile';
import QcNavbaritem from './src/Qc/QcNavbaritem';
import QcOrder from './src/Qc/Order/QcOrder';
import QcOrderDetails from './src/Qc/Order/QcOrderDetails';
import BeforeOrder from './src/Production/Order/BeforeOrder';
import AcceptOrderDetails from './src/Production/Order/AcceptOrderDetails';



const Stack = createNativeStackNavigator();

function App() {
  const [customizedProducts, setCustomizedProducts] = useState([]);
  return (

    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName='QcNavbaritem' screenOptions={{headerShown:false}} > */}
      {/* <Stack.Navigator initialRouteName='SalesNavbaritem' screenOptions={{ headerShown: false }} > */}
      
      <Stack.Navigator initialRouteName='Navbaritemproduction' screenOptions={{headerShown:false}} >
      {/* <Stack.Navigator initialRouteName='AccountNavbar' screenOptions={{headerShown:false}} > */}



        {/* <Stack.Navigator initialRouteName='AccountNavbar' screenOptions={{headerShown:false}} > */}
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Screen' component={SplashScreen} />
        <Stack.Screen name='home' component={Home} />
        {/* <Stack.Screen name="Home">
          {(props) => (
            <Home
              {...props}
              customizedProducts={customizedProducts} 
            />
          )}
        </Stack.Screen> */}
        {/* <Stack.Screen name='Navbaritem' component={Navbaritem} /> */}

        <Stack.Screen name='ProductList ' component={ProductList} />
        
        {/* <Stack.Screen name='OrderAccept' component={OrderAccept}/> */}
        {/* <Stack.Screen name='OrderDetails' component={OrderDetails}/> */}

        {/* <Stack.Screen name='addmember' component={AddMember} />
        <Stack.Screen name='emptymember' component={EmptyMember} />
        <Stack.Screen name='updatemember' component={UpdateMember} />
        <Stack.Screen name='addproduct' component={AddProduct} /> */}

        <Stack.Screen name='processtime' component={ProcessTime} />
        <Stack.Screen name='ProductList' component={ProductList} />
        {/* //<Stack.Screen name='member' component={Member} /> */}
        <Stack.Screen name='colorshade' component={Colorshade} />
        <Stack.Screen name='accountorderlist' component={AccountOrderList} />
        {/* <Stack.Screen name='orders' component={Order} /> */}
        <Stack.Screen name='accountorders' component={AccountOrder} />
        {/* <Stack.Screen name='SaleProduct' component={SaleProduct} /> */}
        {/* <Stack.Screen name='OrderConfirmation' component={OrderConfirmation} /> */}

{/* Qc */}
        <Stack.Screen name='QcNavbaritem' component={QcNavbaritem} />
        <Stack.Screen name='QcOrder' component={QcOrder} />
        <Stack.Screen name='QcOrderDetails' component={QcOrderDetails}/>
        <Stack.Screen name='Defected' component={Defected}/>


        {/* Production */}

        <Stack.Screen name='Navbaritemproduction' component={Navbaritemproduction}/>
          <Stack.Screen name='OrderAccept' component={OrderAccept}/>
          <Stack.Screen name='OrderDetails' component={OrderDetails}/>
          <Stack.Screen name='BeforeOrder' component={BeforeOrder}/>
          <Stack.Screen name='AcceptOrderDetails' component={AcceptOrderDetails}/>

         


        {/* sales */}

        <Stack.Screen name='SalesNavbaritem' component={SalesNavbaritem} />
        <Stack.Screen name='SalesOrderDetails' component={SalesOrderDetails} />
        <Stack.Screen name='SalesOrderAccept' component={SalesOrderAccept} />
        <Stack.Screen name='addshop' component={AddShop} />
        <Stack.Screen name='updatevendor' component={UpdateVendor} />
        <Stack.Screen name='emptyvendor' component={EmptyVendor} />
        <Stack.Screen name='VendorList' component={VendorList} />
        <Stack.Screen name='Time' component={ReminderTime} />
        <Stack.Screen name='Profile' component={Profile} />



        {/* ACCount */}
        <Stack.Screen name='AccountNavbar' component={AccountNavbar} />



        <Stack.Screen name="SaleProduct">
          {(props) => (
            <SaleProduct
              {...props}
              customizedProducts={customizedProducts}
              setCustomizedProducts={setCustomizedProducts}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="OrderConfirmation">
          {(props) => (
            <OrderConfirmation
              {...props}
              customizedProducts={customizedProducts}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;