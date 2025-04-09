import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Modal } from "react-native";
import { ArrowLeft, X, CircleX } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const AccountOrderList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};

  const [status, setStatus] = useState(order.status);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const statusStyles = {
    backgroundColor: status === "Pending" ? "#F9E7DC" : "#E0F7E9",
    borderColor: status === "Pending" ? "#BF8965" : "#4CAF50",
    color: status === "Pending" ? "#BF8965" : "#4CAF50",
  };

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    setIsModalVisible(false);
    navigation.navigate({
      name: 'accountorders',
      params: { updatedOrder: { ...order, status: newStatus } },
      merge: true,
    });
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

 
  const defaultProductDetails = {
    orderId: "00A004",
    orderDate: "05-10-23",
    salesMan: "Virat",
    orderType: "Normal Order",
    size: '66"×27"',
    skinColorShade: "Andra Teak",
    thickness: '27"',
    deliveryTime: "10-02-23",
  };

  // Dynamic modal title based on status
  const modalTitle = status === "Pending" ? "Pending" : "Completed";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={width * 0.07} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Order Info */}
      <View style={styles.orderInfoContainer}>
        {/* Status Button - Entire area is clickable */}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={[styles.statusContainer, { backgroundColor: statusStyles.backgroundColor, borderColor: statusStyles.borderColor }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.statusText, { color: statusStyles.color }]}>{status}</Text>
        </TouchableOpacity>
        <Text style={styles.shopName}>{order.name}</Text>
        <Text style={styles.vendorInfo}>{order.vendorName} - {order.phone}</Text>
        <Text style={styles.address}>{order.address}</Text>
        <Text style={styles.cityPincode}>{order.city} - {order.pincode}</Text>
      </View>

      {/* Product List */}
      <ScrollView style={styles.productListContainer}>
        <View style={styles.productContainer}>
          {order.products.map((product, index) => (
            <TouchableOpacity key={index} onPress={() => handleProductPress(product)}>
              <View style={styles.productItem}>
                <Text style={styles.productTitle}>{product.type} - {product.model}</Text>
                <Text style={styles.productQuantity}>Qty : {product.quantity}</Text>
              </View>
              {index < order.products.length - 1 && <View style={styles.productSeparator} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.overlayHeaderText}>Details</Text>
            <Text style={styles.modalTitle}>Update Status</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleStatusUpdate("Completed")}
              activeOpacity={0.7}
            >
              <Text style={styles.modalOptionText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleStatusUpdate("Pending")}
              activeOpacity={0.7}
            >
              <Text style={styles.modalOptionText}>Pending</Text>
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
            <Text style={styles.modalTitle}>{modalTitle}</Text>

            {/* Product Details */}
            {selectedProduct && (
              <View style={styles.productDetails}>
                {/* Field and Value Rows */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order Id</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.orderId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order Date</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.orderDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sales Man</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.salesMan}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Product Type</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.type}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Model No</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.model}</Text>
                </View>
                {/* <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Order Type</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.orderType}</Text>
                </View> */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Size</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.size}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Skin Color Shade</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.skinColorShade}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thickness</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.thickness}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.quantity}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Delivery Date</Text>
                  <Text style={styles.detailColon}>:</Text>
                  <Text style={styles.detailValue}>{defaultProductDetails.deliveryTime}</Text>
                </View>
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: height * 0.038, 
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
  orderInfoContainer: {
    padding: width * 0.05, 
    backgroundColor: "#F4F4F4",
    marginBottom: height * 0.01, 
    position: "relative",
  },
  shopName: {
    fontSize:16,
    color: "#202020",
    fontFamily: "Lato-Regular",
    fontWeight: "600",
  },
  vendorInfo: {
    fontSize:14,
    color: "#838383",
    fontFamily: "Lato-Regular",
    marginTop: height * 0.01, 
  },
  address: {
    fontSize:14,
    color: "#838383",
    fontFamily: "Lato-Regular",
    marginTop: height * 0.01, 
  },
  cityPincode: {
    fontSize:14,
    color: "#838383",
    fontFamily: "Lato-Regular",
    marginTop: height * 0.01, 
    fontWeight: "600",
  },
  statusContainer: {
    position: "absolute",
    top: height * 0.02, 
    right: width * 0.04, 
    // paddingVertical: height * 0.010, 
    // paddingHorizontal: width * 0.035, 
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: width * 0.01, 
    borderWidth: 1,
    borderColor: "#BF8965",
    backgroundColor: "#F9E7DC",
  },

  statusText: {
    color: "#BF8965",
    fontSize: width * 0.035, 
    fontFamily: "Lato-Bold",
  },
  productListContainer: {
    marginTop: height * 0.01, 
    paddingHorizontal: width * 0.04, 
  },
  productContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  productItem: {
    padding: width * 0.04, 
    paddingHorizontal: width * 0.07, 
    paddingVertical: height * 0.03, 
  },
  productTitle: {
    fontSize:16,
    fontFamily: "Lato-Regular",
    color: "#202020",
  },
  productQuantity: {
    fontSize:14,
    color: "#838383",
    marginTop: height * 0.015, 
    fontFamily: "Lato-Regular",
  },
  productSeparator: {
    height: 1,
    backgroundColor: "#F4F4F4",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: width * 0.04,
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontFamily: "Lato-Bold",
    color: "#202020",
    marginBottom: height * 0.02,
    textAlign:'center'
  },
  modalOption: {
    paddingVertical: height * 0.02,
  },
  modalOptionText: {
    fontSize: width * 0.04,
    fontFamily: "Lato-Regular",
    color: "#202020",
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
  modalOverlaysecond: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  productModelOverlay: {
    flex: 1,
    justifyContent: "flex-end", 
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  }
});

export default AccountOrderList;