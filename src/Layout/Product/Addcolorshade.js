import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Modal, Animated,
} from 'react-native';
import { ChevronDown, Upload, ArrowLeft, ImagePlus, X } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { readFile } from "react-native-fs";
import { addColorshade } from '../../Utils/apiService';

const { width, height } = Dimensions.get('window');

const productData = [
  'Membrane Doors',
  '2D Membrane Doors',
  '3D Membrane Doors',
  'Membrane Brass Doom Doors',
  'Membrane Double Doors',
 
];
export const Addcolorshades = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [imageuri, setImageuri] = useState(null);

  const [imageName, setImageName] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [productType, setProductType] = useState('');
  const [membraneShade, setMembraneShade] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [success, setSuccess] = useState(false);
  const [colorshades, setData] = useState([]);
  
  const [showAll, setShowAll] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);


  const handleImageUpload = () => {
    const options = { mediaType: "photo", quality: 1, includeBase64: true };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("Image Picker Error: ", response.errorMessage);
      } else {
        console.log("images in upload section",response.assets);

        const pickedImage = response.assets[0];
        setImage(`data:image/jpeg;base64,${pickedImage.base64}`);
        setImageuri(pickedImage.uri)

        setImageName(pickedImage.fileName || "Uploaded Image");
        setImageSize((pickedImage.fileSize / (1024 * 1024)).toFixed(2) + " MB");
        setSuccess(true);
        
      }
    });
  };
  const removeImage = () => {
    setImage(null);
    setImageName("");
    setImageSize("");
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


  const handleSuccessClick = () => {
    console.log('handleSuccessClick');
    
    const newData = [...colorshades, { colorshadename: membraneShade, colorshadeimage: image,imageuri:imageuri }];
    setData(newData);
    if(newData[0]!==""||newData[1]!==""){
      for (const key in newData) {
        if (Object.prototype.hasOwnProperty.call(newData, key)) {
          const element = newData[key];
          console.log("element",element);
          
        }
      }
      console.log('first data',newData[0]);
      console.log('second data',newData[1]);

      
    }

    console.log("newDatas", newData[1]);
    setMembraneShade('');
    setImage(null);
    setImageName('');
    setImageSize('');
    setSuccess(false);
  };
  useEffect(() => {
    if (success) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [success]);

  const handleSeeAllClick = () => {
    setShowAll(showAll);
  };
  const displayedData = showAll ? colorshades: colorshades.slice(0, 4);

  const handleSave = () => {
    setShowConfirmationModal(true);
  };

  const handleModalResponse = (response) => {
    setShowConfirmationModal(false);

    
    if (response === "no") {
      setProductType("");
      setMembraneShade("");
      setImage(null);
      setImageName("");
      setImageSize("");
    }
  };
  
  const handleModalResponses =async (response) => {
   try {
    if(productType!==""){
    console.log("productType",productType);
    console.log("colorshades",colorshades);
    const result=await addColorshade(productType,colorshades)
    console.log("result handleModalResponses",result);
    
    }
    else{
      console.log("no productype");
      
    }
      

  
    if (response === "no") {
      setShowConfirmationModal(false);
      setModalVisible(true); 
    }
   } catch (error) {
    
   }
  };

  const closeModal = () => {
    setModalVisible(false); 
  };
  return (
    <View style={styles.container}>
      {(overlayVisible) && <View style={styles.dimOverlay} />}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Color Shade</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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


          <TextInput
            style={styles.input}
            placeholder=" Color Shade"
            placeholderTextColor="#838383"
            value={membraneShade}
            onChangeText={setMembraneShade}
          />

          <TouchableOpacity style={styles.uploadBox} onPress={handleImageUpload}>
            {image ? (
              <View style={styles.uploadedContainer}>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <View style={styles.uploadedDetails}>
                  <Text style={styles.imageName}>{imageName}</Text>
                  <Text style={styles.imageSize}>{imageSize}</Text>
                </View>
                <TouchableOpacity onPress={removeImage}>
                  <X size={20} color="red" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <ImagePlus size={24} color="#838383" style={styles.inputIcon} />
                <Text style={styles.uploadText}>Upload Image</Text>
                <Text style={styles.uploadSubText}>JPG or PNG / Max. File Size 60MB</Text>
              </>
            )}
          </TouchableOpacity>


          {success && (
            <Modal transparent={true} visible={success} onRequestClose={() => setSuccess(false)}>
              <Animated.View style={[styles.successModal, { opacity: fadeAnim }]}>
                <View style={styles.modalContent}>

                  <TouchableOpacity onPress={handleSuccessClick} style={styles.successButton}>
                    <Text style={styles.successButtonText}>Add Color Shade</Text>
                    <TouchableOpacity onPress={() => setSuccess(false)}>
                      <X size={24} color="black" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </Modal>
          )}
        </View>
      </ScrollView>
      <ScrollView style={styles.scrollView}>
        {showAll && (
          <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllClick}>
            <Text style={styles.seeAllButtonText}>See All</Text>
          </TouchableOpacity>
        )}
        <View style={styles.dataContainer}>
          {displayedData.map((item, index) => (
            <View key={index} style={styles.dataRow}>
              <View style={styles.dataItem}>
                <Image source={{ uri: imageuri }} style={styles.storedImage} />
                <Text style={styles.colorShadeText}>{item.colorshadename}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>


      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={showConfirmationModal} onRequestClose={() => setShowConfirmationModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Would you like to include any additional color shades for this product type?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleModalResponse("yes")}>
                <Text style={styles.modalButtonText}>ADD Color</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => handleModalResponses("no")}>
                <Text style={styles.closeButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={overlayVisible} onRequestClose={hideOverlay}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Text style={styles.overlayHeader}>Select Product Type</Text>
          {productData.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={styles.overlayItem}
              onPress={() => {
                setProductType(type);
                hideOverlay();
              }}
            >
              <Text style={styles.overlayText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Modal>

      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlaysuccess}>
          <View style={styles.modalContentsuccess}>
            <Image source={require('../../asset/images/success.png')} style={styles.successImagesuccess} />
            <Text style={styles.modalTitlesuccess}>Success</Text>
            <Text style={styles.modalMessagesuccess}>
              Color shade added successfullly.
            </Text>
            <TouchableOpacity style={styles.modalButtonsuccess} onPress={closeModal}>
              <Text style={styles.modalButtonTextsuccess} onPress={()=>{navigation.navigate('Colorlist')}}>Continue</Text>
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
    fontFamily: 'Lato-Regular'
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
    fontFamily: 'Lato-Regular'
  },
  inputIcon: {
    marginLeft: width * 0.02,
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
    fontFamily: 'Lato-Italic',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 5,
  },
  uploadedContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    padding: 10,
    borderRadius: 5,
  },
  uploadedImage: {
    width: width * 0.06,
    height: height * 0.05,
    marginRight: 10,
    borderRadius: 4,
  },
  uploadText: {
    color: "#838383",
    textAlign: "center",
    fontFamily: "Lato",
    fontSize: width * 0.04,
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: 14,
  },
  uploadSubText: {
    color: "#838383",
    textAlign: "center",
    fontFamily: "Lato",
    fontSize: width * 0.035,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 14,
    marginRight: 10,
  },
  imageName: { fontSize: 14, color: "#333" },
  imageSize: { fontSize: 12, color: "#777" },
  storedImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.15,
    marginBottom: height * 0.01,
  },
  uploadedDetails: {
    flex: 1,
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
    fontFamily: 'Lato-Bold'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", 
  },
  modalContainer: {
    width: width * 0.9, 
    backgroundColor: "#fff",
    padding: width * 0.04, 
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    margin: width * 0.05, 
  },
  modalText: {
    fontSize: width * 0.05, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.03, 
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
     paddingHorizontal: width * 0.05, 
    marginTop: height * 0.02, 
  },
  closeButton: {
    borderWidth: 1,
    paddingVertical: height * 0.013,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.02,
    
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: width * 0.045,
  },

  modalButton: {
    backgroundColor: '#1B2F2E',
    paddingVertical: height * 0.013,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.02,
    marginRight: width * 0.03, 
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: width * 0.045,
  },


  overlay: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.65,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: height * 0.030,
    paddingVertical: height * 0.020,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  overlayText: {
    fontSize: 16,
    color: '#202020',
    fontFamily: 'Lato-Regular',
    paddingVertical: height * 0.014,

  },
  overlayHeaderText: {
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2,
    height: height * 0.003,
    borderRadius: width * 0.01,
    alignSelf: 'center',
    marginBottom: 10
  },
  overlayHeader: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    paddingVertical: height * 0.008,
    color: '#202020',

  },

  colorShadeText: {
    fontSize: width * 0.035,
    color: '#202020',
    fontFamily: 'Lato-Regular'
  },

  successModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },

  successButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
  },
  successButtonText: {
    color: '#337BCE',
    fontSize: 16,
    fontWeight: 'bold',
  },

  dataContainer: {
    padding: width * 0.04,
    marginTop: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataRow: {
    width: width * 0.23,
    marginBottom: height * 0.02,

  },
  dataItem: {
    marginBottom: height * 0.01,
  },

  seeAllButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
  },
  seeAllButtonText: {
    color: '#fff',
    fontSize: 16,
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

  modalOverlaysuccess: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentsuccess: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: width * 0.8,
  },
  successImagesuccess: {
    width: width * 0.2,
    height: height * 0.1,
    marginBottom: height * 0.01,

  },
  modalTitlesuccess: {
    fontSize: 20,
    color: '#1B2F2E',
    fontFamily: 'Lato-Bold',
    marginBottom: height * 0.01,

  },
  modalMessagesuccess: {
    fontSize: 14,
    color: '#838383',
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginBottom: height * 0.03,

  },
  modalButtonsuccess: {
    backgroundColor: '#1B2F2E',
    paddingVertical: height*0.020,
    paddingHorizontal: width*0.070,
    borderRadius: 4,
    marginBottom: height * 0.02,
    
    
  },
  modalButtonTextsuccess: {
    color: '#D6B06B',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },

});





