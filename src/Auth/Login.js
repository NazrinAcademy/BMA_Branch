import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Image,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';
import { loginUser } from '../Api/apiService'; 

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation(); 
  const isFocused = useIsFocused(); 

  useEffect(() => {
    if (isFocused) {
      setUsername('');
      setPassword('');
      setErrorMessage('');
    }
  }, [isFocused]); 

  const handlePasswordChange = (text) => {
    setPassword(text);
    setErrorMessage(''); 
  };

  const handleLogin = async () => {
    let errors = [];
    
    if (!username) {
      errors.push('Please enter username');
    }
    
    if (!password) {
      errors.push('Please enter password');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
  
    if (errors.length > 0) {
      setErrorMessage(errors.join(' & '));
      
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      try {
        setErrorMessage('');  
  
        
        const loginData = await loginUser(username, password);  
  
        if (loginData && loginData.success) {
          setIsModalVisible(true);
        } else {
          setErrorMessage('Invalid username or password');
          
          setTimeout(() => {
            setErrorMessage(''); 
          }, 3000);
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        
        setTimeout(() => {
          setErrorMessage('');  
        }, 3000);
      }
    }
  };
  

  const closeModal = () => {
    setIsModalVisible(false);
    navigation.navigate('home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Nature's Craft Awaits!</Text>
      <Text style={styles.subtitle}>
        Log in to access a world of timeless wooden products crafted with care and sustainability in mind
      </Text>

      <View
        style={[styles.inputContainer, activeField === 'username' && styles.activeInputContainer]}
      >
        <User size={24} color="rgba(131, 131, 131, 1)" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={activeField === 'username' ? '' : 'User Name'}
          placeholderTextColor="rgba(131, 131, 131, 1)"
          value={username}
          onFocus={() => setActiveField('username')}
          onBlur={() => setActiveField(null)}
          onChangeText={(text) => {
            setUsername(text);
            setErrorMessage(''); 
          }}
        />
        {activeField === 'username' && (
          <Text style={styles.fieldsetLabel}>User Name</Text>
        )}
      </View>

      <View
        style={[styles.inputContainer, activeField === 'password' && styles.activeInputContainer]}
      >
        <Lock size={24} color="rgba(131, 131, 131, 1)" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={activeField === 'password' ? '' : 'Password'}
          placeholderTextColor="rgba(131, 131, 131, 1)"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onFocus={() => setActiveField('password')}
          onBlur={() => setActiveField(null)}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? (
            <EyeOff size={24} color="#202020" />
          ) : (
            <Eye size={24} color="#202020" />
          )}
        </TouchableOpacity>
        {activeField === 'password' && (
          <Text style={styles.fieldsetLabel}>Password</Text>
        )}
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessageText}>{errorMessage}</Text>
        </View>
      ) : null}

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
              source={require('../asset/images/success.png')}
              style={styles.successImage}
            />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>Login successful! Welcome back to Wood Jungle!</Text>
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
    paddingHorizontal: width * 0.07,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Lato-Regular',
    color: 'rgba(32, 32, 32, 1)',
    marginBottom: height * 0.02,
    lineHeight: 32,
    top: 94,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    color: 'rgba(131, 131, 131, 1)',
    marginBottom: height * 0.03,
    lineHeight: 21,
    top: 104,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CECECE',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.03,
    height: height * 0.07,
    top: 127,
    position: 'relative',
  },
  activeInputContainer: {
    borderColor: '#1B2F2E', 
  },
  icon: {
    marginRight: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#202020',
    fontFamily: 'Lato-Regular',
    paddingVertical: Platform.OS === 'ios' ? height * 0.015 : 0,
  },
  fieldsetLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    color: '#838383', 
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 5,
  },
  loginButton: {
    backgroundColor: 'rgba(27, 47, 46, 1)',
    borderRadius: 4,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginBottom: height * 0.03,
    width: '100%',
    top: 135,
  },
  loginButtonText: {
    color: 'rgba(214, 176, 107, 1)',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    lineHeight: 20,
  },
  errorMessageContainer: {
    position: 'absolute',
    bottom: 5, 
    backgroundColor: '#1E1F24', 
    borderColor: 'rgba(30, 31, 36, 1)', 
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width:360,
    height:60
  },
  errorMessageText: {
    color: '#FFFFFF',
    fontSize: 12,
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
});

export default Login;
