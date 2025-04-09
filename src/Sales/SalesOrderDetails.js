import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const SalesOrderDetails = ({ route, navigation }) => {
  const { order, handleReorder } = route.params;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

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

  const handleReorderClick = () => {
    handleReorder(order.id);
    navigation.goBack();
  };

  const handleCancel = () => {
    console.log("Cancel clicked for order:", order.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Orders</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.detailText1}>{order.name}</Text>
        <Text style={styles.detailText}>{order.ownername} - {order.phone}</Text>
        <Text style={styles.detailText}>{order.address}</Text>
        <Text style={styles.detailText}>{order.city} - {order.pincode}</Text>
      </View>

      <FlatList
  data={order.products}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={styles.scrollContainer}
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.productCard}>
        <View style={styles.row}>
          <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
          {item.defective > 0 && (
            <Text style={styles.approvedText}>Approved: {item.approved || 'No'}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
          {item.defective > 0 && (
            <Text style={styles.defectiveText}>Defective: {item.defective || 0}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )}
/>

      {order.status === "Rejected" && (
        <View style={styles.saveContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleReorderClick}>
            <Text style={styles.saveButtonText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton1} onPress={handleCancel}>
            <Text style={styles.saveButtonText1}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent={true} visible={modalVisible} animationType="none" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />

          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Production</Text>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              {selectedProduct && (
                <>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Order Id</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.orderId}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Order Date</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.orderDate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Salesman</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.salesman}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Product Type</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.productType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Model No</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.modelNo}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Order Type</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.orderType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Size</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.size}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Skin Color Shade</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.skinColorShade}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Thickness</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.thickness}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.quantity}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Delivery Time</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{order.deliveryTime}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <TouchableOpacity style={styles.touchable}>
                        <Text style={styles.detailValue1}>{order.status}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 5,
  },
  approvedText: {
    fontSize: 14,
    color: '#17BE78',
    fontFamily: "Lato-Regular",
  },
  defectiveText: {
    fontSize: 14,
    color: '#E5484D',
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
  saveContainer: {
    backgroundColor: '#fff',
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#1B2F2E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    width: width * 0.4,
    alignItems: "center",
  },
  saveButton1: {
    backgroundColor: '#1B2F2E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
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
});

export default SalesOrderDetails;