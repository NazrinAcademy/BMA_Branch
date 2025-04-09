// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Modal,
//   Animated,
//   Easing,
// } from "react-native";
// import { ArrowLeft } from "lucide-react-native";
// import { useNavigation } from '@react-navigation/native';


// const { width, height } = Dimensions.get("window");

// const OrderDetails = ({ route }) => {
//   const { order } = route.params;
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(height)).current;
//   const statusFadeAnim = useRef(new Animated.Value(0)).current;
//   const statusSlideAnim = useRef(new Animated.Value(height)).current;
//   const navigation = useNavigation();


//   const openModal = (product) => {
//     console.log("Selected Product:", product);
//     if (!product) return;

//     setSelectedProduct(product);
//     setModalVisible(true);

//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const closeModal = () => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: height,
//         duration: 300,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setModalVisible(false);
//       setSelectedProduct(null);
//     });
//   };


//   const openStatusModal = () => {
//     setStatusModalVisible(true);
//     Animated.parallel([
//       Animated.timing(statusFadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(statusSlideAnim, {
//         toValue: 0,
//         duration: 300,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const closeStatusModal = () => {
//     Animated.parallel([
//       Animated.timing(statusFadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(statusSlideAnim, {
//         toValue: height,
//         duration: 300,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setStatusModalVisible(false);
//     });
//   };
//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const handleReadyToQC = () => {
//     closeStatusModal();
//     navigation.goBack();
//     // navigation.navigate('QCPage'); 
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
//           <ArrowLeft size={24} color="#1E1F24" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Orders</Text>
//       </View>

//       <View style={styles.textContainer}>
//         <Text style={styles.detailText1}>{order.name}</Text>
//         <Text style={styles.detailText}>{order.ownername} - {order.phone}</Text>
//         <Text style={styles.detailText}>{order.address}</Text>
//         <Text style={styles.detailText}>{order.city} - {order.pincode}</Text>
//       </View>

//       <FlatList
//         data={order.products}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//         renderItem={({ item }) => (
//           <TouchableOpacity onPress={() => openModal(item)}>
//             <View style={styles.productCard}>
//               <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
//               <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//       <Modal transparent={true} visible={modalVisible} animationType="none" onRequestClose={closeModal}>
//         <View style={styles.modalContainer}>
//           <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />

//           <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
//             <View style={styles.dragIndicator} />
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalHeaderText}>Production</Text>
//             </View>

//             {/* Modal Body */}
//             <View style={styles.modalBody}>
//               {selectedProduct && (
//                 <>
//                   <View style={styles.detailsContainer}>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Order Id</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{order.orderId}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Order Date</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{order.orderDate}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Salesman</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{order.salesman}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Product Type</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.productType}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Model No</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.modelNo}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Order Type</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.orderType}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Size</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.size}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Skin Color Shade</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.skinColorShade}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Thickness</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.thickness}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Quantity</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.quantity}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Delivery Time</Text>
//                       <Text style={styles.detailColon}>:</Text>
//                       <Text style={styles.detailValue}>{selectedProduct.deliveryTime}</Text>
//                     </View>
//                     {/* onPress={() => setStatusModalVisible(true)}  */}
//                     {/* <TouchableOpacity onPress={() => setStatusModalVisible(true)} style={styles.touchable}>
//                         <Text style={styles.detailValue1}>{order.status}</Text>
//                       </TouchableOpacity> */}
//                     {/* <Text style={styles.detailValue}>{order.statusText}</Text> */}

//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Status</Text>
//                       <Text style={styles.detailColon}>:</Text>

//                       {order.status === "Production" ? (
//                         <TouchableOpacity
//                           style={styles.touchable}
//                           onPress={openStatusModal}
//                         >
//                           <Text style={styles.detailValue1}>{order.status}</Text>
//                         </TouchableOpacity>
//                       ) : (
//                         <Text style={styles.detailValue}>{order.status}</Text>
//                       )}

//                     </View>
//                   </View>
//                 </>
//               )}
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>

//       <Modal transparent={true} visible={statusModalVisible} animationType="none" onRequestClose={closeStatusModal}>
//         <View style={styles.modalContainer}>
//           <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeStatusModal} />

//           <Animated.View style={[styles.modalContent, {
//             transform: [{ translateY: statusSlideAnim }],
//             height: height * 0.15 // Smaller height for status modal
//           }]}>
//             <View style={styles.dragIndicator} />
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalHeaderText}>Update Status</Text>
//             </View>

//             <View style={styles.modalBody}>
//               <TouchableOpacity
//                 style={styles.readyToQCButton}
//                 onPress={handleReadyToQC}
//               >
//                 <Text style={styles.readyToQCButtonText}>Ready to QC</Text>
//               </TouchableOpacity>

//               {/* Add more status options if needed */}
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

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
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';

const { width, height } = Dimensions.get("window");