//backup
// import React, { useState, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Modal, Animated,
// } from 'react-native';
// import { ChevronDown, Upload, ArrowLeft, ImagePlus, X } from 'lucide-react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import { useNavigation } from '@react-navigation/native';
// import { addColorshade } from './Utils/apiService';

// const { width, height } = Dimensions.get('window');

// const productData = [
//   'Membrane Doors',
//   '2D Membrane Doors',
//   '3D Membrane Doors',
//   'Membrane Brass Doom Doors',
//   'Membrane Double Doors',
 
// ];

// const Colorshade = () => {
//   const navigation = useNavigation();
//   const [image, setImage] = useState(null);
//   const [imageName, setImageName] = useState("");
//   const [imageSize, setImageSize] = useState("");
//   const [producttype, setProductType] = useState('');
//   const [membraneShade, setMembraneShade] = useState('');
//   const [overlayVisible, setOverlayVisible] = useState(false);
//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const [success, setSuccess] = useState(false);
//   const [colorshades, setData] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [isModalVisible, setModalVisible] = useState(false);


//   const handleImageUpload = () => {
//     launchImageLibrary(
//       {
//           mediaType: 'photo',
//           includeBase64: true,  // Ensures base64 is included
//           quality: 1,
//           selectionLimit: 0,
//       },
//       (response) => {
//           if (response.didCancel) {
//               console.log('User cancelled image picker');
//           } else if (response.error) {
//               console.error('Image Picker Error: ', response.error);
//           } else {
//               const base64Images = response.assets.map(asset => ({
//                   colorShade: membraneShade,
//                   image: `data:image/jpeg;base64,${asset.base64}`
//               }));
//               console.log('Selected base64 images:', base64Images);
//               setData(prevData => [...prevData, ...base64Images]);
//           }
//       }
//   );
// };



  
//   const removeImage = () => {
//     setImage(null);
//     setImageName("");
//     setImageSize("");
//   };

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const showOverlay = () => {
//     setOverlayVisible(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const hideOverlay = () => {
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => setOverlayVisible(false));
//   };


