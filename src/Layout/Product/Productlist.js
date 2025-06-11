// import React, { useState, useRef, useEffect } from "react";
// import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, Dimensions, Animated, TouchableWithoutFeedback } from "react-native";
// import Icon from "react-native-vector-icons/Ionicons";
// import { Plus, Search, ArrowLeft, CircleChevronDown, Filter, MoreVertical, Edit, Trash2 } from "lucide-react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

// import { Snackbar } from 'react-native-paper';

// const products = [
//   { id: "1", name: "Membrane Door", code: "TMD-01", category: "Membrane Doors", thickness: "35mm", height: "70\"", width: "34\"", ColorShade: "aaaa", image: require("./image/images.jpg") },
//   { id: "2", name: "2D Membrane Door", code: "TM 2D-03", category: "2D Membrane Doors", thickness: "55mm", height: "75\"", width: "34\"", ColorShade: "aaaa", image: require("./image/images.jpg") },
//   { id: "3", name: "3D Membrane Door", code: "TM 2D-13", category: "3D Membrane Doors", thickness: "50mm", height: "75\"", width: "34\"", ColorShade: "aaaa", image: require("./image/mmm.jpg") },
//   { id: "4", name: "Laminates Door", code: "TLM-01", category: "Laminates Doors", thickness: "10mm", height: "75\"", width: "34\"", ColorShade: "aaaa", image: require("./image/images.jpg") },
//   { id: "5", name: "Membrane Door", code: "TMD-02", category: "Membrane Doors", thickness: "40mm", height: "75\"", width: "34\"", ColorShade: "aaaa", image: require("./image/images.jpg") },
//   { id: "6", name: "Membrane Door", code: "TMD-23", category: "Membrane Doors", thickness: "25mm", height: "75\"", width: "34\"", ColorShade: "aaaa", image: require("./image/images.jpg") },
// ];

// const { width, height } = Dimensions.get("window");

// const ProductList = () => {
//   const [searchVisible, setSearchVisible] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const slideAnim = useRef(new Animated.Value(300)).current;
//   const navigation = useNavigation();


//   const [showOptions, setShowOptions] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [snackbarVisible, setSnackbarVisible] = useState(false);

//   const handleEdit = () => {
//     navigation.navigate("EditProduct", { product: selectedProduct });
//   };

//   const handleDelete = () => {
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     console.log("Product Deleted:", selectedProduct);
//     setShowDeleteModal(false);
//     setSnackbarVisible(true); 
//   };




//   const filteredProducts = products.filter((item) =>
//     (!selectedCategory || item.category === selectedCategory) &&
//     (item.name.toLowerCase().includes(searchText.toLowerCase()) ||
//       item.code.toLowerCase().includes(searchText.toLowerCase()))
//   );


//   const handleArrowLeftClick = () => {
//     if (searchVisible) {
//       setSearchVisible(false);
//       setSearchText("");
//     } else if (showOverlay) {
//       setShowOverlay(false);
//     } else if (selectedCategory) {
//       setSelectedCategory(null);
//     } else {
//       navigation.goBack();
//     }
//   };

//   const handleSearch = (text) => {
//     setSearchText(text);
//   };

//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: showOverlay ? 0 : 300,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [showOverlay]);

//   const [isProductSheetVisible, setProductSheetVisible] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const modalTranslateY = useSharedValue(height);

//   const modalStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: modalTranslateY.value }],
//   }));

//   const openProductSheet = (product) => {
//     setSelectedProduct(product);
//     setProductSheetVisible(true);
//   };

//   const closeProductSheet = () => {
//     setProductSheetVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={handleArrowLeftClick}>
//           <ArrowLeft size={24} color="#202020" />
//         </TouchableOpacity>
//         {searchVisible ? (
//           <View style={styles.searchBox}>
//             <Search size={16} color="#838383" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search..."
//               value={searchText}
//               onChangeText={handleSearch}
//               autoFocus
//             />
//           </View>
//         ) : (
//           <Text style={styles.headerTitle}>Product</Text>
//         )}
//         <View style={styles.iconContainer}>
//           {!searchVisible && (
//             <>
//               <TouchableOpacity onPress={() => setShowOverlay(true)}>
//                 <Filter size={24} color="#000" />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setSearchVisible(true)}>
//                 <Search size={24} color="#202020" />
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>

