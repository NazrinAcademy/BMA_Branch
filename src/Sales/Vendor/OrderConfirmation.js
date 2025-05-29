import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, FlatList, Modal, Image } from 'react-native';
import { ArrowLeft, Plus, Minus, Trash, CirclePlus, CalendarDays, CircleX } from 'lucide-react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const { width, height } = Dimensions.get('window');

const mockCustomizedProducts = [
  {
    id: '1',
    productType: 'Membrane Door',
    modelNo: 'TMD-01',
    size: '66*27',
    skinColorShade: 'White',
    thickness: '18mm',
    quantity: 2,
  },
  {
    id: '2',
    productType: '2D Membrane Door',
    modelNo: 'TM 2D-03',
    size: '72*30',
    skinColorShade: 'Gray',
    thickness: '20mm',
    quantity: 1,
  },
];

const mockShops = [
  {
    id: '1',
    shopName: 'Arasi Furniture',
    vendorName: 'Michael',
    phoneNo: '9834767239',
    address: '3/186 Main Road, Melameignanapuram',
    city: 'Tenkasi',
    pincode: '627814',
  },
  {
    id: '2',
    shopName: 'Bala Furniture',
    vendorName: 'Bala',
    phoneNo: '9876543210',
    address: '4/187 Main Road, Melameignanapuram',
    city: 'Tenkasi',
    pincode: '627814',
  },
];

