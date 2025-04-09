import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Modal, Image } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { addShop } from '../../Api/apiService'; 

const { width, height } = Dimensions.get('window'); 

const AddShop = () => {
  const navigation = useNavigation();
  const [shopName, setShopName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSave = async () => {
    if (!shopName || !vendorName || !mobileNo || !address || !landmark || !area || !city || !pinCode) {
      setErrorMessage('Please fill in all fields');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const shopData = { shopName, vendorName, mobileNo, address, landmark, area, city, pinCode };

    try {
      await addShop(shopData);
      setIsModalVisible(true);
    } catch (error) {
      setErrorMessage('Failed to add shop. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setShopName('');
    setVendorName('');
    setMobileNo('');
    setAddress('');
    setLandmark('');
    setArea('');
    setCity('');
    setPinCode('');
    navigation.navigate('Member'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={width * 0.08} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Shop</Text>
      </View>

      <ScrollView style={styles.form}>
        {[ 
          { label: 'Shop Name', value: shopName, setter: setShopName },
          { label: 'Vendor Name', value: vendorName, setter: setVendorName },
          { label: 'Mobile No', value: mobileNo, setter: setMobileNo, keyboardType: 'phone-pad' },
          { label: 'Address', value: address, setter: setAddress },
          { label: 'Landmark', value: landmark, setter: setLandmark },
          { label: 'Area', value: area, setter: setArea },
          { label: 'City', value: city, setter: setCity },
          { label: 'Pin Code', value: pinCode, setter: setPinCode, keyboardType: 'numeric' },
        ].map(({ label, value, setter, keyboardType }, index) => (
          <View key={index} style={[styles.inputContainer, focusedInput === label && styles.focusedInputContainer]}>
            {focusedInput === label && <Text style={styles.fieldsetLabel}>{label}</Text>}
            <TextInput
              style={styles.input}
              placeholder={focusedInput === label ? '' : label}
              placeholderTextColor={'#838383'}
              value={value}
              onChangeText={setter}
              keyboardType={keyboardType}
              onFocus={() => setFocusedInput(label)}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        ))}
      </ScrollView>

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={require('../../asset/images/success.png')} style={styles.successImage} />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>The vendor has been added successfully and is now ready to be managed</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: height * 0.11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
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
    fontFamily: 'Lato-Bold',
  },
  form: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor:'#F4F4F4'
  },
  inputContainer: {
    marginBottom: height * 0.03,
    borderWidth: 1,
    borderColor: '#CECECE',
    borderRadius: width * 0.01,

  },
  focusedInputContainer: {
    borderColor: '#000',
  },
  input: {
    fontSize: width * 0.04,
    padding: width * 0.04,
    color:'#202020',
    fontFamily:'Lato-Regular'

  },
  fieldsetLabel: {
    position: 'absolute',
    top: -height * 0.014,
    left: width * 0.04,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: width * 0.02,
    fontSize: width * 0.035,
    color:'#838383',
    fontFamily:'Lato-Regular'
  },
  saveContainer:{
    backgroundColor:'#fff'
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2F2E',
    padding: height * 0.025,
    borderRadius: width * 0.01,
    margin: width * 0.05,
  },
  saveButtonText: {
    color: '#D6B06B',
    fontSize: width * 0.045,
    fontFamily:'Lato-Bold',
  },
  errorContainer: {
    bottom: height * 0.02, 
    backgroundColor: '#1E1F24',
    borderColor: 'rgba(30, 31, 36, 1)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 1.0, 
    height: height * 0.1, 
    zIndex:1,
    top: height * 0.11
  },
  errorMessage: {
    color: '#FFFFFF',
    fontSize: width * 0.04, 
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: width * 0.8,
  },
  successImage: {
    width: width * 0.2,
    height: height * 0.1,
    marginBottom: height * 0.01,
  },
  modalTitle: {
    fontSize: 20,
    color: '#1B2F2E',
    fontFamily: 'Lato-Bold',
    marginBottom: height * 0.01,
  },
  modalMessage: {
    fontSize: 14,
    color: '#838383',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  modalButton: {
    backgroundColor: '#1B2F2E',
    paddingVertical: height*0.020,
    paddingHorizontal: width*0.070,
    borderRadius: 4,
    marginBottom: height * 0.02,
  },
  modalButtonText: {
    color: '#D6B06B',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
});

export default AddShop;
