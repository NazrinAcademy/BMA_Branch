import React, { useState, useRef } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Modal, Animated, Easing, TextInput,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const AcceptOrderDetails = ({ route }) => {
  const { order } = route.params;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [rejectConfirmationVisible, setRejectConfirmationVisible] = useState(false); // New state for reject confirmation modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation();
  const [textAreaValue, setTextAreaValue] = useState("");

  const openModal = (product) => {
    console.log("Selected Product:", product);
    if (!product) return;

    setSelectedProduct(product);
    setModalVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedProduct(null);
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleReadyToQC = () => {
    closeModal();
    // navigation.navigate('QCPage'); 
  };

  const handleAccept = () => {
    // navigation.navigate("Production", { order });
    navigation.goBack();

  };

  const handleReject = () => {
    setRejectConfirmationVisible(true); 
  };

  const handleRejectConfirmation = (confirmed) => {
    if (confirmed) {
      navigation.navigate("Reject", { order }); 
    }
    setRejectConfirmationVisible(false); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Accept Orders</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.detailText1}>{order.shopName}</Text>
        <Text style={styles.detailText}>{order.vendorName} - {order.phone}</Text>
        <Text style={styles.detailText}>{order.address}</Text>
        <Text style={styles.detailText}>{order.city} - {order.pincode}</Text>
      </View>
    
      <Text style={styles.heading11}>Notes :</Text>
      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          multiline={true}
          numberOfLines={4}
          placeholder="Type your message here..."
          value={textAreaValue}
          onChangeText={(text) => setTextAreaValue(text)}
        />
      </View>

      <FlatList
        data={order.products}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.productCard}>
              <Text style={styles.productName}>{item.productType} - {item.modelNo}</Text>
              <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleReject}>
          <Text style={styles.saveButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton1} onPress={handleAccept}>
          <Text style={styles.saveButtonText1}>Accept</Text>
        </TouchableOpacity>
      </View>

      {/* Reject Confirmation Modal */}
      <Modal transparent={true} visible={rejectConfirmationVisible} animationType="none" onRequestClose={() => setRejectConfirmationVisible(false)}>
        <View style={styles.confirmationModalContainer}>
          <View style={styles.confirmationModalContent}>
            <Text style={styles.confirmationModalText}>Are you sure you want to reject this order?</Text>
            <View style={styles.confirmationModalButtons}>
              <TouchableOpacity style={styles.confirmationModalButton} onPress={() => handleRejectConfirmation(true)}>
                <Text style={styles.confirmationModalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmationModalButton1} onPress={() => handleRejectConfirmation(false)}>
                <Text style={styles.confirmationModalButtonText1}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Existing Modals */}
      <Modal transparent={true} visible={modalVisible} animationType="none" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Production Details</Text>
            </View>
            <View style={styles.modalBody}>
              {selectedProduct && (
                <>
                  <View style={styles.detailsContainer}>
                    {/* Order Id */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Order Id</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.orderId}</Text>
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
                    {/* Salesman */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Salesman</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.salesman}</Text>
                    </View>
                    {/* Size */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Size</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>
                        {selectedProduct.size.width}" * {selectedProduct.size.height}"
                      </Text>
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
                    {/* Expected Finishing Time */}
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expected Date</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.ExpectedDate}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal transparent={true} visible={statusModalVisible} animationType="none" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Update status</Text>
            </View>
            <TouchableOpacity style={styles.readyToQCButton} onPress={handleReadyToQC}>
              <Text style={styles.readyToQCButtonText}>Ready to QC</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  scrollContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
    paddingTop: height * 0.02,
  },
  textContainer: {
    padding: width * 0.05,
    backgroundColor: "#F4F4F4",
    marginBottom: height * 0.01,
  },
  detailText1: {
    fontSize: 16,
    color: "#202020",
    fontFamily: "Lato-Regular",
    fontWeight: "600",
  },
  detailText: {
    fontSize: 14,
    color: "#838383",
    fontFamily: "Lato-Regular",
    marginTop: height * 0.01,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: width * 0.04,
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F4",
  },
  productName: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: "#202020",
  },
  productQuantity: {
    fontSize: 14,
    color: "#838383",
    marginTop: height * 0.015,
    fontFamily: "Lato-Regular",
  },
  dragIndicator: { width: 40, height: 4, backgroundColor: "#ccc", alignSelf: "center", borderRadius: 2, marginBottom: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
  },
  modalBody: {
    marginBottom: 20,
  },
  detailsContainer: {
    marginTop: 10,
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
    marginLeft: width * 0.08,
    fontFamily: "Lato-Regular",
  },
  detailColon: {
    fontSize: 16,
    color: '#333',
  },
  detailValue: {
    fontSize: width * 0.037,
    color: "#1E1F24",
    flex: 1,
    marginLeft: width * 0.08,
    fontFamily: "Lato-Regular",
  },
  detailValue1: {
    color: '#BF8965',
    fontSize: 16,
    fontWeight: 'bold',
  },
  touchable: {
    marginLeft: width * 0.08,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#BF8965",
    backgroundColor: "#F9E7DC",
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContainer1: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent1: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
  },
  modalHeader1: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderText1: {
    fontSize: 20,
    fontFamily: "Lato-Bold",
  },
  modalBody1: {
    marginBottom: 20,
  },
  // overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  // statusModalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  // modalText: { fontSize: 18, marginBottom: 10 },
  // closeButton: { marginTop: 10, color: "red", fontSize: 16 },


 
  heading11: {
    fontSize: width * 0.045,     fontFamily: 'Lato-Bold',
    marginBottom: height * 0.005, 
    paddingHorizontal: width * 0.05, 
  },
  textAreaContainer: {
    width: width, 
    paddingHorizontal: width * 0.05, 
    alignSelf: "center",
  },
  textArea: {
    width: "100%", 
    height: height * 0.12, 
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: width * 0.012, 
    padding: width * 0.025, 
    textAlignVertical: "top",
  },
  saveContainer: {
    backgroundColor: '#fff',
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", 
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.05, 
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#1B2F2E",
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.05, 
    borderRadius: width * 0.01, 
    width: width * 0.4, 
    alignItems: "center",
  },
  saveButton1: {
    backgroundColor: '#1B2F2E',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05, 
    borderRadius: width * 0.01, 
    width: width * 0.4, 
    alignItems: "center",
  },
  saveButtonText: {
    color: '#1B2F2E',
    fontSize: width * 0.045, 
    fontFamily: 'Lato-Bold',
  },
  saveButtonText1: {
    color: '#D6B06B',
    fontSize: width * 0.045, 
    fontFamily: 'Lato-Bold',
  },
  confirmationModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmationModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: width * 0.8,
  },
  confirmationModalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "",
    textAlign: "center",
    marginBottom: 16,
  },
  confirmationModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmationModalButton: {
    backgroundColor: "#1B2F2E",
    borderColor:'#1B2F2E',
    borderWidth:1,  
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
  },
  confirmationModalButton1: {
    backgroundColor: "#FFF",
    borderColor:'#1B2F2E',
    borderWidth:1,  
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
 
 },
  confirmationModalButtonText: {
    color: '#D6B06B',
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmationModalButtonText1: {
    color: "#1E1F24",
    fontSize: 16,
    fontWeight: "bold",
  },

  
});

export default AcceptOrderDetails;