import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Auth/Login.js';
import Register from './src/Auth/Register.js';
import SplashScreen from './src/pages/SplashScreen';

import Navbaritem from './src/Layout/Navbaritem';
import AddMember from './src/Layout/Members/AddMember';
import EmptyMember from './src/Layout/Members/EmptyMember';
import UpdateMember from './src/Layout/Members/UpdateMember';
import AddProduct from './src/Layout/Product/AddProduct';



import Colorlist from './src/Layout/Product/Colorlist';
import OrderDetails from './src/Layout/Order/OrderDetails.js';
import Rolepage from './src/Utils/Rolepage.js';


import Product from './src/Layout/Product/Product.js';

import SalesNavbaritem from './src/Sales/SalesNavbaritem.js';
import Member from './src/Layout/Members/Member.js';
import { Addcolorshades } from './src/Layout/Product/Addcolorshade.js';
import ProtectedRouteSales from './src/Utils/Productedroutersales.js';
import  ProtectedRoute  from './src/Utils/Productedroute.js';
import { Colorshade } from './src/Layout/Product/Colorshade.js';
import { Emptyproduct } from './src/Layout/Product/Emptyproduct.js';
import ProductList from './src/Layout/Product/Productlist.js';
// import AddShop from './src/Sales/Vendor/AddShop.js';
import Updateproduct from './src/Layout/Product/Updateproduct.js';
import AddShop from './src/Layout/Vendor/AddShop.js';
import VendorList from './src/Layout/Vendor/VendorList.js';




// import { SalesLoginfun } from './src/Utils/apiService';
// import { Otherslogin } from './src/Utils/Otherslogin';
// import { SplashScreenOthers } from './src/pages/SplashScreenOthers';
// import Rolepage from './src/Utils/Rolepage';
// import { AppRegistry } from 'react-native';
// AppRegistry.registerComponent(appName, () => App);

const Stack = createNativeStackNavigator();

function App() {
  return (
    
    <NavigationContainer>
<Stack.Navigator initialRouteName='Screen' screenOptions={{ headerShown: false }}>

 <Stack.Screen name='Login' component={Login} />
 <Stack.Screen name='Register' component={Register} />
 <Stack.Screen name='Screen' component={SplashScreen} />
 <Stack.Screen name='Rolepage' component={Rolepage} />
 <Stack.Screen name='AddShop' component={AddShop} />
 <Stack.Screen name='VendorList' component={VendorList} />



{/* admin */}

<Stack.Screen name="OrderDetails" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <OrderDetails></OrderDetails>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Navbaritemadmin" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Navbaritem></Navbaritem>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="addmember" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <AddMember></AddMember>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="emptymember" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <EmptyMember></EmptyMember>
            </ProtectedRoute>
          )}
        </Stack.Screen>
        
        <Stack.Screen name="Member" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Member></Member>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        
        <Stack.Screen name="Colorshade" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Colorshade></Colorshade>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Colorlist" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Colorlist></Colorlist>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="UpdateMember" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <UpdateMember></UpdateMember>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        
        <Stack.Screen name="ProductList" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductList></ProductList>
            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Addcolorshades" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Addcolorshades></Addcolorshades>

            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="AddProduct" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <AddProduct></AddProduct>

            </ProtectedRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Emptyproduct" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Emptyproduct></Emptyproduct>

            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name="Updateproduct" >
           {() => (
            <ProtectedRoute allowedRoles={['admin']}>
              <Updateproduct/>

            </ProtectedRoute>
          )}
        </Stack.Screen>




{/* sales */}

<Stack.Screen name="SalesNavbaritem" >
           {() => (
            <ProtectedRouteSales allowedRoles={['sales']}>
              <SalesNavbaritem/>
            </ProtectedRouteSales>
          )}
        </Stack.Screen>
  
  
{/* <Stack.Screen name="AddShop" >
           {() => (
            <ProtectedRouteSales allowedRoles={['sales']}>
              <AddShop></AddShop>
            </ProtectedRouteSales>
          )}
        </Stack.Screen> */}
     










 






