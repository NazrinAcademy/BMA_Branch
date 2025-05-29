import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ArchiveX , Plus, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getColorshade } from '../../Utils/apiService';

const { width, height } = Dimensions.get('window');

export const Colorshade= () => {
  const navigation = useNavigation(); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getColorshade() // Await the API response
        console.log("Fetched Data:", fetchedData);
        
        // Ensure fetchedData exists and contains 'data' property
        if (fetchedData?.data?.length !== 0) {
          navigation.navigate('Colorlist');
        } 
      } catch (error) {
        console.error("Error fetching color shades:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  
 

  const handleGoBack = () => {
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
            <ArrowLeft size={24} color="black"  />
          </TouchableOpacity>
        <Text style={styles.headerText}>Colorshade</Text>
      </View>

      <View style={styles.emptyContainer}>
        <ArchiveX style={styles.icon} size={width * 0.21} color="#838383" strokeWidth={1} />
        <Text style={styles.title}>Product Not Found</Text>
        <Text style={styles.subtitle}>
        You can add a new product to keep your catalog fresh and up-to-date.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.fabButton} 
        onPress={() => navigation.navigate('Addcolorshades')} 
      >
        <Plus size={width * 0.08} color="white" />
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
    paddingHorizontal: width * 0.04,
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
    paddingHorizontal:width * 0.05,
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


