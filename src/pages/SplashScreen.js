import React, { useEffect } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 500); 

    
    return () => clearTimeout(timer);
  }, [navigation]);

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