//       <FlatList
//         data={filteredProducts}
//         contentContainerStyle={styles.ProductList}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.productCard}
//             // onPress={() => navigation.navigate("ProductDetail", { product: item })}
//             onPress={() => openProductSheet(item)}
//           >
//             <View style={styles.productInfo}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.productCode}>{item.code}</Text>
//             </View>
//             {/* <CircleChevronRight size={24} color="#333" /> */}
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.productType}
//         nestedScrollEnabled={true}
//         showsVerticalScrollIndicator={false}
//       />


//       <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate("AddProduct")}>
//         <Plus size={width * 0.08} color="white" />
//       </TouchableOpacity>

//       {showOverlay && (
//         <TouchableWithoutFeedback onPress={() => setShowOverlay(false)}>
//           <View style={styles.dimBackground}>
//             <Animated.View style={[styles.overlayContainer, { transform: [{ translateY: slideAnim }] }]}>
//               <View style={styles.overlay}>
//                 <Text style={styles.overlayHeaderText}>Select a Product</Text>
//                 {[
//                   "Membrane Doors",
//                   "2D Membrane Doors",
//                   "3D Membrane Doors",
//                   "Membrane Brass Doom Doors",
//                   "Membrane Double Doors",
//                   "Micro Coated Doors",
//                   "Steel Beading Doors",
//                   "Laminates Doors",
//                   "UV Digital Doors",
//                   "Laminates Embossed Doors",
//                 ].map((category, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.overlayItem}
//                     onPress={() => {
//                       setSelectedCategory(category);
//                       setShowOverlay(false);
//                     }}
//                   >
//                     <Text style={styles.overlayText}>{category}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </Animated.View>
//           </View>
//         </TouchableWithoutFeedback>
//       )}

//       {/* {isProductSheetVisible && (
//         <TouchableWithoutFeedback onPress={closeProductSheet}>
//           <View style={styles.dimBackground}>
//             <Animated.View style={[styles.bottomSheet]}>
//               <View style={styles.dragIndicator} />
//               <View style={styles.header}>
//                 <Text style={styles.sectionTitle}>Product Details</Text>
//                 <TouchableOpacity style={styles.menuButton}>
//                   <MoreVertical size={24} color="black" />
//                 </TouchableOpacity>
//               </View>
//               {selectedProduct && (
//                 <View style={styles.productDetails}>
//                   <View style={styles.detailRow}>
//                     <View style={styles.column1}>
//                       <Text style={styles.detailLabel}>Product Type</Text>
//                     </View>
//                     <View style={styles.column}>
//                       <Text style={styles.detailLabel1}>:</Text>
//                     </View>
//                     <View style={styles.column2}>
//                       <Text style={styles.detailValue}>{selectedProduct.category}</Text>
//                     </View>
//                   </View>

//                   <View style={styles.detailRow}>
//                     <View style={styles.column1}>
//                       <Text style={styles.detailLabel}>Model No</Text>
//                     </View>
//                     <View style={styles.column}>
//                       <Text style={styles.detailLabel1}>:</Text>
//                     </View>
//                     <View style={styles.column2}>
//                       <Text style={styles.detailValue}>{selectedProduct.code}</Text>
//                     </View>
//                   </View>

                 

//                   <View style={styles.detailRow}>
//                     <View style={styles.column1}>
//                       <Text style={styles.detailLabel}>Size</Text>
//                     </View>
//                     <View style={styles.column}>
//                       <Text style={styles.detailLabel1}>:</Text>
//                     </View>
//                     <View style={styles.column2}>
//                       <Text style={styles.detailValue}>{selectedProduct.height} x {selectedProduct.width}</Text>
//                     </View>
//                   </View>