const OrderConfirmation = ({ route }) => {
  const navigation = useNavigation();
  const [customizedProducts, setCustomizedProducts] = useState(
    route.params?.customizedProducts || mockCustomizedProducts
  );
  const [shopName, setShopName] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [isShopNameFocused, setIsShopNameFocused] = useState(false);
  const [isExpectedDateFocused, setIsExpectedDateFocused] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderId, setOrderId] = useState(route.params?.orderId || 'raja');
  const [salesmanName, setSalesmanName] = useState(route.params?.salesmanName || '004A1');

  // Handle quantity increment
  // const handleIncrement = (id) => {
  //   setCustomizedProducts((prevProducts) =>
  //     prevProducts.map((product) =>
  //       product.id === id ? { ...product, quantity: product.quantity + 1 } : product
  //     )
  //   );
  // };
  const handleIncrement = (id) => {
    setCustomizedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id 
          ? { ...product, quantity: Number(product.quantity) + 1 } 
          : product
      )
    );
  };

  // Handle quantity decrement
  const handleDecrement = (id) => {
    setCustomizedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id && product.quantity > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const handleDelete = (id) => {
    setCustomizedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

  // Date Picker Functions
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setExpectedDate(formattedDate);
    hideDatePicker();
  };

  const handleShopNameChange = (text) => {
    setShopName(text);
    if (text) {
      const filtered = mockShops.filter(shop =>
        shop.shopName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops([]);
    }
  };

  const handleCirclePlusClick = () => {
    navigation.navigate('addshop');
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    setShopName(shop.shopName);
    setFilteredShops([]);
  };

  const highlightMatchingText = (text, input) => {
    if (!input) return <Text>{text}</Text>;

    const lowerText = text.toLowerCase();
    const lowerInput = input.toLowerCase();
    const startIndex = lowerText.indexOf(lowerInput);

    if (startIndex === -1) return <Text>{text}</Text>;

    const endIndex = startIndex + input.length;
    const beforeMatch = text.slice(0, startIndex);
    const match = text.slice(startIndex, endIndex);
    const afterMatch = text.slice(endIndex);

    return (
      <Text>
        <Text>{beforeMatch}</Text>
        <Text style={styles.highlightedText}>{match}</Text>
        <Text>{afterMatch}</Text>
      </Text>
    );
  };

  // Handle Processing Order button click
  const handleProcessingOrder = () => {
    if (!selectedShop || customizedProducts.length === 0) {
      setErrorMessage('Please select a shop and add at least one product to proceed.');
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      setErrorMessage('');
      setIsModalVisible(true);
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalVisible(false);
    setCustomizedProducts([]); // Clear the product list
    setSelectedShop(null); // Clear the selected shop
    setShopName(''); // Clear the shop name
    setExpectedDate(''); // Clear the expected date
    navigation.navigate('SaleProduct'); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowLeftContainer}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Order Confirmation</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        {/* Shop Name Input with CirclePlus Icon */}
        <View style={styles.shopNameInputWrapper}>
          <View
            style={[
              styles.inputWrapper,
              isShopNameFocused && styles.inputWrapperFocused,
              styles.noRightBorderRadius,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder={isShopNameFocused ? "" : "Shop Name"}
              placeholderTextColor="#838383"
              value={shopName}
              onChangeText={handleShopNameChange}
              onFocus={() => setIsShopNameFocused(true)}
              onBlur={() => setIsShopNameFocused(false)}
            />
            {(isShopNameFocused && styles.inputWrapperFocused || shopName) && (
              <Text style={styles.placeholderLabel}>Shop Name</Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.circlePlusIcon, styles.noBorderRadius]}
            onPress={handleCirclePlusClick}
          >
            <CirclePlus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Shop Suggestions List */}
        {filteredShops.length > 0 && (
          <View style={styles.shopSuggestionsContainer}>
            <FlatList
              data={filteredShops}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.shopSuggestionItem}
                  onPress={() => handleShopSelect(item)}
                >
                  {highlightMatchingText(item.shopName, shopName)}
                </TouchableOpacity>
              )}
              style={styles.shopSuggestionsList}
            />
          </View>
        )}

        {/* Expected Date Input */}
        <View style={styles.expectedDateInputWrapper}>
          <TouchableOpacity
            style={[
              styles.inputWrapper,
              isExpectedDateFocused && styles.inputWrapperFocused,
            ]}
            onPress={showDatePicker}
          >
            <TextInput
              style={styles.input}
              placeholder={isExpectedDateFocused ? "" : "Expected Date"}
              placeholderTextColor="#838383"
              value={expectedDate}
              editable={false}
              onFocus={() => setIsExpectedDateFocused(true)}
              onBlur={() => setIsExpectedDateFocused(false)}
            />
            {(isExpectedDateFocused || expectedDate) && (
              <Text style={styles.placeholderLabel}>Expected Date</Text>
            )}
            <TouchableOpacity onPress={showDatePicker} style={styles.calendarIcon}>
              <CalendarDays size={20} color="#202020" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Additional Details Section */}
      {selectedShop && (
        <View style={styles.detailsContainer}>
          <Text style={styles.shopName}>{selectedShop.shopName}</Text>
          <Text style={styles.vendorDetails}>
            {selectedShop.vendorName} - {selectedShop.phoneNo}
          </Text>
          <Text style={styles.address}>{selectedShop.address}</Text>
          <Text style={styles.cityPincode}>
            {selectedShop.city} - {selectedShop.pincode}
          </Text>
        </View>
      )}

      {/* Customized Product List */}
      <ScrollView style={styles.productListContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.productContainer}>
          {customizedProducts.map((product, index) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => handleProductPress(product)}
            >
              <View style={styles.productItem}>
                {/* Product Type, Model No, and Quantity in Column Layout */}
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle}>{product.productType}</Text>
                  <Text style={styles.modelNo}>{product.modelNo}</Text>
                  <View style={styles.quantityWrapper}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity onPress={() => handleDecrement(product.id)}>
                        <Minus size={20} color="#1E1F24" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{product.quantity}</Text>
                      <TouchableOpacity onPress={() => handleIncrement(product.id)}>
                        <Plus size={20} color="#1E1F24" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Delete Icon at Bottom Right */}
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(product.id)}
                >
                  <Trash size={20} color="#E5484D" />
                </TouchableOpacity>
              </View>

              {/* Separator between product items */}
              {index < customizedProducts.length - 1 && (
                <View style={styles.productSeparator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Error Message */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ProcessingOrder}
          onPress={handleProcessingOrder}
        >
          <Text style={styles.ProcessingOrdertext}>Processing Order</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.modalMessage}>Order successfully placed and sent to the production team for processing.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product Details Modal */}
      <Modal
        visible={isProductModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsProductModalVisible(false)}
      >
        <View style={styles.productModelOverlay}>
          <View style={styles.productModalContainer}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setIsProductModalVisible(false)}
            >
              <CircleX size={width * 0.08} color="#1E1F24" />
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.overlayHeaderText}>Details</Text>
            <Text style={styles.modalTitle}>Production</Text>

            {/* Product Details */}
            {selectedProduct && (
              <View style={styles.productDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order ID</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{orderId || 'N/A'}</Text>
                </View>

                {/* Salesman Name */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Salesman</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{salesmanName || 'N/A'}</Text>
                </View>

                {/* Product Type */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Product Type</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.productType}</Text>
                </View>

                {/* Model No */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Model No</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.modelNo}</Text>
                </View>

                {/* Size */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Size</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.size}</Text>
                </View>

                {/* Skin Color Shade */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Skin Color Shade</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.skinColorShade}</Text>
                </View>

                {/* Thickness */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thickness</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.thickness}</Text>
                </View>

                {/* Quantity */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.quantity}</Text>
                </View>

                {/* Expected Date (Conditional Rendering) */}
                {expectedDate && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Expected Date</Text>
                    <Text style={styles.detailColon}>:</Text>
                    <Text style={styles.detailValue}>{expectedDate}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.06,
    borderBottomWidth: 1,
    borderBottomColor: '#CECECE',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  arrowLeftContainer: {
    position: 'absolute',
    left: width * 0.04,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#1E1F24',
    fontFamily: 'Lato-Bold',
  },
  inputContainer: {
    padding: width * 0.04,
  },
  shopNameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CECECE',
    borderRadius: 4,
    padding: width * 0.01,
    position: 'relative',
  },
  inputWrapperFocused: {
    borderColor: '#202020',
  },
  noRightBorderRadius: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    paddingLeft: width * 0.02,
    color: '#202020',
  },
  placeholderLabel: {
    position: 'absolute',
    top: -height * 0.012,
    left: width * 0.04,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: height * 0.01,
    fontSize: width * 0.035,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  circlePlusIcon: {
    backgroundColor: '#1E1F24',
    padding: width * 0.033,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  noBorderRadius: {
    borderRadius: 0,
  },
  expectedDateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expectedDateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CECECE',
    borderRadius: 4,
    padding: width * 0.01,
    position: 'relative',
  },
  calendarIcon: {
    marginRight: width * 0.035,
  },
  detailsContainer: {
    padding: width * 0.04,
    backgroundColor: '#F4F4F4',
    marginHorizontal: width * 0.04,

  },
  shopName: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#1E1F24',
    marginBottom: height * 0.01,
  },
  vendorDetails: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    color: '#838383',
    marginBottom: height * 0.01,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    color: '#838383',
    marginBottom: height * 0.01,
  },
  cityPincode: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    color: '#838383',
  },
  productListContainer: {
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    position: 'relative',
    paddingLeft: width * 0.07,
  },
  productDetails: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    color: '#202020',
  },
  modelNo: {
    fontSize: 14,
    color: '#838383',
    marginTop: height * 0.01,
    fontFamily: 'Lato-Regular',
  },
  quantityWrapper: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    padding: width * 0.02,
    marginTop: height * 0.01,
    width: width * 0.27,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
  },
  quantityText: {
    fontSize: 12,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  deleteIcon: {
    position: 'absolute',
    right: width * 0.04,
    bottom: height * 0.02,
  },
  productSeparator: {
    height: 1,
    backgroundColor: '#F4F4F4',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  ProcessingOrder: {
    backgroundColor: '#1B2F2E',
    padding: width * 0.05,
    borderRadius: 5,
    alignItems: 'center',
  },
  ProcessingOrdertext: {
    color: 'rgba(214, 176, 107, 1)',
    fontSize: width * 0.045,
    fontFamily: 'Lato-Bold',
  },
  shopSuggestionsContainer: {
    position: 'absolute',
    // top: height * 0.09, 
    top:60,
    left: width * 0.03,
    right: width * 0.03,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    maxHeight: height * 0.2, 
    flex: 1, 
  },
  shopSuggestionsList: {
    flexGrow: 1, 
  },
  shopSuggestionItem: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  shopSuggestionText: {
    fontSize: width * 0.06,
    color: '#1E1F24',
    fontFamily: 'Lato-Regular',
  },
  highlightedText: {
    fontFamily:'Lato-Bold',
    color: '#1E88D4',
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
  productModelOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  productModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    padding: width * 0.05,
    width: "100%",
    maxHeight: height * 0.7,
  },
  closeIcon: {
    position: "absolute",
    top: width * 0.03,
    right: width * 0.03,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#1E1F24",
    marginBottom: width * 0.03,
    textAlign: "center",
  },
  productDetails: {
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: width * 0.02,
  },
  detailLabel: {
    fontSize: width * 0.037,
    color: "#838383",
    width: "40%", 
    marginLeft:width * 0.08,
    fontFamily:"Lato-Regular",
  },
  detailValue: {
    fontSize: width * 0.037,
    color: "#1E1F24",
    flex: 1, 
    marginLeft:width * 0.08,
    fontFamily:"Lato-Regular",
  },
  detailColon:{
    color:'#838383'
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

});

export default OrderConfirmation;