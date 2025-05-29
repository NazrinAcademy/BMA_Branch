import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SalesOrderAccept = ({ route, navigation }) => {
    const { order, updateRejectedOrders } = route.params;

    const handleGoBack = () => {
        console.log("Navigating back...");
        navigation.goBack();
    };

    useFocusEffect(
        React.useCallback(() => {
            console.log("OrderAccept focused");
            return () => {
                console.log("OrderAccept unfocused");
            };
        }, [])
    );

    useEffect(() => {
        return () => {
            console.log("OrderAccept unmounted");
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleGoBack}>
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
                    <TouchableOpacity>
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.productName} - {item.productCode}</Text>
                            <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.saveContainer}>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton1}>
                    <Text style={styles.saveButtonText1}>Reject</Text>
                </TouchableOpacity>
            </View>
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
        fontFamily:'Lato-Bold',
    },
    saveButtonText1: {
        color: '#D6B06B',
        fontSize: width * 0.045,
        fontFamily:'Lato-Bold',
    },
});

export default SalesOrderAccept;