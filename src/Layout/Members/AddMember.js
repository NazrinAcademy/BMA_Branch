import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ArrowLeft, Eye, EyeOff } from 'lucide-react-native'; 
import { addAc1, addAc2, addMember, addProduction, addQc, addSales } from '../../Utils/apiService'; 

const { width, height } = Dimensions.get('window');

const AddMember = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [activeInput, setActiveInput] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(''); 
  const navigation = useNavigation();

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setShowOverlay(false);
  };

  const handleShowOverlay = () => {
    setShowOverlay(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    console.log("role",role);
    
    if(role==="Qc"){
      console.log("it is Qc");
      
    }
    else{
      console.log("no qc");
      
    }
    console.log("handleSubmit qc");
    
    setErrorMessage('');
    setFieldError('');

    if (!name || !email || !phonenumber || !password || !role) {
      setErrorMessage('Please fill all fields');
    } else if (!role) {
      setFieldError('Please select a Role');
    } else {
      

      try {
        //'Production', 'QC', 'AC 1', 'AC 2'

        if(role==='Sales Man'){
          const result=await addSales(name,email,phonenumber,password)
          console.log(result);
        }
        if(role==='Production'){
          const result=await addProduction(name,email,phonenumber,password)
          console.log(result);
        }
        if(role==='QC'){
          console.log("qcif");
          console.log("qc name,email,phonenumber,password ",name,email,phonenumber,password);
          
          
          const results=await addQc(name,email,phonenumber,password)
          console.log(results);
          
        }
        if(role==='AC1'){
          const result=await addAc1(name,email,phonenumber,password)
          console.log(result);
        }
        if(role==='AC2'){
          const result=await addAc2(name,email,phonenumber,password)
          console.log(result);
        }
         
        setSuccessMessage(`${role} added successfully!`);
        setIsModalVisible(true);
        setName('');
        setEmail('');
        setPhonenumber('');
        setPassword('');
        setRole('');
      } catch (error) {
        setErrorMessage('Failed to add member. Please try again later.');
      }
    }
    setTimeout(() => {
      setErrorMessage('');
      setFieldError('');
    }, 3000);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.navigate('Navbaritemadmin');
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}
    >
      <View style={[styles.dimBackground, showOverlay && styles.dim]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Members</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.formGroup}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.inputContainer, styles.inputWithBorder]}>
            <TouchableOpacity
              style={styles.roleInput}
              onPress={handleShowOverlay}
            >
              <Text
                style={[
                  styles.roleText,
                  {
                    color: role ? '#000' : '#838383',
                  },
                ]}
              >
                {role || 'Role'}
              </Text>
              <ChevronDown size={20} color="#202020" style={styles.icon} />
            </TouchableOpacity>
          </View>
          {['Name', 'Email', 'phonenumber ', 'Password'].map((field, index) => (
            <View key={index} style={styles.fieldsetContainer}>
              <View style={styles.fieldset}>
                {activeInput === field || (field === 'Name' && name) ||
                (field === 'Email' && email) ||
                (field === 'phonenumber ' && phonenumber) ||
                (field === 'Password' && password) ? (
                  <Text style={styles.fieldsetLegend}>{field}</Text>
                ) : null}

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder={activeInput !== field ? field : ''}
                    style={[
                      styles.input,
                      styles.inputWithBorder,
                      activeInput === field && styles.activeInput,
                      (field === 'Name' && !name) ||
                      (field === 'Email' && !email) ||
                      (field === 'phonenumber ' && !phonenumber) ||
                      (field === 'Password' && !password)
                        ? styles.inputError
                        : null,
                    ]}
                    placeholderTextColor="#838383"
                    secureTextEntry={field === 'Password' && !isPasswordVisible}
                    keyboardType={
                      field === 'Email'
                        ? 'email-address'
                        : field === 'phonenumber '
                        ? 'phonenumber-pad'
                        : 'default'
                    }
                    onFocus={() => setActiveInput(field)}
                    onBlur={() => setActiveInput(null)}
                    value={
                      field === 'Name'
                        ? name
                        : field === 'Email'
                        ? email
                        : field === 'phonenumber '
                        ? phonenumber
                        : password
                    }
                    onChangeText={
                      field === 'Name'
                        ? setName
                        : field === 'Email'
                        ? setEmail
                        : field === 'phonenumber '
                        ? setPhonenumber
                        : setPassword
                    }
                  />
                  {field === 'Password' && (
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIconContainer}
                    >
                      {isPasswordVisible ? (
                        <EyeOff size={20} color="#202020" />
                      ) : (
                        <Eye size={20} color="#202020" />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showOverlay && (
        <Animated.View
          style={[
            styles.overlayContainer,
            { opacity: fadeAnim },
          ]}
        >
          <View style={styles.overlay}>
            <Text style={styles.overlayHeaderText}></Text>
            {['Sales Man','Production','QC', 'AC 1', 'AC 2'].map((roleOption, index) => (
              <TouchableOpacity
                key={index}
                style={styles.overlayItem}
                onPress={() => handleSelectRole(roleOption)}
              >
                <Text style={styles.overlayText}>{roleOption}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      {(errorMessage || fieldError) && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{errorMessage || fieldError}</Text>
        </View>
      )}

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
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  dimBackground: {
    flex: 1,
  },
  dim: {
     backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
  formGroup: {
    padding: width * 0.05,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: height * 0.02,
    position: 'relative',
  },
  roleInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: width * 0.04,
    
  },
  icon: {
    marginLeft: width * 0.02,
  },
  roleText: {
    fontSize: width * 0.04,
    color: '#202020',
    fontFamily: 'Lato-Regular',
  },
  input: {
    color:'#000',
    padding: width * 0.04,
    fontSize: width * 0.04,
    borderRadius: 4,
    marginBottom: height * 0.01,
    fontFamily: 'Lato-Regular',
  },
  inputWithBorder: {
    borderWidth: 1,
    borderColor: '#CECECE',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  registerButton: {
    backgroundColor: '#1B2F2E',
    padding: width * 0.05,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'rgba(214, 176, 107, 1)',
    fontSize: width * 0.045,
    fontFamily: 'Lato-Bold',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.4, 
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: width * 0.06, 
    borderTopRightRadius: width * 0.06,
    padding: width * 0.05,
    minHeight: height * 0.35,
  },
  overlayHeaderText: {
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2, 
    height: height * 0.003, 
    borderRadius: width * 0.01,
    alignSelf: 'center',
  },
  overlayItem: {
    paddingVertical: height * 0.02,
  },
  overlayText: {
    fontSize: width * 0.045, 
    fontFamily: 'Lato-Regular',
    color: '#202020', 
  },
  iconContainer: {
    marginBottom: height * 0.025, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldsetContainer: {
    marginVertical: 8,
    position: 'relative',
  },
  fieldset: {
    borderColor: '#1B2F2E',
    borderRadius: 4,
    paddingVertical: Platform.OS === 'ios' ? 5 : 0,
    position: 'relative',
  },
  fieldsetLegend: {
    position: 'absolute',
    top: -8,
    left: 18,
    backgroundColor: '#F4F4F4',
    color: '#838383',
    fontSize: 12,
    paddingHorizontal: 4,
    fontFamily: 'Lato-Regular',
    zIndex: 1,
  },
  activeInput: {
    borderColor: '#1B2F2E',
  },
  errorMessageContainer: {
    position: 'absolute',
    bottom: height * 0.02, 
    backgroundColor: '#1E1F24',
    borderColor: 'rgba(30, 31, 36, 1)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 1.0, 
    height: height * 0.1, 
    
  },
  errorMessageText: {
    color: '#FFFFFF',
    fontSize: width * 0.05, 
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
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  inputWrapper: {
    position: 'relative',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
    top:15
  },
});

export default AddMember;
