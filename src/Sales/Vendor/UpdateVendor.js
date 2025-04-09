import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateVendorDetails, deleteVendor } from '../../Api/apiService';  

const { width, height } = Dimensions.get('window');

const UpdateVendor = () => {
  const { params } = useRoute();
  const { member, role } = params;
  const [shopName, setShopName] = useState(member.shopname);  
  const [vendorName, setVendorName] = useState(member.vendorname);
  const [mobileNo, setMobileNo] = useState(member.mobileno);
  const [address, setAddress] = useState(member.address);
  const [landmark, setLandmark] = useState(member.landmark);
  const [area, setArea] = useState(member.area);
  const [city, setCity] = useState(member.city);
  const [pincode, setPincode] = useState(member.pincode);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const navigation = useNavigation();

  const handleSave = async () => {
    const updatedMember = {
      shopname: shopName,
      vendorname: vendorName,
      mobileno: mobileNo,
      address: address,
      landmark: landmark,
      area: area,
      city: city,
      pincode: pincode,
    };

    try {
      await updateVendorDetails(member.id, updatedMember); 
      setSuccessMessage(`${role} updated successfully`);
      setIsModalVisible(true);
      setErrorMessage(''); 
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(`Failed to update ${role}`);
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 30000); 
    }
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteVendor(member.id); 
      setSuccessMessage(`${role} has been deleted`);
      setIsDeleteModalVisible(false);
      setIsModalVisible(true);
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage(`Failed to delete ${role}`);
      setIsErrorVisible(true);
      setTimeout(() => setIsErrorVisible(false), 3000); 
      setIsDeleteModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  const handleEditClick = () => {
    if (role === 'Vendor') {
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, role === 'Production' || role === 'Logistics' ? styles.centeredHeader : null]}
        >
          {role === 'Vendor' ? 'Update Vendor' : role}
        </Text>

        {role === 'Vendor' && (
          <View style={styles.icons}>
            <TouchableOpacity onPress={handleEditClick} style={styles.iconButton}>
              <Pencil size={24} color="#202020" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <Trash2 size={24} color="#202020" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Form Section */}
      <ScrollView style={styles.form}>
        {role === 'Vendor' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Shop Name"
              value={shopName}
              onChangeText={setShopName}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="Vendor Name"
              value={vendorName}
              onChangeText={setVendorName}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile No"
              value={mobileNo}
              onChangeText={setMobileNo}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="Landmark"
              value={landmark}
              onChangeText={setLandmark}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="Area"
              value={area}
              onChangeText={setArea}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              editable={isEditing}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              value={pincode}
              onChangeText={setPincode}
              editable={isEditing}
            />
          </>
        )}

        {(role === 'Production' || role === 'Logistics') && (
          <>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Name"
              value={member.name}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Email"
              value={member.email}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Phone"
              value={member.phone}
              editable={false}
            />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Password"
              value={member.password}
              secureTextEntry
              editable={false}
            />
          </>
        )}
      </ScrollView>

      {role === 'Vendor' && isEditing && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Success Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../asset/images/success.png')}
              style={styles.successImage}
            />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>{successMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Message at Bottom */}
      {isErrorVisible && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={styles.modalMessage}>{`Are you sure you want to delete ${role} details?`}</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelDelete}>
                <Text style={[styles.modalButtonText, styles.cancel]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={confirmDelete}>
                <Text style={[styles.modalButtonText, styles.delete]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.04,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#000',
    fontFamily:'Lato-Bold',
    color:'#1E1F24'
  },
  centeredHeader: {
    textAlign: 'center',
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: width * 0.03,
  },
  form: {
    backgroundColor: '#F4F4F4',
    padding: width * 0.05,
    flex: 1,
  },
  input: {
    fontSize: width * 0.045,
    color: '#202020',
    backgroundColor: '#F4F4F4',
    paddingVertical: height * 0.022,
    paddingHorizontal: width * 0.04,
    borderRadius: 4,
    borderColor: '#CECECE',
    borderWidth: 1,
    marginBottom: height * 0.03,
    fontFamily:'Lato-Regular'
  },
  disabledInput: {
    backgroundColor: '#F4F4F4',
    color: '#202020',
  },
  saveButtonContainer: {
    backgroundColor: '#FFF', 
    padding: width * 0.025,
    borderTopWidth: 1,
    borderTopColor: '#CECECE',
  },
  saveButton: {
    backgroundColor: '#1B2F2E',
    padding: width * 0.04,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#D6B06B',
    fontSize: width * 0.048,
    fontFamily:'Lato-Bold'
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
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    color: '#1B2F2E',
    fontFamily: 'Lato-Bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#838383',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#1B2F2E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  modalButtonText: {
    color: '#D6B06B',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderColor:'#1B2F2E',
    borderWidth:1,
    borderRadius:4
  },
  deleteButton: {
    backgroundColor: '#1B2F2E',
    borderColor:'#1B2F2E',
    borderWidth:1,
    borderRadius:4
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancel:{
    color:'#202020',
    fontSize:16,
    fontFamily:'Lato-Regular',
  },
  delete:{
    color:'#FFFFFF',
    fontSize:16,
    fontFamily:'Lato-Regular',
  },
  inputEditing: {
    borderColor: '#1B2F2E', 
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1F24',
    padding: height * 0.010,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    width: width * 1.0, 
    height: height * 0.1,
 
  },
  errorMessage: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default UpdateVendor;
