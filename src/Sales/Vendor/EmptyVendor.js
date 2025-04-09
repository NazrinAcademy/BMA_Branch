import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { UserRoundPlus, Plus, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const EmptyVendor = () => {
  const navigation = useNavigation(); 

  const handleGoBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
            <ArrowLeft size={24} color="#1E1F24"  />
          </TouchableOpacity>
        <Text style={styles.headerText}>Member</Text>
      </View>

      <View style={styles.emptyContainer}>
        <UserRoundPlus style={styles.icon} size={width * 0.21} color="#838383" strokeWidth={1} />
        <Text style={styles.title}>Shop & Vendor Not Found</Text>
        <Text style={styles.subtitle}>
           Currently unavailable — add your shop and vendor to get started!
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => navigation.navigate('VendorList')} 
      >
        <Plus size={width * 0.08} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    height: height * 0.11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerIcon: {
    position: 'absolute',
    left: width * 0.04, 
  },
  headerText: {
    fontSize: width * 0.05, 
    color: '#1E1F24',
    fontFamily:'Lato-Bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  icon: {
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.049, 
    fontFamily: 'Lato-Bold',
    color: '#202020',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.04, 
    fontFamily: 'Lato-Regular',
    color: '#838383',
    textAlign: 'center',
  },
  fabButton: {
    position: 'absolute',
    bottom: height * 0.06, 
    right: width * 0.08,
    backgroundColor: '#1B2F2E',
    width: width * 0.15, 
    height: width * 0.15, 
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default EmptyVendor;