</Stack.Navigator>








   </NavigationContainer> 

  )
}

export default App;

        





    //sales
    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName='Screenothers' screenOptions={{headerShown:false}} >
    //     <Stack.Screen name='Otherslogin' component={Otherslogin} />
    //     <Stack.Screen name='Rolepage' component={Rolepage} />
    //     <Stack.Screen name='Screenothers' component={SplashScreenOthers} />
    //     <Stack.Screen name='home' component={Home} />
      

    //     {/* <Stack.Screen name='Navbaritem' component={Navbaritem} /> */}
    //     {/* <Stack.Screen name='addmember' component={AddMember} /> */}
    //     {/* <Stack.Screen name='emptymember' component={EmptyMember} /> */}
    //     <Stack.Screen name='updatemember' component={UpdateMember} />
    //     <Stack.Screen name='addproduct' component={AddProduct} />
    //     <Stack.Screen name='addshop' component={AddShop} />


        
    //     {/* Admin routes with ProtectedRoute */}
    //     <Stack.Screen name="Navbaritem" >
    //       {() => (
    //         <ProtectedRoute allowedRoles={['admin']}>
    //           <Navbaritem/>
    //         </ProtectedRoute>
    //       )}
    //     </Stack.Screen>

    //     <Stack.Screen name="addmember" >
    //       {() => (
    //         <ProtectedRoute allowedRoles={['admin']}>
    //           <AddMember/>
    //         </ProtectedRoute>
    //       )}
    //     </Stack.Screen>

    //     <Stack.Screen name="emptymember" >
    //       {() => (
    //         <ProtectedRoute allowedRoles={['admin']}>
    //           <EmptyMember/>
    //         </ProtectedRoute>
    //       )}
    //     </Stack.Screen>

    //     {/* Colorshade */}
        
    //     <Stack.Screen name="Colorshade" >
    //       {() => (
    //         <ProtectedRoute allowedRoles={['admin']}>
    //           <Colorshade/>
    //         </ProtectedRoute>
    //       )}
    //     </Stack.Screen>

           
    //     <Stack.Screen name="Colorlist" >
    //       {() => (
    //         <ProtectedRoute allowedRoles={['admin']}>
    //           <Colorlist/>
    //         </ProtectedRoute>
    //       )}
    //     </Stack.Screen>



        




    //   </Stack.Navigator>
    // </NavigationContainer>



    //backup
    // <Stack.Navigator initialRouteName='Screen' screenOptions={{headerShown:false}} >
    //     <Stack.Screen name='Login' component={Login} />
    //     <Stack.Screen name='Register' component={Register} />
    //     <Stack.Screen name='Screen' component={SplashScreen} />
    //     <Stack.Screen name='home' component={Home} />
    //     <Stack.Screen name='EmptyMember' component={EmptyMember} /> 

      

    //     {/* <Stack.Screen name='Navbaritem' component={Navbaritem} /> */}
    //     {/* <Stack.Screen name='addmember' component={AddMember} /> */}
    //     {/* <Stack.Screen name='emptymember' component={EmptyMember} /> */}
    //     {/* <Stack.Screen name='updatemember' component={UpdateMember} /> */}
    //     {/* <Stack.Screen name='addproduct' component={AddProduct} /> */}
    //     <Stack.Screen name='addshop' component={AddShop} />
    //     {/* <Stack.Screen name='Navbaritem' component={Navbaritem} />
    //     <Stack.Screen name='addmember' component={AddMember} /> */}
    //     {/* <Stack.Screen name='Colorshade' component={Colorshade} /> */}
    //     {/* <Stack.Screen name='Colorlist' component={Colorlist} />
    //     <Stack.Screen name='EmptyMember' component={EmptyMember} /> */}
    //     <Stack.Screen name='OrderDetails' component={OrderDetails} />



//ram backup

