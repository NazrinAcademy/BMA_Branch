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
  Alert
} from 'react-native';
import { ChevronDown, Upload, ArrowLeft, ImagePlus } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { productData, heights, widths } from './productData';
import { addProduct, getColorshadeByname } from '../../Utils/apiService';

const { width, height } = Dimensions.get('window');
const AddProduct = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [producttype, setProductType] = useState('');
  const [membraneShade, setMembraneShade] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [modelno, setModelno] = useState('')
  const [productname, setProductname] = useState('')

  const [productcode, setProductCode] = useState('');
  const [selectedColorShade, setSelectedColorShade] = useState("");
  const [thickness, setThickness] = useState('');
  const [colorshadename, setColorshadename] = useState('');

  const [colorshadedata, setColorshadedata] = useState('');


  const [overlayVisible, setOverlayVisible] = useState(false);
  const [colorShadeVisible, setColorShadeVisible] = useState(false);
  const [colorShades, setColorShades] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const colorFadeAnim = useState(new Animated.Value(0))[0];

  const [heightModalVisible, setHeightModalVisible] = useState(false);
  const [widthModalVisible, setWidthModalVisible] = useState(false);

  const [colorshadeid, setColorshadeid] = useState('');
  const [colorshadesid, setColorshadesid] = useState('');

  const [pr1, setPrl] = useState('');
  const [pr2, setPr2] = useState('');
  const [pr3, setPr3] = useState('');
  const [pr4, setPr4] = useState('');
  const [qantityprocessingtime, setQantityprocessingtime] = useState('');

  const [totalprocessingtime, setTotalprocessingtime] = useState(0);









  // const handleImageUpload = async () => {
  //   launchImageLibrary(
  //     {
  //         mediaType: 'photo',
  //         includeBase64: true,
  //         quality: 1,
  //         selectionLimit: 0,
  //     },
  //     (response) => {
  //         if (response.didCancel) {
  //             console.log('User cancelled image picker');
  //         } else if (response.error) {
  //             console.error('Image Picker Error: ', response.error);
  //         } else {
  //             const base64doorimages = response.assets.map(asset => `data:image/jpeg;base64,${asset.base64}`);
  //             console.log('Selected base64 images:', base64doorimages);
  //             setImage(base64doorimages);
  //         }
  //     }
  // );
  // };
  // const [heightValue, setHeight] = useState('');
  // const [widthValue, setWidth] = useState('');
  // const [productCode, setProductCode] = useState('');
  // const [thickness, setThickness] = useState('');
  const newProductSubmitHandler = async () => {
    try {
      console.log("producttype ", producttype);


      // Calculate the total processing time locally before updating the state
      // const calculatedTotalProcessingTime = Number(pr1) + Number(pr2) + Number(pr3) + Number(pr4);
      // setTotalprocessingtime(calculatedTotalProcessingTime); // Update the state (optional)

      // console.log("Calculated total processing time:", calculatedTotalProcessingTime);

      const colorshadedetailes = {
        colorshadeid,
        colorshadesid
      };

      console.log("Color shade details:", colorshadedetailes);



      console.log(
        "All data:",

        height,
        width,
        producttype,
        modelno,
        thickness,
        colorshadedetailes,
        pr1,
        pr2,
        pr3,
        pr4,
        qantityprocessingtime // Use the newly calculated value
      );

      // Pass the calculated total processing time to the API
      const response = await addProduct(

        height,
        width,
        producttype,
        modelno,
        thickness,
        colorshadedetailes,
        pr1,
        pr2,
        pr3,
        pr4,
        qantityprocessingtime
      );

      Alert.alert("Success", "Product added successfully!");
      console.log("Product submitted successfully:", response);
      navigation.navigate('ProductList')


      // Reset the input fields
      setModelno('');
      setHeight('');
      setWidth('');
      setThickness('');
      setPrl(0)
      setPr2(0);
      setPr3(0);
      setPr4(0);
      setQantityprocessingtime(0);

    } catch (error) {
      console.error("Error submitting product:", error.message || error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
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
    console.log("", colorShadeVisible);

    if (producttype) {
      console.log("Received Color Shade Data:", colorshadedata.data);
      console.log("Received Color Shade Data id:", colorshadedata.data[0]._id);


      // Ensure data exists before accessing it
      const selectedProduct = colorshadedata.data?.find(item => item.producttype === producttype);
      const selectedColorShades = selectedProduct ? selectedProduct.colorshades : [];

      // Set the color shades state
      setColorShades(selectedColorShades);
      setColorShadeVisible(true);

      // Animate overlay
      Animated.timing(colorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  const renderItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item.data)}>
      <Text style={styles.itemText}>{item.data}</Text>
    </TouchableOpacity>
  );


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
  const renderColorShadeItem = ({ item }) => {
    console.log("Rendering item:", item);
    // console.log("Rendering item colorshade:", item._id);


    if (!item.colorshadeimage || item.colorshadeimage.length === 0) {
      console.warn("Missing image for item:", item);
      return null; // Skip rendering this item if no image is present
    }

    return (
      <TouchableOpacity
        style={styles.colorShadeItem}
        onPress={() => {
          setColorshadesid(item._id);
          setMembraneShade(item.colorshadename);
          setSelectedColorShade(item.colorshadename);
          hideColorShadeOverlay();
        }}
      >
        <Image source={{ uri: item.colorshadeimage[0]?.url }} style={styles.colorShadeImage} />
        <Text style={styles.colorShadeText}>{item.colorshadename}</Text>
      </TouchableOpacity>
    );
  };

  console.log("new colorshadesid", colorshadesid);




  const handleProductTypeChange = async (type) => {
    try {
      console.log('producttype in handleProductTypeChange ', producttype);

      setProductType(type);
      if (producttype === "") {
        console.log("producttype is empty now");

      }
      else {
        const products = await getColorshadeByname(producttype)
        console.log("products in handleProductTypeChange", products);
        setColorshadeid((prev) => {
          console.log("Previous colorshadeid:", prev);
          console.log("New colorshadeid:", products.data[0]._id);
          return products.data[0]._id;
        });



        1



        setColorshadedata(products)
        setMembraneShade(''); // Reset membraneShade when product type changes
        hideOverlay();
      }

    } catch (error) {

    }
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
        <Text style={styles.headerText}>Add Product</Text>
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
              value={producttype}
              editable={false}
            />
            <ChevronDown size={24} color="#202020" style={styles.inputIcon} />
          </TouchableOpacity>

          {/* <TextInput
            style={styles.input}
            placeholder="Productname"
            placeholderTextColor="#838383"
            value={productname}
            onChangeText={setProductname}
          /> */}

          <TextInput
            style={styles.input}
            placeholder="Model"
            placeholderTextColor="#838383"
            value={modelno}
            onChangeText={setModelno}
          />

          <TextInput
            style={styles.input}
            placeholder="Thickness"
            placeholderTextColor="#838383"
            value={thickness}
            onChangeText={setThickness}
          />

          <TouchableOpacity style={styles.inputWithIcon} onPress={showColorShadeOverlay}>
            <TextInput
              style={styles.inputWithIconField}
              placeholder="Color Shade"
              placeholderTextColor="#838383"
              value={membraneShade}
              editable={false}
            />
            <ChevronDown size={24} color="#202020" style={styles.inputIcon} />
          </TouchableOpacity>






          <View style={styles.row}>
            {/* Height Input */}
            <TouchableOpacity
              style={styles.inputWithIconSmall}
              onPress={() => setHeightModalVisible(true)}
            >
              <TextInput
                style={styles.inputWithIconField}
                placeholder="Height"
                placeholderTextColor="#838383"
                value={height}
                onChangeText={setHeight}
                editable={false}
              />
              <ChevronDown size={24} color="#202020" style={styles.inputIcon} />
            </TouchableOpacity>

            {/* Width Input */}
            <TouchableOpacity
              style={styles.inputWithIconSmall}
              onPress={() => setWidthModalVisible(true)}
            >
              <TextInput
                style={styles.inputWithIconField}
                placeholder="Width"
                placeholderTextColor="#838383"
                value={width}
                onChangeText={setWidth}
                editable={false}
              />
              <ChevronDown size={24} color="#202020" style={styles.inputIcon} />
            </TouchableOpacity>

            {/* Height Selection Modal */}
            <Modal
              visible={heightModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setHeightModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Height</Text>
                  <FlatList
                    data={heights}
                    horizontal
                    keyExtractor={(item) => item.data}
                    renderItem={({ item }) => renderItem({ item, onPress: (val) => { setHeight(val); setHeightModalVisible(false); } })}
                  />
                </View>
              </View>
            </Modal>

            {/* Width Selection Modal */}
            <Modal
              visible={widthModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setWidthModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Width</Text>
                  <FlatList
                    data={widths}
                    horizontal
                    keyExtractor={(item) => item.data}
                    renderItem={({ item }) => renderItem({ item, onPress: (val) => { setWidth(val); setWidthModalVisible(false); } })}
                  />
                </View>
              </View>
            </Modal>
          </View>
          {/* <TextInput
            style={styles.input}
            placeholder="Model"
            placeholderTextColor="#838383"
            value={modelno}
            onChangeText={setModelno}
          /> */}

          {/* <TextInput
            style={styles.input}
            placeholder="Processing time1"
            placeholderTextColor="#838383"
            value={pr1}
          
            onChangeText={setPrl}
          /> */}
          {/* <TextInput
            style={styles.input}
            

            placeholder="Processing time2"
            placeholderTextColor="#838383"
            value={pr2}
          
            onChangeText={setPr2}
          /> */}
          {/* <TextInput
            style={styles.input}
            

            placeholder="Processing time3"
            placeholderTextColor="#838383"
            value={pr3}
           
            onChangeText={setPr3}
          /> */}
          {/* <TextInput
            style={styles.input}
           

            placeholder="Processing time4"
            placeholderTextColor="#838383"
            value={pr4}
            
            onChangeText={setPr4}
          /> */}
          {/* <TextInput
            style={styles.input}
       

            placeholder="qantityprocessingtime"
            placeholderTextColor="#838383"
            value={qantityprocessingtime}
            
            onChangeText={ setQantityprocessingtime}
          /> */}

          {/* <TouchableOpacity style={styles.uploadBox} onPress={handleImageUpload}>
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadedImage} />
            ) : (
              <>
                <ImagePlus size={24} color="#838383" style={styles.inputIcon} />
                <Text style={styles.uploadText}>Upload Image</Text>
                <Text style={styles.uploadSubText}>JPG or PNG / Max. File Size 60MB</Text>
              </>
            )}
          </TouchableOpacity> */}
        </View>

        {/* <TouchableOpacity style={styles.saveButton} onPress={newProductSubmitHandler}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity> */}



      </ScrollView>
      <View style={styles.footer}>
          <TouchableOpacity style={styles.registerButton} onPress={newProductSubmitHandler}>
            <Text style={styles.registerButtonText}>Save</Text>
          </TouchableOpacity>
        </View>


      <Modal transparent={true} visible={overlayVisible} onRequestClose={hideOverlay}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Text style={styles.overlayHeaderText}>Select color shade</Text>
          <Text style={styles.overlayHeader}>Product Type</Text>
          {Object.keys(productData).map((type, index) => (
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
        <Animated.View style={[styles.overlay, { opacity: colorFadeAnim, height: 300 }]}>
          <Text style={styles.overlayHeaderText}>Select color shade</Text>
          <Text style={styles.overlayHeader}>Selected Shade: {selectedColorShade}</Text>

          {/* Display selected shade in a vertical list */}
          <FlatList
            data={colorShades}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderColorShadeItem}
            showsVerticalScrollIndicator={false} // Hide the scroll bar for cleaner UI
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
  inputWithIconField: { flex: 1, color: "#000" },
  inputIcon: { marginLeft: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
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
    fontFamily: 'Lato-Italic',
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
    fontFamily: 'Lato-Bold'
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.78,
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
    fontFamily: 'Lato-Regular'
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
});

export default AddProduct;
