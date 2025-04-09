import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    TextInput,
    Alert,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const Defected = ({ route, navigation }) => {
    const [defectReason, setDefectReason] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { order } = route.params;
    const [quantity, setQuantity] = useState('');
    const [products, setProducts] = useState(order.products);
    const [warningMessage, setWarningMessage] = useState('');

    const handleGoBack = () => {
        console.log("Navigating back...");
        navigation.goBack();
    };

    const handleSubmit = () => {
        if (selectedProduct && quantity && defectReason) {
            const enteredQuantity = parseInt(quantity, 10);
            const totalQuantity = selectedProduct.quantity;

            if (enteredQuantity > totalQuantity) {
                setWarningMessage(`Warning: Total quantity is ${totalQuantity}. You cannot enter more than that.`);
                return;
            }

            const updatedProducts = products.map(product => {
                if (product.productCode === selectedProduct.productCode) {
                    return {
                        ...product,
                        defectedQuantity: enteredQuantity,
                        approvedQuantity: product.quantity - enteredQuantity,
                        defectReason: defectReason
                    };
                }
                return product;
            });
            setProducts(updatedProducts);
            setDefectReason('');
            setQuantity('');
            setModalVisible(false);
            setWarningMessage(''); 
        }
    };

    const handleProductPress = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
        setWarningMessage(''); 
    };

    const handleQuantityChange = (text) => {
        if (/^\d*$/.test(text)) {
            setQuantity(text);
        }
    };

    const totalDefectedProducts = products.filter(product => product.defectedQuantity > 0).length;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleGoBack}>
                    <ArrowLeft size={width * 0.06} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Defected</Text>
                <View style={styles.headerSpacer} />
            </View>

            <Text style={styles.defectedCountText}>Selected ({totalDefectedProducts})</Text>

            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProductPress(item)}>
                        <View style={styles.productCard}>
                            <View style={styles.topRow}>
                                <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
                                {item.approvedQuantity && (
                                    <Text style={styles.productApproved}>Approved: {item.approvedQuantity}</Text>
                                )}
                            </View>
                            <View style={styles.bottomRow}>
                                <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
                                {item.defectedQuantity && (
                                    <Text style={styles.productDefected}>Defected: {item.defectedQuantity}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Defected Reason</Text>

                        <TextInput
                            style={styles.productQuantity1}
                            value={quantity}
                            onChangeText={handleQuantityChange}
                            keyboardType="numeric"
                            placeholder="Qty"
                        />

                        {warningMessage ? (
                            <Text style={styles.warningText}>{warningMessage}</Text>
                        ) : null}

                        <TextInput
                            style={styles.input}
                            placeholder="Enter defect reason"
                            value={defectReason}
                            onChangeText={setDefectReason}
                        />

                        <View style={styles.saveContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    productCard: {
        backgroundColor: "#fff",
        padding: width * 0.04,
        paddingHorizontal: width * 0.06,
        paddingVertical: height * 0.03,
        borderBottomWidth: 1,
        borderBottomColor: "#F4F4F4",
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: width * 0.01,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    productName: {
        fontSize: 16,
        fontFamily: "Lato-Regular",
        color: "#202020",
    },
    productQuantity: {
        fontSize: 14,
        color: "#838383",
        marginTop: height * 0.014,
        fontFamily: "Lato-Regular",
    },
    productDefected: {
        fontSize: width * 0.035,
        color: "#E5484D",
        fontFamily: "Lato-Regular",
    },
   
    productApproved: {
        fontSize: width * 0.035,
        color: "#17BE78",
        fontFamily: "Lato-Regular",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    productQuantity1: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },

    saveContainer: {
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: ' center',
        width: "100%",
        gap: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: '#1B2F2E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        width: width * 0.3,
        alignItems: "center",
    },
    submitButtonText: {
        color: '#D6B06B',
        fontSize: width * 0.045,
        fontFamily: 'Lato-Bold',
    },
    closeButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "#1B2F2E",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        width: width * 0.3,
        alignItems: "center",
    },
    closeButtonText: {
        color: '#1B2F2E',
        fontSize: width * 0.045,
        fontFamily: 'Lato-Bold',
    },
    defectedCountText: {
        fontSize: width * 0.04,
        fontFamily:'Lato-Regular',
        paddingVertical: height * 0.01,
        paddingHorizontal:width*0.05,
        color: "#202020",
    },
    warningText: {
        fontSize: width * 0.035,
        color: "#D6B06B",
        marginBottom: width * 0.03,
        fontFamily:"Lato-Regular",
    },
});

export default Defected;