//   const handleSuccessClick =async () => {
//     try {
//       console.log("handleSuccessClick");
      
//       const newData = [...data, { colorShade: membraneShade, image: image }];
  
    
//     setData(newData);
//     console.log(newData);
//     setMembraneShade('');
//     setImage(null);
//     setImageName('');
//     setImageSize('');
//     setSuccess(false);
//     } catch (error) {
//       console.log(error);
      
//     }
//   };
//   useEffect(() => {
//     if (success) {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//     // console.log("image,imageName,membraneShade,productType",colorshades,producttype);
    
//   }, [success]);

//   const handleSeeAllClick = () => {
//     setShowAll(showAll);
//   };
//   const displayedData = showAll ? colorshades : colorshades.slice(0, 4);

//   const handleSave = () => {
//     console.log(producttype,colorshades);
    
//     setShowConfirmationModal(true);
//   };

//   const handleModalResponse = (response) => {
//     setShowConfirmationModal(false);
//     if (response === "no") {
//       setProductType("");
//       setMembraneShade("");
//       setImage(null);
//       setImageName("");
//       setImageSize("");
//     }
//   };
// //npx react-native log-android
//   const handleModalResponses = async(response) => {
//    try {
//     console.log("handleModalResponses",colorshades,producttype);
//     const result=await addColorshade(colorshades,producttype)
//     console.log("result",result);
    
    


