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

const OrderDetails = ({ route, navigation }) => {
  const { order } = route.params;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openModal = (product) => {
    console.log("Selected Product:", product); // Debugging
    if (!product) return;
    
    setSelectedProduct(product); // Store only the selected product
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={width * 0.06} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Orders</Text>
        <View style={styles.headerSpacer} />
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
              <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
              <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={closeModal} />
        </Animated.View>

        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Product Details</Text>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {selectedProduct && (
              <>
                <Text style={styles.detailText1}>{selectedProduct.productName}</Text>
                <Text style={styles.detailText}>Order ID: {order.orderId}</Text>
                <Text style={styles.detailText}>Order Date: {order.orderDate}</Text>
                <Text style={styles.detailText}>Salesman: {selectedProduct.salesman}</Text>
                <Text style={styles.detailText}>Product Type: {selectedProduct.productType}</Text>
                <Text style={styles.detailText}>Model No: {selectedProduct.modelNo}</Text>
                <Text style={styles.detailText}>Order Type: {selectedProduct.orderType}</Text>
                <Text style={styles.detailText}>Size: {selectedProduct.size}</Text>
                <Text style={styles.detailText}>Skin Color Shade: {selectedProduct.skinColorShade}</Text>
                <Text style={styles.detailText}>Thickness: {selectedProduct.thickness}</Text>
                <Text style={styles.detailText}>Quantity: {selectedProduct.quantity}</Text>
                <Text style={styles.detailText}>Delivery Time: {selectedProduct.deliveryTime}</Text>
                <Text style={styles.detailText}>Status: {selectedProduct.status}</Text>
              </>
            )}
          </View>
        </Animated.View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: height * 0.03,
    backgroundColor: "#FFF",
  },
  headerText: {
    fontSize: width * 0.05,
    color: "#1E1F24",
    fontFamily: "Lato-Bold",
  },
  headerSpacer: {
    width: width * 0.09,
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
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   justifyContent: "flex-end",
  // },
  // modalBackground: {
  //   flex: 1,
  // },
  // modalContent: {
  //   backgroundColor: "#FFF",
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   padding: width * 0.05,
  //   maxHeight: height * 0.7,
  // },
  // modalHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: height * 0.02,
  // },
  // modalHeaderText: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: "#202020",
  // },
  // closeButton: {
  //   fontSize: 16,
  //   color: "#007BFF",
  // },
  // modalBody: {
  //   paddingBottom: height * 0.02,
  // },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBody: {
    marginTop: 10,
  },
 
});

export default OrderDetails;