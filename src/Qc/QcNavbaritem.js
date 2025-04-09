
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Product from './Product';
import { House, Box , Archive, UserRound } from "lucide-react-native"; 
import QcOrder from './Order/QcOrder';

const Tab = createBottomTabNavigator();
const QcNavbaritem= () => {
return (
    
<Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false, 
    tabBarStyle: styles.tabBar, 
    tabBarIcon: ({ color, size }) => {
      if (route.name === 'Home') {
        return < House color={color} size={size} />;
      } else if (route.name === 'Order') {
        return <Box  color={color} size={size} />;
      } 
    
    },
    tabBarLabelStyle: styles.tabBarLabel, 
    tabBarActiveTintColor: '#1B2F2E', 
    tabBarInactiveTintColor: '#808080', 
  })}
>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Order" component={QcOrder} />
      {/* <Tab.Screen name="Order" component={Product} /> */}
    
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
   fontFamily:'Lato-Regular',
fontsize: 12,
fontStyle: 'normal',

  },
});

export default QcNavbaritem;
