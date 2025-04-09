import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ArrowLeft, Search, Clock } from "lucide-react-native"; 
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");

const ordersData = {
    Ordered: [
        {
            id: "1",
            shopName: "Modern Furnishings",
            vendorName: "Ravi",
            phone: "9876543210",
            address: "789, Elm Street, Bangalore",
            city: "Bangalore",
            pincode: "560001",
            date: "15.03.25",
            orderId: "00A008",
            salesman: "Kumar",
            ExpectedDate: "23-03-2025",
            products: [
                {
                    productType: "Membrane Door",
                    quantity: 4,
                    modelNo: "TMD-01",
                    size: { width: 84, height: 36 },
                    skinColorShade: "Beige",
                    thickness: "2.0mm",
                    processes: [
                        { name: "Process 1", timePerUnit: 2 },
                        { name: "Process 2", timePerUnit: 1.5 },
                        { name: "Process 3", timePerUnit: 1 },
                        { name: "Process 4", timePerUnit: 0.5 },
                    ],
                    totalProcessTime: 0,
                    additionalTimePerUnit: 0.5,
                },
                {
                    productType: "Wooden Door",
                    quantity: 10,
                    modelNo: "TWD-02",
                    size: { width: 90, height: 40 },
                    skinColorShade: "Brown",
                    thickness: "3.0mm",
                    processes: [
                        { name: "Process 1", timePerUnit: 3 },
                        { name: "Process 2", timePerUnit: 2 },
                        { name: "Process 3", timePerUnit: 1.5 },
                        { name: "Process 4", timePerUnit: 2.5 },
                    ],
                    totalProcessTime: 0,
                    additionalTimePerUnit: 1,
                },
                {
                    productType: "2D-Membrane Door",
                    quantity: 15,
                    modelNo: "TWD-02",
                    size: { width: 67, height: 50 },
                    skinColorShade: "RoseNut",
                    thickness: "3.0mm",
                    processes: [
                        { name: "Process 1", timePerUnit: 2 },
                        { name: "Process 2", timePerUnit: 2.5 },
                        { name: "Process 3", timePerUnit: 1 },
                        { name: "Process 4", timePerUnit: 0.5 },
                    ],
                    totalProcessTime: 0,
                    additionalTimePerUnit: 0.3,
                },
            ],
        },
    ],
};

const calculateProcessingTime = (products) => {
    products.forEach((product) => {
        // Calculate base process time (sum of all process times)
        let baseProcessTime = 0;
        product.processes.forEach((process) => {
            baseProcessTime += process.timePerUnit;
        });

        // Calculate additional time for quantities beyond the first
        const additionalQuantities = product.quantity - 1;
        const additionalTime = additionalQuantities * product.additionalTimePerUnit;

        // Total process time = base process time + additional time
        product.totalProcessTime = baseProcessTime + additionalTime;
    });

    return products;
};

const calculateStartDate = (totalProcessTime, endDate) => {
    const workingHoursPerDay = 8; // 9 AM to 5 PM
    const totalWorkingDays = Math.ceil(totalProcessTime / workingHoursPerDay);

    // Convert endDate to a Date object
    const endDateObj = new Date(endDate.split("-").reverse().join("-"));
    endDateObj.setHours(17, 0, 0, 0); // End at 5 PM

    // Subtract working days from the end date
    for (let i = 0; i < totalWorkingDays; i++) {
        endDateObj.setDate(endDateObj.getDate() - 1);

        // Skip Sundays (only Sunday is a weekend)
        while (endDateObj.getDay() === 0) {
            endDateObj.setDate(endDateObj.getDate() - 1);
        }
    }

    // Calculate the exact time within the working hours
    const remainingHours = totalProcessTime % workingHoursPerDay;

    // Subtract remaining hours from the start of the working day (9 AM)
    endDateObj.setHours(9, 0, 0, 0); 
    endDateObj.setHours(endDateObj.getHours() + (workingHoursPerDay - remainingHours));

    // Format the date and time
    const formattedDate = endDateObj.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return formattedDate;
};

const BeforeOrder = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    // const allOrders = Object.values(ordersData).flat();
    const [orders, setOrders] = useState(Object.values(ordersData).flat());

    const filteredOrders =  orders.filter(
        (order) =>
            order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery)
    );

    const totalQuantity = filteredOrders.reduce((sum, order) => {
        return sum + order.products.reduce((orderSum, product) => orderSum + product.quantity, 0);
    }, 0);

    const handleOrderPress = (item) => {
        navigation.navigate("AcceptOrderDetails", { order: item, onAccept: handleAccept, onReject: handleReject });
    };

    const handleAccept = (orderId) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    };

    const handleReject = (orderId) => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    };
    // Calculate processing time for all orders (for demonstration purposes)
    filteredOrders.forEach((order) => {
        calculateProcessingTime(order.products);

        // Calculate total process time for the order
        const totalProcessTime = order.products.reduce((sum, product) => sum + product.totalProcessTime, 0);

        // Calculate start date
        order.startDate = calculateStartDate(totalProcessTime, order.ExpectedDate);
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (isSearchVisible) {
                        setIsSearchVisible(false);
                    } else {
                        navigation.goBack();
                    }
                }}>
                    <ArrowLeft size={24} color="#1E1F24" />
                </TouchableOpacity>

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
                    <Text style={styles.headerText}>Accept Orders</Text>
                )}

                <View style={styles.rightContainer}>
                    {!isSearchVisible && (
                        <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
                            <Search size={24} color="#1E1F24" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.listHeader}>
                <Text style={styles.totalText}>Total Orders: {filteredOrders.length}</Text>
                <Text style={styles.totalText}>Total Qty: {totalQuantity}</Text>
            </View>

            <ScrollView style={styles.listContainer}>
                {filteredOrders.map((item) => {
                    const updatedProducts = calculateProcessingTime(item.products);
                    const totalProcessTime = updatedProducts.reduce((sum, product) => sum + product.totalProcessTime, 0);

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.orderCard}
                            onPress={() => handleOrderPress(item)}
                        >
                            <View style={styles.orderInfo}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.orderName}>{item.shopName}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Text style={styles.orderPhone}>{item.phone}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                        {/* <Clock size={16} color="#838383" />  */}
                                        <Text style={styles.startDateLabel}>Start Date:</Text>
                                        <Text style={styles.startDateTime}>{item.startDate}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default BeforeOrder
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
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
        fontFamily: 'Lato-Bold',
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
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: '#F4F4F4'
    },
    totalText: {
        fontSize: width * 0.04,
        color: '#1B2F2E',
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.012,
        fontFamily: 'Lato-Regular',
    },
    listContainer: {
        paddingHorizontal: width * 0.04,
    },
    orderCard: {
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: '#fff', padding: width * 0.04,
        borderRadius: 4, marginBottom: height * 0.015,
        shadowColor: '#202020', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 3,
        borderLeftColor: '#202020',
    },
    orderInfo: {
        flex: 1,
    },
    orderName: {
        fontSize: 16, paddingBottom: 8, fontFamily: 'Lato-Regular', color: "#202020"
    },
    orderPhone: { fontSize: 14, color: "gray" },
    startDateLabel: { fontSize: 14, color: "#838383", }, // Label color
    startDateTime: { fontSize: 14, color: "#1B2F2E" }, // Date and time color
});