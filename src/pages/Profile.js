import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { User, Mail, Phone, Camera, ArrowLeft, Image as ImageIcon, X } from 'lucide-react-native';
import ImagePicker from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [name, setName] = useState('Michael');
  const [phone, setPhone] = useState('9876543212');
  const [email, setEmail] = useState('michael@gmail.com');
  const [isEditing, setIsEditing] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false); // State for full-screen image modal
  const [isCameraModalVisible, setCameraModalVisible] = useState(false); // State for camera/gallery modal

  // Function to handle image upload
  const handleImageUpload = () => {
    setCameraModalVisible(true); // Open camera/gallery modal
  };

  // Function to handle image selection from camera or gallery
  const handleImageSelection = (source) => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    if (source === 'camera') {
      ImagePicker.launchCamera(options, (response) => {
        if (!response.didCancel && !response.error) {
          setProfileImage(response.uri);
        }
      });
    } else if (source === 'gallery') {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (!response.didCancel && !response.error) {
          setProfileImage(response.uri);
        }
      });
    }

    setCameraModalVisible(false); // Close the modal after selection
  };

  // Function to handle save action
  const handleSave = () => {
    setIsEditing(false);
    // Save logic here (e.g., API call to update profile)
  };

  // Function to handle back navigation
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={24} color="#202020" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.editButton}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <View style={styles.profileContent}>
        {/* Profile Image Section */}
        <TouchableOpacity onPress={() => setImageModalVisible(true)} style={styles.profileImageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage } // Display selected image
                : require('../asset/images/profile.jpg') // Display default icon
            }
            style={styles.profileImage}
          />
          <TouchableOpacity onPress={handleImageUpload} style={styles.cameraIcon}>
            <Camera size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Editable Fields */}
        <View style={styles.userInfo}>
          <View style={styles.iconContainer}>
            <User size={24} color="#000" />
          </View>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
            />
          ) : (
            <Text style={styles.userInfoText}>{name}</Text>
          )}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.iconContainer}>
            <Phone size={24} color="#000" />
          </View>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.userInfoText}>{phone}</Text>
          )}
        </View>

        <View style={styles.userInfo}>
          <View style={styles.iconContainer}>
            <Mail size={24} color="#000" />
          </View>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.userInfoText}>{email}</Text>
          )}
        </View>
      </View>

      {/* Save Button at Bottom */}
      {isEditing && (
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Full-Screen Image Modal */}
      <Modal visible={isImageModalVisible} transparent={true}>
        <View style={styles.fullScreenImageModal}>
          {/* Header for Full-Screen Image Modal */}
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.headerIcon}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.fullScreenHeaderText}>Profile Photo</Text>
          </View>

          {/* Full-Screen Image */}
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../asset/images/profile.jpg')
            }
            style={styles.fullScreenImage}
          />
        </View>
      </Modal>

      {/* Camera/Gallery Modal */}
      <Modal visible={isCameraModalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setCameraModalVisible(false)}>
          <View style={styles.cameraModalOverlay}>
            <View style={styles.cameraModalContainer}>
              {/* Camera Option */}
              <TouchableOpacity
                style={styles.cameraModalOption}
                onPress={() => handleImageSelection('camera')}
              >
                <Camera size={24} color="#1E1F24" />
                <Text style={styles.cameraModalText}>Camera</Text>
              </TouchableOpacity>

              {/* Gallery Option */}
              <TouchableOpacity
                style={styles.cameraModalOption}
                onPress={() => handleImageSelection('gallery')}
              >
                <ImageIcon size={24} color="#1E1F24" />
                <Text style={styles.cameraModalText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: height * 0.12,
  },
  headerText: {
    fontSize: width * 0.055,
    color: '#1E1F24',
    fontFamily: 'Lato-Bold',
  },
  editButton: {
    borderRadius: 5,
  },
  editText: {
    fontSize: width * 0.05,
    color: '#007AFF',
    fontFamily: 'Lato-Bold',
  },
  profileContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1B2F2E',
    borderRadius: 18,
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginRight: 10,
  },
  userInfoText: {
    fontSize: 16,
    flex: 1,
    fontFamily: 'Lato-Regular',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  fullScreenImageModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullScreenHeaderText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Lato-Bold',
    marginLeft: 16,
  },
  fullScreenImage: {
    width: width,
    height: width,
    resizeMode: 'contain',
    marginTop: height * 0.2,
  },
  cameraModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cameraModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  cameraModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cameraModalText: {
    fontSize: 16,
    color: '#1E1F24',
    fontFamily: 'Lato-Regular',
    marginLeft: 16,
  },
});

export default Profile;