//                   <View style={styles.detailRow}>
//                     <View style={styles.column1}>
//                       <Text style={styles.detailLabel}>Skin ColorShade</Text>
//                     </View>
//                     <View style={styles.column}>
//                       <Text style={styles.detailLabel1}>:</Text>
//                     </View>
//                     <View style={styles.column2}>
//                       <Text style={styles.detailValue}>{selectedProduct.ColorShade}</Text>
//                     </View>
//                   </View>

//                   <View style={styles.detailRow}>
//                     <View style={styles.column1}>
//                       <Text style={styles.detailLabel}>Thickness</Text>
//                     </View>
//                     <View style={styles.column}>
//                       <Text style={styles.detailLabel1}>:</Text>
//                     </View>
//                     <View style={styles.column2}>
//                       <Text style={styles.detailValue}>{selectedProduct.thickness}</Text>
//                     </View>
//                   </View>
//                 </View>
//               )}

//             </Animated.View>
//           </View>
//         </TouchableWithoutFeedback> */}
//      {(isProductSheetVisible && !showDeleteModal) && (
//   <TouchableWithoutFeedback onPress={closeProductSheet}>
//     <View style={styles.dimBackground}> 
//       <Animated.View style={[styles.bottomSheet]}>
//         <View style={styles.dragIndicator} />
//         <View style={styles.header}>
//           <Text style={styles.sectionTitle}>Product Details</Text>
//           {showOptions ? (
//             <View style={styles.optionsContainer}>
//               <TouchableOpacity onPress={handleEdit}>
//                 <Edit size={24} color="black" />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleDelete}>
//                 <Trash2 size={24} color="red" />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <TouchableOpacity style={styles.menuButton} onPress={() => setShowOptions(true)}>
//               <MoreVertical size={24} color="black" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {selectedProduct && (
//           <View style={styles.productDetails}>
//             <View style={styles.detailRow}>
//               <View style={styles.column1}>
//                 <Text style={styles.detailLabel}>Product Type</Text>
//               </View>
//               <View style={styles.column}>
//                 <Text style={styles.detailLabel1}>:</Text>
//               </View>
//               <View style={styles.column2}>
//                 <Text style={styles.detailValue}>{selectedProduct.category}</Text>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.column1}>
//                 <Text style={styles.detailLabel}>Model No</Text>
//               </View>
//               <View style={styles.column}>
//                 <Text style={styles.detailLabel1}>:</Text>
//               </View>
//               <View style={styles.column2}>
//                 <Text style={styles.detailValue}>{selectedProduct.code}</Text>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.column1}>
//                 <Text style={styles.detailLabel}>Size</Text>
//               </View>
//               <View style={styles.column}>
//                 <Text style={styles.detailLabel1}>:</Text>
//               </View>
//               <View style={styles.column2}>
//                 <Text style={styles.detailValue}>
//                   {selectedProduct.height} x {selectedProduct.width}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.column1}>
//                 <Text style={styles.detailLabel}>Skin ColorShade</Text>
//               </View>
//               <View style={styles.column}>
//                 <Text style={styles.detailLabel1}>:</Text>
//               </View>
//               <View style={styles.column2}>
//                 <Text style={styles.detailValue}>{selectedProduct.ColorShade}</Text>
//               </View>
//             </View>

//             <View style={styles.detailRow}>
//               <View style={styles.column1}>
//                 <Text style={styles.detailLabel}>Thickness</Text>
//               </View>
//               <View style={styles.column}>
//                 <Text style={styles.detailLabel1}>:</Text>
//               </View>
//               <View style={styles.column2}>
//                 <Text style={styles.detailValue}>{selectedProduct.thickness}</Text>
//               </View>
//             </View>
//           </View>
//         )}
//       </Animated.View>
//     </View>
//   </TouchableWithoutFeedback>
// )}


