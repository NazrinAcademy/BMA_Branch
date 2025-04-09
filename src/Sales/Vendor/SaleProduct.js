import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView, TextInput, Modal } from 'react-native';
import { ArrowLeft, Search, CircleX, Pencil, ChevronDown, Plus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const products = [
  { 
    id: '1', 
    productType: 'Membrane Door',
    modelNo: 'TMD-01',
    size: '66*27', 
    skinColorShade: 'White',
    thickness: '18'
  },
  { 
    id: '2', 
    productType: '2D Membrane Door',
    modelNo: 'TM 2D-03',
    size: '72*30',
    skinColorShade: 'Gray',
    thickness: '20'
  },
];

const SaleProduct = ({ 
  navigation, 
  route, // Added route to access params
  customizedProducts: initialCustomizedProducts = [], // Default value
  setCustomizedProducts: propSetCustomizedProducts = () => {} // Default function
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [quantity, setQuantity] = useState('1');
  
  // Use state for customizedProducts if not passed as prop
  const [localCustomizedProducts, localSetCustomizedProducts] = useState(initialCustomizedProducts);
  
  // Use the prop function if provided, otherwise use local state
  const customizedProducts = propSetCustomizedProducts ? initialCustomizedProducts : localCustomizedProducts;
  const setCustomizedProducts = propSetCustomizedProducts || localSetCustomizedProducts;

  const filteredProducts = products.filter((item) => {
    return (
      item.productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modelNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleLongPress = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.add(itemId);
      }
      return newSelectedItems;
    });
  };

  const handleCustomizeNow = () => {
    const customizedProduct = {
      ...selectedProduct,
      quantity,
    };
    
    setCustomizedProducts((prev) => [...prev, customizedProduct]);
    console.log('customized product', customizedProduct);
    
    setIsOrderModalVisible(false);
    setSelectedItems(new Set());
    setSelectedProduct(null);
  };

  // Rest of your component remains exactly the same...
  // [Keep all your existing renderItem, styles, and other functions exactly as they were]
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => {
        if (selectedItems.has(item.id)) {
          setSelectedProduct(item);
          setIsOrderModalVisible(true);
        } else {
          setSelectedProduct(item);
          setIsProductModalVisible(true);
        }
      }}
      onLongPress={() => {
        handleLongPress(item.id);
      }}
      style={[
        styles.itemContainer,
        selectedItems.has(item.id) && styles.itemContainerLongPressed
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.productType}>{item.productType}</Text>
        <Text style={styles.modelNo}>{item.modelNo}</Text>
      </View>
      {selectedItems.has(item.id) && (
        <TouchableOpacity 
          style={styles.editIconContainer}
          onPress={() => {
            setSelectedProduct(item);
            setIsOrderModalVisible(true);
          }}
        >
          <Pencil size={20} color="#1E1F24" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Left Side: Arrow Icon */}
        <TouchableOpacity onPress={() => {
          if (isSearchVisible) {
            setIsSearchVisible(false); 
          } else {
            navigation.goBack(); 
          }
        }}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>

        {/* Center: Header Text or Search Box */}
        {isSearchVisible ? (
          <View style={styles.searchBox}>
            <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
              <Search size={16} color="#838383" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              placeholderTextColor={"#838383"}
            />
          </View>
        ) : (
          <Text style={styles.headerText}>Product</Text>
        )}

        {/* Right Side: Plus Icon and Search Icon */}
        <View style={styles.rightContainer}>
          {!isSearchVisible && (
            <TouchableOpacity
              style={styles.plusIcon}
              onPress={() => navigation.navigate('OrderConfirmation', { customizedProducts })}
            >
              <Plus size={24} color="#1E1F24" />
            </TouchableOpacity>
          )}
          {!isSearchVisible && (
            <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
              <Search size={24} color="#1E1F24" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Product List */}
      <ScrollView 
        style={styles.listContainer} 
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={filteredProducts} 
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} 
        />
      </ScrollView>

      {/* Product Details Modal */}
      <Modal
        visible={isProductModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsProductModalVisible(false)}
      >
        <View style={styles.productModelOverlay}>
          <View style={styles.productModalContainer}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setIsProductModalVisible(false)}
            >
              <CircleX size={width * 0.08} color="#1E1F24" />
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.overlayHeaderText}>Details</Text>
            <Text style={styles.modalTitle}>Production</Text>

            {selectedProduct && (
              <View style={styles.productDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Product Type</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.productType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Model No</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.modelNo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Size</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.size}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Skin Color Shade</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.skinColorShade}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thickness</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.thickness}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Order Generation Modal */}
      <Modal
          visible={isOrderModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsOrderModalVisible(false)}
        >
          <View style={styles.orderModelOverlay}>
            <View style={styles.orderModalContainer}>
              {/* Close Icon */}
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setIsOrderModalVisible(false)}
              >
                <CircleX size={width * 0.08} color="#1E1F24" />
              </TouchableOpacity>

              {/* Modal Title */}
              <Text style={styles.overlayHeaderText}>Order Generation</Text>
              <Text style={styles.modalTitle}>Customize Product</Text>

              {selectedProduct && (
                <View style={styles.orderDetails}>
                  {/* Fieldset for Skin Color Shade */}
                  <View style={styles.fieldset}>
                    <Text style={styles.legend}>Skin Color Shade</Text>
                    <View style={styles.inputWithIcon}>
                      <TextInput
                        style={styles.input}
                        value={selectedProduct.skinColorShade}
                        onChangeText={(text) => setSelectedProduct({ ...selectedProduct, skinColorShade: text })}
                      />
                      <TouchableOpacity>
                        <ChevronDown size={20} color="#202020" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Fieldset for Thickness */}
                  <View style={styles.fieldset}>
                    <Text style={styles.legend}>Thickness</Text>
                    <View style={styles.inputWithIcon}>
                      <TextInput
                        style={styles.input}
                        value={`${selectedProduct.thickness}mm`} 
                        onChangeText={(text) => {
                          const thicknessValue = text.replace('mm', '');
                          setSelectedProduct({ ...selectedProduct, thickness: thicknessValue });
                        }}
                      />
                    </View>
                  </View>

                  {/* Height and Width in One Row */}
                  <View style={styles.row}>
                    <View style={[styles.fieldset, styles.halfWidth]}>
                      <Text style={styles.legend}>Height</Text>
                      <View style={styles.inputWithIcon}>
                        <TextInput
                          style={styles.input}
                          value={`${selectedProduct.size.split('*')[0]}"`} 
                          onChangeText={(text) => {
                            const heightValue = text.replace('"', '');
                            setSelectedProduct({ ...selectedProduct, size: `${heightValue}*${selectedProduct.size.split('*')[1]}` });
                          }}
                        />
                        <TouchableOpacity>
                          <ChevronDown size={20} color="#202020" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.fieldset, styles.halfWidth]}>
                      <Text style={styles.legend}>Width</Text>
                      <View style={styles.inputWithIcon}>
                        <TextInput
                          style={styles.input}
                          value={`${selectedProduct.size.split('*')[1]}"`} 
                          onChangeText={(text) => {
                            const widthValue = text.replace('"', '');
                            setSelectedProduct({ ...selectedProduct, size: `${selectedProduct.size.split('*')[0]}*${widthValue}` });
                          }}
                        />
                        <TouchableOpacity>
                          <ChevronDown size={20} color="#202020" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Quantity and Order Type in One Row */}
                  <View style={styles.fieldset}>
                    <Text style={styles.legend}>Quantity</Text>
                    <View style={styles.inputWithIcon}>
                      <TextInput
                        style={styles.input}
                        value={quantity}
                        onChangeText={setQuantity}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Customize Now Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.customizeButton}
                onPress={handleCustomizeNow}
              >
                <Text style={styles.customizeButtonText}>Customize now</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.065, 
    backgroundColor: '#FFF',    
  },
  headerText: {
    fontSize: width * 0.05, 
    color: '#1E1F24',
    fontFamily:'Lato-Bold',
    textAlign: 'center',
    flex: 1, 
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: width * 0.03,
    borderColor: '#CECECE',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#202020',
    fontFamily: 'Lato-Regular',
    marginLeft: width * 0.02,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04, 
  },
  plusIcon: {
    marginRight: width * 0.01, 
  },
  listContainer: {
    flex: 1,
    padding: width * 0.05, 
    backgroundColor: '#F4F4F4',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 4,
    marginBottom: height * 0.015,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 0,
    borderLeftWidth: 3,
    borderLeftColor: '#202020',
  },
  textContainer: {
    flex: 1,
    marginRight: width * 0.04, 
  },
  productType: {
    fontSize: width * 0.045, 
    color: '#202020',
    fontFamily:'Lato-Regular'
  },
  modelNo: {
    fontSize: width * 0.035, 
    color: '#838383',
    marginTop: height * 0.015,
    fontFamily:'Lato-Regular' 
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
    fontFamily:'Lato-Bold',
    color: "#1E1F24",
    marginBottom: width * 0.03,
    textAlign: "center",
    alignSelf:'center'
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
    fontSize: width * 0.040,
    color: "#838383",
    width: "40%", 
    marginLeft:width * 0.08,
    fontFamily:"Lato-Regular",
  },
  detailValue: {
    fontSize: width * 0.040,
    color: "#1E1F24",
    flex: 1, 
    marginLeft:width * 0.08,
    fontFamily:"Lato-Regular",
  },
  detailColon:{
    color:'#838383',
    fontSize:width * 0.050,
  },
  overlayHeaderText:{
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2, 
    height: height * 0.003, 
    borderRadius: width * 0.01,
    alignSelf: 'center',
    marginBottom:10
},
itemContainerLongPressed: {
  backgroundColor: 'rgba(27, 47, 46, 0.30)',
},
editIconContainer: {
  position: 'absolute',
  right: 10,
  top: 10,
},
orderModelOverlay: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
orderModalContainer: {
  width: width,
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: width * 0.05,
  borderTopRightRadius: width * 0.05,
  padding: width * 0.05,
},
orderDetails: {
  marginTop: height * 0.030,
},
fieldset: {
  borderWidth: 1,
  borderColor: '#CECECE',
  borderRadius: width * 0.012,
  padding: width * 0.02, 
  marginBottom: width * 0.06,
  position: 'relative',
},
legend: {
  position: 'absolute',
  top: -8,
  left: 18,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: width * 0.020,
  fontSize: 12,
  color: '#838383',
  fontFamily:'Lato-Regular',
},
input: {
  borderRadius: 4,
  padding: width * 0.02, 
  color: '#1E1F24',
  fontSize: 14,
  flex: 1,
  fontFamily:'Lato-Regular',
},
inputWithIcon: {
  flexDirection: 'row',
  alignItems: 'center',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
halfWidth: {
  width: '48%', 
},
footer: {
  backgroundColor: '#FFFFFF',
  padding: width * 0.05,
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
  shadowColor: 'rgba(30, 31, 36, 0.15)', 
  shadowOffset: { width: 0, height: 0 }, 
  shadowOpacity: 0.15, 
  shadowRadius: 4, 
  elevation: 4, 
},
customizeButton: {
  backgroundColor: '#1B2F2E',
  padding: width * 0.05,
  borderRadius: 5,
  alignItems: 'center',
},
customizeButtonText: {
  color: 'rgba(214, 176, 107, 1)',
  fontSize: width * 0.045,
  fontFamily: 'Lato-Bold',
},
orderTypeModelOverlay: {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
orderTypeModalContainer: {
  width: width,
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: width * 0.05,
  borderTopRightRadius: width * 0.05,
  padding: width * 0.03,
},
orderTypeOption: {
  padding: width * 0.03,
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
},
orderTypeText: {
  fontSize: 16,
  color: '#1E1F24',
  fontFamily:'Lato-Regular',
},
});

export default SaleProduct;