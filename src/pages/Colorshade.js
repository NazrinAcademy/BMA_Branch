import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { ChevronDown, Upload, ArrowLeft, ImagePlus } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const productData = [
    'Membrane Doors',
    '2D Membrane Doors',
    '3D Membrane Doors',
    'Membrane Brass Doom Doors',
    'Membrane Double Doors',
    'Micro Coated Doors',
    'Steel Beading Doors',
    'Laminates Doors',
    'UV Digital Doors',
    'Laminates Embossed Doors',
  ];
const Colorshade = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [productType, setProductType] = useState('');
  const [membraneShade, setMembraneShade] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [colorShadeVisible, setColorShadeVisible] = useState(false);
  const [colorShades, setColorShades] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const colorFadeAnim = useState(new Animated.Value(0))[0];

  const handleImageUpload = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else {
        const pickedImage = response.assets[0].uri;
        setImage(pickedImage);
      }
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const showOverlay = () => {
    setOverlayVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideOverlay = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setOverlayVisible(false));
  };

  const showColorShadeOverlay = () => {
    if (productType) {
      setColorShades(productData[productType]); 
      setColorShadeVisible(true);
      Animated.timing(colorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const hideColorShadeOverlay = () => {
    Animated.timing(colorFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setColorShadeVisible(false));
  };

  const calculateOverlayHeight = (numberOfItems) => {
    const itemHeight = 100; 
    const maxHeight = height * 0.5; 
    const columns = 4; 
    const rows = Math.ceil(numberOfItems / columns); 
    const calculatedHeight = rows * itemHeight + 70; 
    return calculatedHeight > maxHeight ? maxHeight : calculatedHeight;
  };

  const renderColorShadeItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.colorShadeItem}
        onPress={() => {
          setMembraneShade(item.color);
          hideColorShadeOverlay();
        }}
      >
        <Image source={item.image} style={styles.colorShadeImage} />
        <Text style={styles.colorShadeText}>{item.color}</Text>
      </TouchableOpacity>
    );
  };

  const handleProductTypeChange = (type) => {
    setProductType(type);
    setMembraneShade(''); 
    hideOverlay();
  };

  return (
    <View style={styles.container}>
      {(overlayVisible || colorShadeVisible) && (
        <View style={styles.dimOverlay} />
      )}

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Color Shade</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <TouchableOpacity style={styles.inputWithIcon} onPress={showOverlay}>
            <TextInput
              style={styles.inputWithIconField}
              placeholder="Product Type"
              placeholderTextColor="#838383"
              value={productType}
              editable={false}
            />
            <ChevronDown size={24} color="#202020" style={styles.inputIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputWithIcon} onPress={showColorShadeOverlay}>
            <TextInput
              style={styles.inputWithIconField}
              placeholder="Membrane Color Shade"
              placeholderTextColor="#838383"
              value={membraneShade}
              editable={false}
            />
           
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBox} onPress={handleImageUpload}>
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadedImage} />
            ) : (
              <>
                <ImagePlus size={24} color="#838383" style={styles.inputIcon} />
                <Text style={styles.uploadText}>Upload Image</Text>
                <Text style={styles.uploadSubText}>JPG or PNG / Max. File Size 60MB</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={overlayVisible} onRequestClose={hideOverlay}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Text style={styles.overlayHeaderText}>Select color shade</Text>
        <Text style={styles.overlayHeader}>Product Type</Text>
                {productData.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={styles.overlayItem}
              onPress={() => handleProductTypeChange(type)}
            >
              <Text style={styles.overlayText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Modal>

      <Modal transparent={true} visible={colorShadeVisible} onRequestClose={hideColorShadeOverlay}>
        <Animated.View style={[styles.overlay, { opacity: colorFadeAnim, height: calculateOverlayHeight(colorShades.length) }]}>
        <Text style={styles.overlayHeaderText}>Select color shade</Text>
          <Text style={styles.overlayHeader}>Color Shade</Text>
          <FlatList
            data={colorShades}
            renderItem={renderColorShadeItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
            contentContainerStyle={styles.gridContainer}
            scrollEnabled={false}
          />
        </Animated.View>
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
    fontFamily: 'Lato-Bold',
  },
  form: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: width * 0.04,
  },
  input: {
   
    borderWidth: 1,
    borderColor: '#CECECE',
    borderRadius: width * 0.01,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: '#202020',
    marginBottom: width * 0.05,
    paddingVertical: width * 0.04,
    fontFamily:'Lato-Regular'
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CECECE',
    borderRadius: width * 0.01,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.01,
    marginBottom: width * 0.05,
  },
  inputWithIconField: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#202020',
    paddingVertical: height * 0.015,
    fontFamily:'Lato-Regular'
  },
  inputIcon: {
    marginLeft: width * 0.02,
  },
  dropdownSmall: {
    marginHorizontal: width * 0.01,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.03, 
  },
  inputWithIconSmall: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CECECE',
    borderRadius: width * 0.01,
    paddingHorizontal: width * 0.03,
    marginHorizontal: width * 0.01,
    paddingVertical: width * 0.01,
    marginBottom: width * 0.04, 
    fontFamily:'Lato-Italic',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#CECECE',
    borderStyle: 'dashed',
    borderRadius: width * 0.01,
    padding: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: width * 0.04,
    height: height * 0.2,
  },
  uploadedImage: {
    width: 24,
    height: 32,
    borderRadius: width * 0.02,
  },
  uploadText: {
    fontSize: width * 0.04,
    color: '#999',
    marginTop: width * 0.02,
  },
  uploadSubText: {
    fontSize: width * 0.03,
    color: '#999',
  },
  saveContainer: {
    backgroundColor: '#FFF',
    padding: width * 0.05,
  },
  saveButton: {
    backgroundColor: '#1B2F2E',
    paddingVertical: height * 0.020,
    borderRadius: width * 0.01,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: width * 0.050,
    color: '#D6B06B',
    fontFamily:'Lato-Bold'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height:height* 0.65,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: height * 0.030,
    paddingVertical: height * 0.020,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
//   overlayItem: {
//     paddingVertical: height * 0.02,
//   },
  overlayText: {
    fontSize: 16,
    color: '#202020',
    fontFamily:'Lato-Regular',
    paddingVertical: height * 0.014,

  },
  overlayHeaderText: {
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2, 
    height: height * 0.003, 
    borderRadius: width * 0.01,
    alignSelf: 'center',
    marginBottom:10
  },
  overlayHeader:{
    textAlign:'center',
    fontSize:16,
    fontFamily:'Lato-Bold',
    paddingVertical:height * 0.008,
    color:'#202020',

  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
  },
  colorShadeItem: {
    width: (width * 0.9) / 4 - width * 0.01,
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  colorShadeImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    marginBottom: height * 0.005,
  },
  colorShadeText: {
    fontSize: width * 0.035,
    color: '#202020',
    textAlign: 'center',
    fontFamily:'Lato-Regular'
  },
  
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    zIndex: 1, 
  },
});

export default Colorshade;
