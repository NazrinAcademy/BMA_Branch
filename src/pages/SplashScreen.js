import React, { useEffect } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
      //  const admin=AsyncStorage.removeItem('adminToken')
      //  if(admin){
      //   console.log("Admin token cleared");


      //  }
      //   navigation.navigate('Screen')

        // // Retrieve tokens from AsyncStorage (properly using `await`)
        const admintoken = await AsyncStorage.getItem('adminToken');
        const salestoken = await AsyncStorage.getItem('salesToken');

        console.log("Admin Token:", admintoken);
        console.log("Sales Token:", salestoken);

        if (!admintoken && !salestoken) {
          // No tokens found, navigate to Rolepage
          console.log("No token found, navigating to Rolepage");
          navigation.replace('Rolepage');
        } else if (admintoken) {
          // Admin token exists, navigate to Admin Page
          console.log("Admin token found, navigating to Navbaritemadmin");
          navigation.replace('Navbaritemadmin');
        } else if (salestoken) {
          // Sales token exists, navigate to Sales Page
          console.log("Sales token found, navigating to SalesNavbaritem");
          navigation.replace('SalesNavbaritem');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigation.replace('Rolepage'); // Handle errors by sending user to Rolepage
      }
    };

    checkAuth();
  }, [navigation]);
  // useEffect(() => {
  //   const clearTokenAndNavigate = async () => {
  //     try {
  //       await AsyncStorage.removeItem('adminToken'); // ✅ Clears token
  //       console.log("Admin token deleted successfully");

  //       navigation.replace('Rolepage'); // ✅ Navigates after deletion
  //     } catch (error) {
  //       console.error("Error clearing token:", error);
  //     }
  //   };

  //   clearTokenAndNavigate();
  // }, [navigation]);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <Text style={styles.title}>Wood Jungle</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2F2E',
  },
  title: {
    fontSize: 40,
    lineHeight: 48,
    color: '#D6B06B',
    fontFamily: 'Lato-Regular',
  },
});

export default SplashScreen;