// {/* Dim Background when Delete Confirmation is Open */}
// {showDeleteModal && (
//   <View style={styles.dimBackground}>
//     <View style={styles.modalContainer}>
//       <View style={styles.modalContent}>
//         <Text style={styles.modalText}>Are you sure you want to delete this Product?</Text>
//         <View style={styles.modalButtons}>
//           <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
//             <Text style={styles.buttonText}>Yes</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.cancelButton}>
//             <Text style={styles.buttonText}>No</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </View>
// )}






//     </View>
//     <Snackbar
//     visible={snackbarVisible}
//     onDismiss={() => setSnackbarVisible(false)}
//     duration={3000}
//     style={styles.snackbar}
//   >
//     Product deleted successfully!
//   </Snackbar>
//   );
// };


// const products = [
//   { id: "1", name: "Membrane Door", code: "TMD-01", category: "Membrane Doors", thickness: "35mm", height: "70\"", width: "34\"",ColorShade:"aaaa",  },
//   { id: "2", name: "2D Membrane Door", code: "TM 2D-03", category: "2D Membrane Doors", thickness: "55mm", height: "75\"", width: "34\"",ColorShade:"aaaa",  },
//   { id: "3", name: "3D Membrane Door", code: "TM 2D-13", category: "3D Membrane Doors", thickness: "50mm", height: "75\"", width: "34\"",ColorShade:"aaaa",  },
//   { id: "4", name: "Laminates Door", code: "TLM-01", category: "Laminates Doors", thickness: "10mm", height: "75\"", width: "34\"",ColorShade:"aaaa",  },
//   { id: "5", name: "Membrane Door", code: "TMD-02", category: "Membrane Doors", thickness: "40mm", height: "75\"", width: "34\"",ColorShade:"aaaa", },
//   { id: "6", name: "Membrane Door", code: "TMD-23", category: "Membrane Doors", thickness: "25mm", height: "75\"", width: "34\"",ColorShade:"aaaa", },
// ];



import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, Dimensions, Animated, TouchableWithoutFeedback,ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Plus, Search, ArrowLeft, CircleChevronDown, Filter, MoreVertical,CircleChevronRight,Edit,Trash2  } from "lucide-react-native";



import { useNavigation } from "@react-navigation/native";
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { deleteProduct, getProduct } from "../../Utils/apiService";