{/* <NavigationContainer>
<Stack.Navigator initialRouteName='Screen' screenOptions={{ headerShown: false }}>
 <Stack.Screen name='Login' component={Login} />
 <Stack.Screen name='Register' component={Register} />
 <Stack.Screen name='Screen' component={SplashScreen} />
 <Stack.Screen name='home' component={Home} />
 <Stack.Screen name='EmptyMember' component={EmptyMember} /> 
 <Stack.Screen name='addshop' component={AddShop} />
 <Stack.Screen name='OrderDetails' component={OrderDetails} />

 {/* Admin Routes with ProtectedRoute */}
//  <Stack.Screen name="Navbaritem">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <Navbaritem />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="addmember">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <AddMember />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="emptymember">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <EmptyMember />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="Colorshade">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <Colorshade />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="Colorlist">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <Colorlist />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="UpdateMember">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <UpdateMember />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="AddProduct">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <AddProduct />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

//  <Stack.Screen name="Addolorshade">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//      <Addolorshade/>
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>

// </Stack.Navigator>


//    </NavigationContainer> */}

// In App.js in a new project
// import * as React from 'react';
// import 'react-native-reanimated';

// import React, { useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Login from './src/Auth/Login';
// import Register from './src/Auth/Register';
// import SplashScreen from './src/pages/SplashScreen';
// import Home from './src/Production/Home';
// // import Navbaritem from './src/Layout/Navbaritem';
// import AddMember from './src/Layout/Members/AddMember';
// import EmptyMember from './src/Layout/Members/EmptyMember';
// import UpdateMember from './src/Layout/Members/UpdateMember';
// import AddProduct from './src/Layout/Product/AddProduct';
// import ProductList from './src/Production/ProductList';
// // import AddShop from './src/Layout/Vendor/AddShop';
// import ProcessTime from './src/pages/Processtime';
// // import VendorList from './src/Layout/Vendor/VendorList';
// import Member from './src/Layout/Member';
// // import UpdateVendor from './src/Layout/Vendor/UpdateVendor';
// import Colorshade from './src/pages/Colorshade';
// // import EmptyVendor from './src/Layout/Vendor/EmptyVendor';
// import AccountOrderList from './src/Account/AccountOrderList';
// // import Order from './src/Layout/Order';
// import AccountOrder from './src/Account/AccountOrder';
// import SaleProduct from './src/Layout/Product/SaleProduct';
// import OrderConfirmation from './src/Layout/Product/OrderConfirmation';
// // import Navbaritemproduction from './src/Production/Navbaritemproduction';
// // import OrderAccept from './src/Production/Order/OrderAccept';
// // import OrderDetails from './src/Production/Order/OrderDetails';
// // import Navbaritem from './src/Qc/Navbaritem';
// import Order from './src/Qc/Order/Order';
// import OrderAccept from './src/Qc/Order/OrderAccept';
// import OrderDetails from './src/Qc/Order/OrderDetails';
// import Defected from './src/Qc/Order/Defected';
// import SalesNavbaritem from './src/Sales/SalesNavbaritem';
// import SalesOrderAccept from './src/Sales/SalesOrderAccept';
// import SalesOrderDetails from './src/Sales/SalesOrderDetails';
// import AddShop from './src/Sales/Vendor/AddShop';
// import UpdateVendor from './src/Sales/Vendor/UpdateVendor';
// import EmptyVendor from './src/Sales/Vendor/EmptyVendor';
// import VendorList from './src/Sales/Vendor/VendorList';
// import ProtectedRoute from './src/Utils/Productedroute';
// import { ProtectedRouteQc } from './src/Utils/Productedrouteqc';
// import { ProtectedRouteSales } from './src/Utils/Productedroutersales';
// import { ProtectedRouteac } from './src/Utils/Productedrouteac';
// import Rolepage from './src/Utils/Rolepage';



// const Stack = createNativeStackNavigator();

// function App() {
//   const [customizedProducts, setCustomizedProducts] = useState([]); 
//   return (
    
