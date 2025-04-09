import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import { House, Box, Archive, UserRound } from "lucide-react-native";
// import ProductionOrder from './Product/ProductionOrder';
import VendorList from './Vendor/VendorList';
import SaleProduct from './Vendor/SaleProduct';
import SalesOrder from './SalesOrder';


const Tab = createBottomTabNavigator();



const SalesNavbaritem = () => {
  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return < House color={color} size={size} />;
          } else if (route.name === 'Order') {
            return <Box color={color} size={size} />;
          } else if (route.name === 'Product') {
            return <Archive color={color} size={size} />;
          } else if (route.name === 'Member') {
            return <UserRound color={color} size={size} />;
          }
        },
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: '#1B2F2E',
        tabBarInactiveTintColor: '#808080',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Order" component={SalesOrder} />
      <Tab.Screen name="Product" component={SaleProduct} />
      <Tab.Screen name="Member" component={VendorList} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,

  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontfamily: 'Lato',
    fontsize: 12,
    fontStyle: 'normal',
    // font-weight: 600;
    // line-height: normal;
  },
});

export default SalesNavbaritem;
