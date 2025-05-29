  import React, { useState, useRef } from 'react';
  import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing,
    Modal,
    Image,
    Alert,
  } from 'react-native';
  import { ArrowLeft, Pencil, ChevronDown, Trash2 } from 'lucide-react-native';
  import { deleteSales, updateSales } from '../../Utils/apiService';

  const { width, height } = Dimensions.get('window');

  const UpdateMember = ({ navigation, route }) => {

    if (!route || !route.params) {
      console.error("Route or params is undefined!");
      return null; // Prevent component from rendering if no params
    }

    console.log("Route Params:", route.params);

    // Extract member details from params (Ensure fallback values)
    const member = route.params.member || {};
    const initialRole = route.params.role || "Sales Man";   
    // console.log(member._id);
    

    const [name, setName] = useState(member.name);
    const [email, setEmail] = useState(member.email);
    const [phonenumber, setPhonenumber] = useState(member.phonenumber);
    const [password, setPassword] = useState(member.password);
    const [id, setId] = useState(member._id);

    const [isEditMode, setIsEditMode] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [role, setRole] = useState(initialRole);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
      if (route.params?.member) {
        const { _id, name, email, phonenumber, role } = route.params.member;
        setId(_id || '');
        setName(name || '');
        setEmail(email || '');
        setPhonenumber(phonenumber || '');
        setRole(role || 'Sales Man');
        console.log("Updated State:", { _id, name, email, phonenumber, role });
      }
    }, [route.params]);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleSave = () => {
      console.log({ role, name, email, phonenumber, password });
      setIsEditMode(true);
    };

    const handleUpdate =async () => {
      console.log('Update clicked:', { id,name, email, phonenumber });
      try {
        const  result=updateSales(id,name, email, phonenumber)
        console.log(result);
        
      setSuccessMessage(`details updated successfully!`);
      setIsModalVisible(true);
        
      } catch (error) {
        console.log(error);
        
      }

    };

    const toggleOverlay = () => {
      if (showOverlay) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => setShowOverlay(false));
      } else {
        setShowOverlay(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    };

    const handleSelectRole = (selectedRole) => {
      setRole(selectedRole);
      toggleOverlay();
    };

    const closeModal = () => {
      setIsModalVisible(false);
      navigation.goBack();
    };

    const handleDelete = () => {
      setIsDeleteModalVisible(true);
    };

    const confirmDelete = () => {
      console.log(`Delete clicked ${id}` );
    try {
        const  result=deleteSales(id)
        console.log(result);
        setIsDeleteModalVisible(false);
        navigation.goBack();
      
        
      } catch (error) {
        console.log(error);
        
      }

  
    };

    const cancelDelete = () => {
      setIsDeleteModalVisible(false);
    };

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              isEditMode && { textAlign: 'center', flex: 1 },
            ]}
          >
            {isEditMode ? `Update ${role}` : 'Member'}
          </Text>
          {!isEditMode && (
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={handleDelete}>
                <Trash2 size={24} color="#202020" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Pencil size={24} color="#202020" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.form}>
          {/* <TouchableOpacity
            style={styles.inputContainer}
            onPress={toggleOverlay}
            disabled={!isEditMode}
          >
            <TextInput
              style={[
                styles.input,
                styles.dropdownInput,
                isEditMode && { borderColor: '#202020' },
              ]}
              value={role}
              editable={false}
              placeholder="Select Role"
            />
            <ChevronDown size={24} color="#202020" style={styles.iconInsideInput} />
          </TouchableOpacity> */}

          {/* Name Field */}
          <TextInput
            style={[styles.input, isEditMode && { borderColor: '#000' }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter Name"
            placeholderTextColor="#838383"
            editable={isEditMode}
          />

          {/* Email Field */}
          <TextInput
            style={[styles.input, isEditMode && { borderColor: '#000' }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Email"
            placeholderTextColor="#838383"
            editable={isEditMode}
          />

          {/* phonenumber Field */}
          <TextInput
            style={[styles.input, isEditMode && { borderColor: '#000' }]}
            value={phonenumber}
            onChangeText={setPhonenumber}
            placeholder="Enter Phone"
            placeholderTextColor="#838383"
            editable={isEditMode}
          />

          {/* Password Field */}
          {/* <TextInput
            style={[styles.input, isEditMode && { borderColor: '#000' }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter Password"
            secureTextEntry
            editable={isEditMode}
          /> */}
        </View>

        {/* Update Button Container */}
        {isEditMode && (
          <View style={styles.updateButtonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={styles.updateButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Role Selection Overlay */}
        {isEditMode && showOverlay && (
          <Animated.View
            style={[
              styles.overlayContainer,
              { opacity: fadeAnim }, // Apply fade animation
            ]}
          >
            <TouchableOpacity
              style={styles.overlayBackground}
              activeOpacity={1}
              onPress={toggleOverlay}
            >
              <View style={styles.overlay}>
                <Text style={styles.overlayHeaderText}>Select Role</Text>
                {['Sales Man', 'Production', 'Logistics', 'AC 1', 'AC 2'].map((roleOption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.overlayItem}
                    onPress={() => handleSelectRole(roleOption)}
                  >
                    <Text style={styles.overlayText}>{roleOption}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Animated.View>
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
                  <Text style={[styles.modalButtonText,styles.cancel]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={confirmDelete}>
                  <Text style={[styles.modalButtonText,styles.delete]}>Delete</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.04,
    
  },
  headerText: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#000',
    fontFamily:'Lato-Bold',
  },
  form: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: width * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    fontSize: width * 0.045,
    color: '#202020',
    backgroundColor: '#F4F4F4',
    paddingVertical: height * 0.020,
    paddingHorizontal: width * 0.04,
    borderRadius: 4,
    borderColor: '#CECECE',
    borderWidth: 1,
    marginBottom: height * 0.04,
    fontFamily:'Lato-Regular'
  },
  inputContainer: {
    position: 'relative',
  },
  dropdownInput: {
    paddingRight: width * 0.1,
  },
  iconInsideInput: {
    position: 'absolute',
    right: width * 0.04,
    top: height * 0.02,
  },
  updateButtonContainer: {
    backgroundColor: '#FFF', 
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#CECECE',
  },
  updateButton: {
    backgroundColor: '#1B2F2E',
    padding: width * 0.04,
    borderRadius: 4,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#D6B06B',
    fontSize: width * 0.048,
    fontFamily:'Lato-Bold'
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, 
  },
  overlayBackground: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end', 
  },
  overlay: {
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: width * 0.05,
  },
  overlayItem: {
    paddingVertical: height * 0.02,
  },
  overlayText: {
    fontSize: width * 0.045,
    color: '#202020',
    fontFamily: 'Lato-Regular',
  },
  overlayHeaderText: {
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2, 
    height: height * 0.003, 
    borderRadius: width * 0.01,
    alignSelf: 'center',
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
});

export default UpdateMember;