//     if (response === "no") {
//       setModalVisible(true); 
      
//     }
//    } catch (error) {
//     console.log(error);
    
//    }
//   };

//   const closeModal = () => {
//     setModalVisible(false); 
//   };
//   return (
//     <View style={styles.container}>
//       {(overlayVisible) && <View style={styles.dimOverlay} />}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
//           <ArrowLeft size={24} color="#1E1F24" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Color Shade</Text>
//       </View>
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <View style={styles.form}>

//           <TouchableOpacity style={styles.inputWithIcon} onPress={showOverlay}>
//             <TextInput
//               style={styles.inputWithIconField}
//               placeholder="Product Type"
//               placeholderTextColor="#838383"
//               value={producttype}
//               editable={false}
//             />
//             <ChevronDown size={24} color="#202020" style={styles.inputIcon} />
//           </TouchableOpacity>


//           <TextInput
//             style={styles.input}
//             placeholder=" Color Shade"
//             placeholderTextColor="#838383"
//             value={membraneShade}
//             onChangeText={setMembraneShade}
//           />

//           <TouchableOpacity style={styles.uploadBox} onPress={handleImageUpload}>
//             {image ? (
//               <View style={styles.uploadedContainer}>
//                 <Image source={{ uri: image }} style={styles.uploadedImage} />
//                 <View style={styles.uploadedDetails}>
//                   <Text style={styles.imageName}>{imageName}</Text>
//                   <Text style={styles.imageSize}>{imageSize}</Text>
//                 </View>
//                 <TouchableOpacity onPress={removeImage}>
//                   <X size={20} color="red" />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <>
//                 <ImagePlus size={24} color="#838383" style={styles.inputIcon} />
//                 <Text style={styles.uploadText}>Upload Image</Text>
//                 <Text style={styles.uploadSubText}>JPG or PNG / Max. File Size 60MB</Text>
//               </>
//             )}
//           </TouchableOpacity>


//           {success && (
//             <Modal transparent={true} visible={success} onRequestClose={() => setSuccess(false)}>
//               <Animated.View style={[styles.successModal, { opacity: fadeAnim }]}>
//                 <View style={styles.modalContent}>

//                   <TouchableOpacity onPress={handleSuccessClick} style={styles.successButton}>
//                     <Text style={styles.successButtonText}>Add Color Shade</Text>
//                     <TouchableOpacity onPress={() => setSuccess(false)}>
//                       <X size={24} color="black" />
//                     </TouchableOpacity>
//                   </TouchableOpacity>
//                 </View>
//               </Animated.View>
//             </Modal>
//           )}
//         </View>
//       </ScrollView>
//       <ScrollView style={styles.scrollView}>
//         {showAll && (
//           <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllClick}>
//             <Text style={styles.seeAllButtonText}>See All</Text>
//           </TouchableOpacity>
//         )}
//         <View style={styles.dataContainer}>
//           {displayedData.map((item, index) => (
//             <View key={index} style={styles.dataRow}>
//               <View style={styles.dataItem}>
//                 <Image source={{ uri: item.image }} style={styles.storedImage} />
//                 <Text style={styles.colorShadeText}>{item.colorShade}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>