const OrderDetails = ({ route }) => {
  const { order: initialOrder } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const statusFadeAnim = useRef(new Animated.Value(0)).current;
  const statusSlideAnim = useRef(new Animated.Value(height)).current;
  const navigation = useNavigation();



  const hasDefectiveItems = order.products.some(item => item.defective > 0);

  const toggleProductCheck = (index) => {
    const updatedProducts = [...order.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      checked: !updatedProducts[index].checked
    };
    setOrder({...order, products: updatedProducts});
  };




  const openModal = (product) => {
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

  const openStatusModal = () => {
    setStatusModalVisible(true);
    Animated.parallel([
      Animated.timing(statusFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(statusSlideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeStatusModal = () => {
    Animated.parallel([
      Animated.timing(statusFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(statusSlideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStatusModalVisible(false);
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const updateStatus = (newStatus) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      status: newStatus
    }));
    closeStatusModal();
    
    if (newStatus === "Ready to QC") {
      navigation.goBack();
      // navigation.navigate('QCPage');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = [
      "Production",
      "Process 1 ",
      "Process 2 ",
      "Process 3 ",
      "Process 4 ",
      "Ready to QC"
    ];
    
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : currentStatus;
  };

  const renderStatusOptions = () => {
    const nextStatus = getNextStatus(order.status);
    
    if (nextStatus === order.status) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => updateStatus(nextStatus)}
      >
        <Text style={styles.statusButtonText}> {nextStatus}</Text>
      </TouchableOpacity>
    );
  };

  const resendToQC = () => {
    const selectedItems = order.products.filter(item => item.checked && item.defective > 0);
    if (selectedItems.length === 0) {
      alert("Please select at least one defective item");
      return;
    }
    // Your resend to QC logic here
    alert(`${selectedItems.length} defective items sent to QC`);
    // Clear selections after sending
    const updatedProducts = order.products.map(item => ({...item, checked: false}));
    setOrder({...order, products: updatedProducts});
  };

  // const renderItem = ({ item, index }) => (
  //   <View style={styles.listItemContainer}>
  //     {/* Show checkbox only for defective items */}
  //     {item.defective > 0 && (
  //       <CheckBox
  //         value={item.checked || false}
  //         onValueChange={() => toggleProductCheck(index)}
  //         style={styles.checkbox}
  //       />
  //     )}
  //     <TouchableOpacity 
  //       style={styles.productCard}
  //       onPress={() => openModal(item)}
  //     >
  //       <View style={styles.row}>
  //         <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
  //         {item.defective > 0 && (
  //           <Text style={styles.approvedText}>Approved: {item.approved || 'No'}</Text>
  //         )}
  //       </View>
  //       <View style={styles.row}>
  //         <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
  //         {item.defective > 0 && (
  //           <Text style={styles.defectiveText}>Defective: {item.defective || 0}</Text>
  //         )}
  //       </View>
  //     </TouchableOpacity>
  //   </View>
  // );

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

      {/* <FlatList
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
      /> */}

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


  {/*<FlatList
    //data={order.products}
    //keyExtractor={(item, index) => index.toString()}
    //contentContainerStyle={styles.scrollContainer}
    //showsVerticalScrollIndicator={false}
    // renderItem={renderItem}
    // renderItem={({ item }) => (
    //   <View style={styles.listItemContainer}>
    //     <CheckBox
    //       value={item.checked || false}
    //       onValueChange={(newValue) => {
    //         const updatedProducts = order.products.map((product, idx) => 
    //           idx === index ? {...product, checked: newValue} : product
    //         );
    //         setOrder({...order, products: updatedProducts});
    //       }}
    //       style={styles.checkbox}
    //     />
    //     <TouchableOpacity 
    //       style={styles.productCard}
    //       onPress={() => openModal(item)}
    //     >
    //       <View style={styles.row}>
    //         <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
    //         {item.defective > 0 && (
    //           <Text style={styles.approvedText}>Approved: {item.approved || 'No'}</Text>
    //         )}
    //       </View>
    //       <View style={styles.row}>
    //         <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
    //         {item.defective > 0 && (
    //           <Text style={styles.defectiveText}>Defective: {item.defective || 0}</Text>
    //         )}
    //       </View>
    //     </TouchableOpacity>
    //   </View>
    // )}
   /> */}
  
  {/* Fixed "Resend to QC" button at bottom */}
  {/* <TouchableOpacity 
    style={styles.resendButton}
    onPress={() => {
      const selectedItems = order.products.filter(item => item.checked);
      if (selectedItems.length === 0) {
        alert("Please select at least one item");
        return;
      }
      // Your resend to QC logic here
      alert(`${selectedItems.length} items sent to QC`);
    }}
  >
    <Text style={styles.resendButtonText}>Resend to QC</Text>
  </TouchableOpacity> */}

{hasDefectiveItems && (
        <TouchableOpacity 
          style={styles.resendButton}
          onPress={resendToQC}
        >
          <Text style={styles.resendButtonText}>Resend to QC</Text>
        </TouchableOpacity>
      )}

      
      <Modal transparent={true} visible={modalVisible} animationType="none" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />

          <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Production</Text>
            </View>

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
                      <Text style={styles.detailValue}>{selectedProduct.productType}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Model No</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{selectedProduct.modelNo}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Order Type</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{selectedProduct.orderType}</Text>
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
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{selectedProduct.quantity}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Delivery Time</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <Text style={styles.detailValue}>{selectedProduct.deliveryTime}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <Text style={styles.detailColon}>:</Text>
                      <TouchableOpacity
                        style={styles.touchable}
                        onPress={openStatusModal}
                      >
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

      <Modal transparent={true} visible={statusModalVisible} animationType="none" onRequestClose={closeStatusModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeStatusModal} />

          <Animated.View style={[styles.modalContent, {
            transform: [{ translateY: statusSlideAnim }],
            height: height * 0.15 
          }]}>
            <View style={styles.dragIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Update Status</Text>
            </View>

            <View style={styles.modalBody}>
              {renderStatusOptions()}
              
              {order.status === "Process 4 " && (
                <TouchableOpacity
                  style={[styles.statusButton, styles.readyToQCButton]}
                  onPress={() => updateStatus("Ready to QC")}
                >
                  {/* <Text style={styles.statusButtonText}>Ready to QC</Text> */}
                </TouchableOpacity>
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

  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 10,
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



  resendButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1B2F2E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    color: '#D6B06B',
    fontFamily: "Lato-Regular",
    fontSize: 16,
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
    marginBottom: 10,
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

});

export default OrderDetails;