//     <NavigationContainer>
//       {/* <Stack.Navigator initialRouteName='Navbaritem' screenOptions={{headerShown:false}} > */}
//       <Stack.Navigator initialRouteName='Screen' screenOptions={{headerShown:false}} >
//       {/* <Stack.Navigator initialRouteName='Navbaritemproduction' screenOptions={{headerShown:false}} > */}
//         <Stack.Screen name='Login' component={Login} />
//         <Stack.Screen name='Register' component={Register} />
//         <Stack.Screen name='Screen' component={SplashScreen} />
// {/*         
//         <Stack.Screen name='home' component={Home} /> */}
//         <Stack.Screen name='Rolepage' component={Rolepage} />
        


//         {/* <Stack.Screen name="Home">
//           {(props) => (
//             <Home
//               {...props}
//               customizedProducts={customizedProducts} 
//             />
//           )}
//         </Stack.Screen> */}
//         {/* <Stack.Screen name='Navbaritem' component={Navbaritem} /> */}
//         {/* <Stack.Screen name='Navbaritem' component={Navbaritem} /> */}
       
//         {/* <Stack.Screen name='Navbaritemproduction' component={Navbaritemproduction}/> */}
//         {/* <Stack.Screen name='ProductList ' component={ProductList}/>
//         <Stack.Screen name='Order' component={Order}/> */}
//         {/* <Stack.Screen name='OrderAccept' component={OrderAccept}/> */}
//         {/* <Stack.Screen name='OrderAccept' component={OrderAccept}/> */}
//         {/* <Stack.Screen name='OrderDetails' component={OrderDetails}/> */}
//         {/* <Stack.Screen name='OrderDetails' component={OrderDetails}/> */}
//         <Stack.Screen name='Defected' component={Defected}/>

//         <Stack.Screen name='addmember' component={AddMember} />
//         <Stack.Screen name='emptymember' component={EmptyMember} />
//         <Stack.Screen name='updatemember' component={UpdateMember} />
//         <Stack.Screen name='addproduct' component={AddProduct} />
       
//         <Stack.Screen name='processtime' component={ProcessTime} />
//         <Stack.Screen name='ProductList' component={ProductList} />
//         <Stack.Screen name='member' component={Member} />
//         <Stack.Screen name='colorshade' component={Colorshade} />
//         <Stack.Screen name='accountorderlist' component={AccountOrderList} />
//         {/* <Stack.Screen name='orders' component={Order} /> */}
//         <Stack.Screen name='accountorders' component={AccountOrder} />
//         {/* <Stack.Screen name='SaleProduct' component={SaleProduct} /> */}
//         {/* <Stack.Screen name='OrderConfirmation' component={OrderConfirmation} /> */}
        
//         {/* sales */}
        
//         <Stack.Screen name='SalesNavbaritem' component={SalesNavbaritem} />
//         <Stack.Screen name='SalesOrderDetails' component={SalesOrderDetails}/>
//         <Stack.Screen name='SalesOrderAccept' component={SalesOrderAccept}/>
//         <Stack.Screen name='addshop' component={AddShop} />
//         <Stack.Screen name='updatevendor' component={UpdateVendor} />
//         <Stack.Screen name='emptyvendor' component={EmptyVendor} />
//         <Stack.Screen name='VendorList' component={VendorList} />


// {/* admin */}

//         <Stack.Screen name="Navbaritem">
//    {() => (
//      <ProtectedRoute allowedRoles={['admin']}>
//        <Navbaritem />
//      </ProtectedRoute>
//    )}
//  </Stack.Screen>


        
//         <Stack.Screen name="SaleProduct">
//           {(props) => (
//             <SaleProduct
//               {...props}
//               customizedProducts={customizedProducts} 
//               setCustomizedProducts={setCustomizedProducts} 
//             />
//           )}
//         </Stack.Screen>
//         <Stack.Screen name="OrderConfirmation">
//           {(props) => (
//             <OrderConfirmation
//               {...props}
//               customizedProducts={customizedProducts} 
//             />
//           )}
//         </Stack.Screen>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;