//       <View style={styles.saveContainer}>
//         <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//           <Text style={styles.saveButtonText}>Save</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal transparent={true} visible={showConfirmationModal} onRequestClose={() => setShowConfirmationModal(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalText}>
//               Would you like to include any additional color shades for this product type?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.modalButton} onPress={() => handleModalResponse("yes")}>
//                 <Text style={styles.modalButtonText}>ADD Color</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.closeButton} onPress={() => handleModalResponses("no")}>
//                 <Text style={styles.closeButtonText}>Save</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <Modal transparent={true} visible={overlayVisible} onRequestClose={hideOverlay}>
//         <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
//           <Text style={styles.overlayHeader}>Select Product Type</Text>
//           {productData.map((type, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.overlayItem}
//               onPress={() => {
//                 setProductType(type);
//                 hideOverlay();
//               }}
//             >
//               <Text style={styles.overlayText}>{type}</Text>
//             </TouchableOpacity>
//           ))}
//         </Animated.View>
//       </Modal>

//       <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
//         <View style={styles.modalOverlaysuccess}>
//           <View style={styles.modalContentsuccess}>
//             {/* <Image source={require('../../asset/images/success.png')} style={styles.successImagesuccess} /> */}
//             <Text style={styles.modalTitlesuccess}>Success</Text>
//             <Text style={styles.modalMessagesuccess}>
//               The vendor has been added successfully and is now ready to be managed.
//             </Text>
//             <TouchableOpacity style={styles.modalButtonsuccess} onPress={closeModal}>
//               <Text style={styles.modalButtonTextsuccess}>Continue</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>




//     </View>
//   );
// };



// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//   },
//   headerContainer: {
//     height: height * 0.11,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   headerIcon: {
//     position: 'absolute',
//     left: width * 0.04,
//   },
//   headerText: {
//     fontSize: width * 0.05,
//     color: '#1E1F24',
//     fontFamily: 'Lato-Bold',
//   },
//   form: {
//     flex: 1,
//     backgroundColor: '#F4F4F4',
//     padding: width * 0.04,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#CECECE',
//     borderRadius: width * 0.01,
//     paddingHorizontal: width * 0.04,
//     fontSize: width * 0.04,
//     color: '#202020',
//     marginBottom: width * 0.05,
//     paddingVertical: width * 0.04,
//     fontFamily: 'Lato-Regular'
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#CECECE',
//     borderRadius: width * 0.01,
//     paddingHorizontal: width * 0.03,
//     paddingVertical: width * 0.01,
//     marginBottom: width * 0.05,
//   },
//   inputWithIconField: {
//     flex: 1,
//     fontSize: width * 0.04,
//     color: '#202020',
//     paddingVertical: height * 0.015,
//     fontFamily: 'Lato-Regular'
//   },
//   inputIcon: {
//     marginLeft: width * 0.02,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: width * 0.03,
//   },
//   inputWithIconSmall: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#CECECE',
//     borderRadius: width * 0.01,
//     paddingHorizontal: width * 0.03,
//     marginHorizontal: width * 0.01,
//     paddingVertical: width * 0.01,
//     marginBottom: width * 0.04,
//     fontFamily: 'Lato-Italic',
//   },
//   uploadBox: {
//     borderWidth: 1,
//     borderColor: "#CCC",
//     borderStyle: "dashed",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     borderRadius: 5,
//   },
//   uploadedContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EEE",
//     padding: 10,
//     borderRadius: 5,
//   },
//   uploadedImage: {
//     width: width * 0.06,
//     height: height * 0.05,
//     marginRight: 10,
//     borderRadius: 4,
//   },
//   uploadText: {
//     color: "#838383",
//     textAlign: "center",
//     fontFamily: "Lato",
//     fontSize: width * 0.04,
//     fontStyle: "normal",
//     fontWeight: "600",
//     lineHeight: 14,
//   },
//   uploadSubText: {
//     color: "#838383",
//     textAlign: "center",
//     fontFamily: "Lato",
//     fontSize: width * 0.035,
//     fontStyle: "normal",
//     fontWeight: "500",
//     lineHeight: 14,
//     marginRight: 10,
//   },
//   imageName: { fontSize: 14, color: "#333" },
//   imageSize: { fontSize: 12, color: "#777" },
//   storedImage: {
//     width: width * 0.15,
//     height: width * 0.15,
//     borderRadius: width * 0.15,
//     marginBottom: height * 0.01,
//   },
//   uploadedDetails: {
//     flex: 1,
//   },
//   saveContainer: {
//     backgroundColor: '#FFF',
//     padding: width * 0.05,
//   },
//   saveButton: {
//     backgroundColor: '#1B2F2E',
//     paddingVertical: height * 0.020,
//     borderRadius: width * 0.01,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     fontSize: width * 0.050,
//     color: '#D6B06B',
//     fontFamily: 'Lato-Bold'
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)", 
//   },
//   modalContainer: {
//     width: width * 0.9, 
//     backgroundColor: "#fff",
//     padding: width * 0.04, 
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     margin: width * 0.05, 
//   },
//   modalText: {
//     fontSize: width * 0.05, 
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: height * 0.03, 
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//      paddingHorizontal: width * 0.05, 
//     marginTop: height * 0.02, 
//   },
//   closeButton: {
//     borderWidth: 1,
//     paddingVertical: height * 0.013,
//     paddingHorizontal: width * 0.1,
//     borderRadius: width * 0.02,
    