const { width, height } = Dimensions.get("window");
const ProductList = () => {

  const [products, setProducts] = useState([]); // Store fetched products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error handling
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const navigation = useNavigation();
  const [isProductSheetVisible, setProductSheetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getProduct();
        console.log("Fetched Products:", fetchedData);
        console.log("Fetched ProductsSSS:", fetchedData);

        
        

        if (fetchedData && Array.isArray(fetchedData.data)) {
          setProducts(fetchedData.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((item) =>
    (!selectedCategory || item.category === selectedCategory) &&
    ((item.productname && item.productname.toLowerCase().includes(searchText.toLowerCase())) ||
     (item.modelno && item.modelno.toLowerCase().includes(searchText.toLowerCase())))
  );

  const handleArrowLeftClick = () => {
    if (searchVisible) {
      setSearchVisible(false);
      setSearchText("");
    } else if (showOverlay) {
      setShowOverlay(false);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      // if (navigation.canGoBack()) {
      //   navigation.navigate("Navbaritemadmin")
      // } else {
      //   console.warn("No previous screen to go back to.");
      // }
      navigation.goBack();
    }
  };
  const openProductSheet = (product) => {
    setSelectedProduct(product);
    setProductSheetVisible(true);
  };

  const closeProductSheet = () => {
    setProductSheetVisible(false);
  };
  const handleSearch = (text) => {
    setSearchText(text);
  };
  

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showOverlay ? 0 : 300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showOverlay]);


  const handleEdit = () => {
    console.log('edited page');
    
     navigation.navigate("Updateproduct", { product: selectedProduct });
  };

  const handleDelete =async () => {
try {
console.log("selectedProduct",selectedProduct._id);
const id=selectedProduct._id
console.log("prodcut delete id ",id);

const response=await deleteProduct(id)
console.log('response for delete',response);

  setShowDeleteModal(true);
} catch (error) {
  
}

  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleArrowLeftClick}>
          <ArrowLeft size={24} color="#202020" />
        </TouchableOpacity>

        {searchVisible ? (
          <View style={styles.searchBox}>
            <Search size={16} color="#838383" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        ) : (
          <Text style={styles.headerTitle}>Product</Text>
        )}

        <View style={styles.iconContainer}>
          {!searchVisible && (
            <>
              <TouchableOpacity onPress={() => setShowOverlay(true)}>
                <Filter size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSearchVisible(true)}>
                <Search size={24} color="#202020" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          contentContainerStyle={styles.ProductList}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productCard} onPress={() => openProductSheet(item)}>
            <View style={styles. productInfo}>
              {/* Left: Product Name */}
              <Text style={styles.productName}>
                {item.producttype || item.modelno || "Unnamed Product"}
              </Text>
            <Text style={styles.productCode}>{item.modelno}</Text>
              
              {/* Right: Chevron Icon */}
              {/* <CircleChevronRight size={24} color="#333" /> */}
            </View>
          
            {/* Model Number Below */}
          </TouchableOpacity>
          
          )}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabButton} onPress={() => navigation.navigate("AddProduct")}>
        <Plus size={width * 0.08} color="white" />
      </TouchableOpacity>

      {/* Filter Overlay */}
      {showOverlay && (
        <TouchableWithoutFeedback onPress={() => setShowOverlay(false)}>
          <View style={styles.dimBackground}>
            <Animated.View style={[styles.overlayContainer, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.overlay}>
                <Text style={styles.overlayHeaderText}>Select a Product</Text>
                {[
                  "Membrane Doors",
                  "2D Membrane Doors",
                  "3D Membrane Doors",
                  "Laminates Doors",
                ].map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.overlayItem}
                    onPress={() => {
                      setSelectedCategory(category);
                      setShowOverlay(false);
                    }}
                  >
                    <Text style={styles.overlayText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
          {(isProductSheetVisible && !showDeleteModal) && (
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View style={styles.dimBackground}>
            <Animated.View style={[styles.bottomSheet]}>
              <View style={styles.dragIndicator} />
              <View style={styles.header}>
                <Text style={styles.sectionTitle}>Product Details</Text>

                {showOptions ? (
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={handleEdit}>
                <Edit size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Trash2 size={24} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.menuButton} onPress={() => setShowOptions(true)}>
              <MoreVertical size={24} color="black" />
            </TouchableOpacity>
          )}
                {/* <TouchableOpacity style={styles.menuButton}>
                  <MoreVertical size={24} color="black" />
                </TouchableOpacity> */}
              </View>
              {selectedProduct && (
                <View style={styles.productDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.column1}>
                      <Text style={styles.detailLabel}>Product Type</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.detailLabel1}>:</Text>
                    </View>
                    <View style={styles.column2}>
                      <Text style={styles.detailValue}>{selectedProduct.producttype}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.column1}>
                      <Text style={styles.detailLabel}>Model No</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.detailLabel1}>:</Text>
                    </View>
                    <View style={styles.column2}>
                      <Text style={styles.detailValue}>{selectedProduct.modelno}</Text>
                    </View>
                  </View>

                 

                  <View style={styles.detailRow}>
                    <View style={styles.column1}>
                      <Text style={styles.detailLabel}>Size</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.detailLabel1}>:</Text>
                    </View>
                    <View style={styles.column2}>
                      <Text style={styles.detailValue}>{selectedProduct.height} x {selectedProduct.width}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.column1}>
                      <Text style={styles.detailLabel}>Skin ColorShade</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.detailLabel1}>:</Text>
                    </View>
                    <View style={styles.column2}>
                    <Text style={styles.detailValue}>
  {selectedProduct?.colorshadeDetails?.colorshadename || "N/A"}
</Text>


                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.column1}>
                      <Text style={styles.detailLabel}>Thickness</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.detailLabel1}>:</Text>
                    </View>
                    <View style={styles.column2}>
                      <Text style={styles.detailValue}>{selectedProduct.thickness}</Text>
                    </View>
                  </View>
                </View>
              )}

            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",  // Align icons horizontally
    alignItems: "center",  // Center vertically
    gap: 10,               // Space between icons
    backgroundColor: "#f8f8f8", // Light background
    padding: 8,
    borderRadius: 8,       // Rounded corners
    elevation: 2,          // Shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.04,
    backgroundColor: '#fff',
  },

  headerTitle: {
    fontSize: width * 0.05,
    color: '#1E1F24',
    fontFamily: 'Lato-Bold',
  },
  iconContainer: { flexDirection: "row", gap: 10 },
  productItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  productName: { fontSize: 18, fontWeight: "bold",flex: 1 },
  productRow: {
    flexDirection: "row",  // Align text & icon in the same row
    justifyContent: "space-around",  // Push elements apart
    alignItems: "center",  // Keep items aligned in the center vertically
  },
  productCode: { color: "gray" },
  fabButton: { position: "absolute", bottom: 20, right: 20, backgroundColor: "#007bff", padding: 15, borderRadius: 50 },
  dimBackground: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginHorizontal: width * 0.03,
    paddingHorizontal: width * 0.03,
    borderColor: '#CECECE',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#202020',
    paddingHorizontal: width * 0.03,
    fontFamily: 'Lato-Regular',
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },

  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: width * 0.06,
    borderTopRightRadius: width * 0.06,
    padding: width * 0.05,
    minHeight: height * 0.30,
  },
  overlayHeaderText: {
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2,
    height: height * 0.003,
    borderRadius: width * 0.01,
    alignSelf: 'center',
  },
  overlayItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  overlayText: {
    fontSize: width * 0.045,
    fontFamily: 'Lato-Regular',
    color: '#202020'
  },

  dimBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: 4,
    marginBottom: height * 0.015,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#202020',
  },
  ProductList: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },

  productInfo: {
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  productName: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'Lato-Regular',
  },
  productCode: {
    color: "gray",
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    lineHeight: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#00796B",
  },
  fabButton: {
    position: 'absolute',
    bottom: height * 0.06,
    right: width * 0.08,
    backgroundColor: '#1B2F2E',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This ensures spacing between elements
    alignItems: 'center',
    padding: 10,
  },

  overlay1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.4,
    elevation: 5,
  },
  // bottomSheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, height: height * 0.4 },
  dragIndicator: { width: 40, height: 4, backgroundColor: "#ccc", alignSelf: "center", borderRadius: 2, marginBottom: 10 },
  productDetails: {
    // // marginBottom: 20
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,
    // // backgroundColor: '#f9f9f9',
    // borderRadius: 10,
    // // margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', 
    padding: 20
  },
  sectionTitle: {
    // fontSize: 18, fontWeight: "bold", marginBottom: 10
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  menuButton: {
    padding: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-start', 
  },
  // detailText: { fontSize: 16, marginBottom: 5 },
  // detailRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',// Center the text horizontally
  //   // alignItems: 'center', // Center the text vertically
  //   // marginBottom: 10,
  //   width: '80%',
  //   marginBottom: 10,
  //   // flexDirection: 'row',
  //   // marginVertical: 5, // Adds space between each row
  //   // justifyContent: 'space-between',
  // },
  detailLabel: {
    fontWeight: 'bold', 
    fontSize: 14,
    color: '#838383',
    marginRight: 10,
    fontFamily: 'Lato-Regular',
  },
  column: {
    marginRight: 10, 
    // flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'center'
  },
  column1: {
    marginRight: 10, 
    // flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    width: "45%",
    
  },
  column2: {
    marginRight: 10, 
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  detailLabel1: {
    marginLeft: 1,
    marginRight: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#202020', 
    fontFamily: 'Lato-Regular',
  },
});

export default ProductList;