//   },
//   closeButtonText: {
//     color: '#333',
//     fontWeight: '500',
//     fontSize: width * 0.045,
//   },

//   modalButton: {
//     backgroundColor: '#1B2F2E',
//     paddingVertical: height * 0.013,
//     paddingHorizontal: width * 0.1,
//     borderRadius: width * 0.02,
//     marginRight: width * 0.03, 
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: '500',
//     fontSize: width * 0.045,
//   },


//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     width: width,
//     height: height * 0.65,
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: height * 0.030,
//     paddingVertical: height * 0.020,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },

//   overlayText: {
//     fontSize: 16,
//     color: '#202020',
//     fontFamily: 'Lato-Regular',
//     paddingVertical: height * 0.014,

//   },
//   overlayHeaderText: {
//     borderColor: '#CDCED7',
//     borderWidth: 3,
//     width: width * 0.2,
//     height: height * 0.003,
//     borderRadius: width * 0.01,
//     alignSelf: 'center',
//     marginBottom: 10
//   },
//   overlayHeader: {
//     textAlign: 'center',
//     fontSize: 16,
//     fontFamily: 'Lato-Bold',
//     paddingVertical: height * 0.008,
//     color: '#202020',

//   },

//   colorShadeText: {
//     fontSize: width * 0.035,
//     color: '#202020',
//     fontFamily: 'Lato-Regular'
//   },

//   successModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//     width: '80%',
//   },

//   successButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     width: "100%",
//   },
//   successButtonText: {
//     color: '#337BCE',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   dataContainer: {
//     padding: width * 0.04,
//     marginTop: 100,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   dataRow: {
//     width: width * 0.23,
//     marginBottom: height * 0.02,

//   },
//   dataItem: {
//     marginBottom: height * 0.01,
//   },

//   seeAllButton: {
//     alignItems: 'center',
//     marginTop: 20,
//     paddingVertical: 10,
//     paddingHorizontal: width * 0.1,
//     borderRadius: 5,
//   },
//   seeAllButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   dimOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     zIndex: 1,
//   },

//   modalOverlaysuccess: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContentsuccess: { 
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 20,
//     alignItems: 'center',
//     width: width * 0.8,
//   },
//   successImagesuccess: {
//     width: width * 0.2,
//     height: height * 0.1,
//     marginBottom: height * 0.01,

//   },
//   modalTitlesuccess: {
//     fontSize: 20,
//     color: '#1B2F2E',
//     fontFamily: 'Lato-Bold',
//     marginBottom: height * 0.01,

//   },
//   modalMessagesuccess: {
//     fontSize: 14,
//     color: '#838383',
//     fontFamily: 'Lato-Regular',
//     textAlign: 'center',
//     marginBottom: height * 0.03,

//   },
//   modalButtonsuccess: {
//     backgroundColor: '#1B2F2E',
//     paddingVertical: height*0.020,
//     paddingHorizontal: width*0.070,
//     borderRadius: 4,
//     marginBottom: height * 0.02,
    
    
//   },
//   modalButtonTextsuccess: {
//     color: '#D6B06B',
//     fontSize: 16,
//     fontFamily: 'Lato-Bold',
//   },

// });

// export default Colorshade;
