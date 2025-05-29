// import React, { useState,useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, Image } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { Menu, Bell, CalendarDays, X, UserRound, TimerReset, Settings, LogOut, CircleUserRound, Palette } from 'lucide-react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { TrendingDown, TrendingUp } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
// import { getUserProfile } from '../Utils/apiService';

// const { width, height } = Dimensions.get('window');

// const Home = () => {
//   const [activeTab, setActiveTab] = useState('Today');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarAnimation = useState(new Animated.Value(-250))[0];
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [orders, setOrders] = useState(104);
//   const [production, setProduction] = useState(39);
//   const [delivered, setDelivered] = useState(59);
//   const [issue, setIssue] = useState(6);
//   const [adminname, setAdminname] = useState('');

// useEffect(()=>{
//   try {
//     const featchdetailes=async ()=>{
//       const result=await getUserProfile()
//       console.log("result",result.Admins.name);
//       setAdminname(result.Admins.name)
//     }
//     featchdetailes()
//   } catch (error) {
//     console.log(error);
    
//   }
// },[])


//   const data = {
//     labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//     datasets: [
//       {
//         data: [1, 15, 20, 25, 18, 22, 17], 
//         color: () => '#007BFF', // Blue
//       },
//       {
//         data: [5, 10, 15, 20, 12, 18, 13], 
//         color: () => '#FF9900', // Orange
//       },
//       {
//         data: [3, 8, 13, 18, 10, 15, 10], 
//         color: () => '#28A745', // Green
//       },
//       {
//         data: [1, 3, 5, 7, 4, 6, 3], 
//         color: () => '#DC3545', // Red
//       },
//     ],
//   };


//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const handleTabPress = (tab) => {
//     setActiveTab(tab);
//   };


//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     setSelectedDate(date);
//     hideDatePicker();
//   };
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//     Animated.timing(sidebarAnimation, {
//       toValue: sidebarOpen ? -250 : 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };
//   const SummaryCard = ({ title, value, status, arrowColor }) => {
//     const Icon = status === "up" ? TrendingUp : TrendingDown;

//     return (
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>{title}</Text>
//         <View style={styles.cardValueContainer}>
//           <Text style={[styles.cardValue, { color: arrowColor }]}>{value}</Text>
//           <Icon color={arrowColor} size={20} style={styles.icon} />
//         </View>
//         <Text style={styles.cardFooter}>Last 7 Days</Text>
//       </View>
//     );
//   };
//   const sampleData = {
//     today: [
//       { x: 'Orders', y: 10 },
//       { x: 'Production', y: 20 },
//       { x: 'Delivered', y: 15 },
//       { x: 'Issue', y: 5 },
//     ],
//     weekly: [
//       { x: 'Orders', y: 50 },
//       { x: 'Production', y: 100 },
//       { x: 'Delivered', y: 80 },
//       { x: 'Issue', y: 20 },
//     ],
//     monthly: [
//       { x: 'Orders', y: 200 },
//       { x: 'Production', y: 400 },
//       { x: 'Delivered', y: 350 },
//       { x: 'Issue', y: 50 },
//     ],
//   };


//   const navigation = useNavigation();
//   const navigateToProcessTime = () => {
//     toggleSidebar();
//     navigation.navigate('ProcessTime');
//   };
//   navigateToColorshade
//   const   navigateToColorshade = () => {
//     toggleSidebar();
//     navigation.navigate('Colorshade');
//     // navigation.navigate('Colorshade');
//   };


//   const handlePress = () => {
//     navigation.navigate('Notification'); 
//   };
//   const chartData = sampleData[activeTab];


//   const chartConfig = {
//     backgroundColor: '#ffffff', 
//     backgroundGradientFrom: '#ffffff', 
//     backgroundGradientTo: '#ffffff',
//     decimalPlaces: 0, 
//     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     strokeWidth: 1, 
//     propsForDots: {
//       r: '4', 
//       strokeWidth: '1', 
//       // Dot border width
//       // stroke: '#07BAD1',
//       // backgroundColor: 'white',
//       // stroke: '#ffffff', 
//       // fill: '#ff6384', 
//       stroke: '#07BAD1', 
//             fill: 'white', 
//     },
//     propsForBackgroundLines: {
//       strokeWidth: '1', 
//       stroke: '#e0e0e0', 
//     },
//     style: {
//       borderRadius: 16,
//     },
//   };
//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.sidebar,
//           { transform: [{ translateX: sidebarAnimation }] },
//         ]}
//       >
//         <View style={styles.sidebarContainer}>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={toggleSidebar}
//           >
//             <X size={24} color="#000" />
//           </TouchableOpacity>

//           <View style={styles.profileSection}>
//             <CircleUserRound style={styles.profileImage} />
//             <Text style={styles.profileName}>{adminname}</Text>
//             <Text style={styles.profileRole}>Admin</Text>
//           </View>

//           <View style={styles.menuItems}>
//             <TouchableOpacity style={styles.menuItem}>
//               <UserRound size={20} color="#000" />
//               <Text style={styles.menuText}>Profile</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem} onPress={navigateToProcessTime}>
//               < TimerReset size={20} color="#000" />
//               <Text style={styles.menuText}>Process Time</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem} onPress={navigateToColorshade}>
//               < Palette  size={20} color="#000" />
//               <Text style={styles.menuText}>Color Shade</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//               <Settings size={20} color="#000" />
//               <Text style={styles.menuText}>Settings</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//               <LogOut size={20} color="#000" />
//               <Text style={styles.menuText}>Log Out</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Animated.View>


//       {/* Main Content */}
//       <View style={styles.headerContainer}>
//         <View style={styles.leftContainer}>
//           <TouchableOpacity onPress={toggleSidebar}>
//             <Text style={styles.menu}>
//               <Menu color="#1E1F24" />
//             </Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Admin</Text>
//         </View>
//         <TouchableOpacity onPress={handlePress}>
//           <Text style={styles.notification}>
//             <Bell size={24} color="black" />
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.container1}>
//         <View style={styles.tabs}>

//           {['Today', 'Weekly', 'Monthly'].map((tab) => (
//             <TouchableOpacity
//               key={tab}
//               style={[styles.tabButton, activeTab === tab && styles.activeTab]}
//               onPress={() => handleTabPress(tab)}
//             >
//               <Text
//                 style={[
//                   styles.tabText,
//                   activeTab === tab && styles.activeTabText,
//                 ]}
//               >
//                 {tab}
//               </Text>
//             </TouchableOpacity>
//           ))}
//           <TouchableOpacity style={styles.date} onPress={showDatePicker}>
//             <CalendarDays size={16} color="#BF8965" />
//             <Text style={styles.dateText}>
//               {selectedDate.toLocaleDateString('en-US', { day: '2-digit' })}
//             </Text>

//             <View style={styles.dateText1}>
//               <Text style={styles.monthText}>
//                 {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
//               </Text>
//               <Text style={styles.yearText}>
//                 {selectedDate.toLocaleDateString('en-US', { year: 'numeric' })}
//               </Text>
//             </View>

//             <DateTimePickerModal
//               isVisible={isDatePickerVisible}
//               mode="date"
//               onConfirm={handleConfirm}
//               onCancel={hideDatePicker}
//             />
//           </TouchableOpacity>

//         </View>
//       </View>
//       <ScrollView style={styles.content}  >
//         <View style={styles.container2}>
//           <View style={styles.row}>
//             <SummaryCard
//               title="Orders"
//               value={orders}
//               status="up"
//               arrowColor="#007bff"
//             />
//             <SummaryCard
//               title="Production"
//               value={production}
//               status="up"
//               arrowColor="#D2691E"
//             />
//           </View>
//           <View style={styles.row}>
//             <SummaryCard
//               title="Delivered"
//               value={delivered}
//               status="up"
//               arrowColor="#3CB371"
//             />
//             <SummaryCard
//               title="Issue"
//               value={issue}
//               status="down"
//               arrowColor="#FF4500"
//             />
//           </View>
//         </View>

//         {/* Line Chart */}
//         {/* <VictoryChart theme={VictoryTheme.material} width={320} height={200}>
//         <VictoryLine data={chartData} style={{ data: { stroke: 'blue' } }} />
//         <VictoryAxis />
//         <VictoryAxis dependentAxis />
//       </VictoryChart> */}
// {/* 
// <LineChart
//         data={data}
//         width={Dimensions.get('window').width - 40}
//         height={220}
//         chartConfig={{
//           backgroundColor: '#fff',
//           backgroundGradientFrom: '#fff',
//           backgroundGradientTo: '#fff',
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//         style={styles.chart}
//       /> */}

// <LineChart
//       data={data}
//       width={Dimensions.get('window').width - 40} 
//       height={220} 
//       chartConfig={chartConfig}
//       style={styles.chart}
//       bezier={false} 
//       withDots={true} 
//       withShadow={false} 
//       withInnerLines={true} 
//       withOuterLines={true} 
//     />

//       </ScrollView>
//     </View>
//   );
// };

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Menu, Bell, CalendarDays, X, UserRound, TimerReset, Settings, LogOut, CircleUserRound, Palette } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TrendingDown, TrendingUp,UsersRound } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import { getUserProfile } from '../Utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnimation = useState(new Animated.Value(-250))[0];
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [orders, setOrders] = useState(104);
  const [production, setProduction] = useState(39);
  const [delivered, setDelivered] = useState(59);
  const [issue, setIssue] = useState(6);
  const [adminname, setAdminname] = useState('');

  useEffect(() => {
    try {
      const fetchDetails = async () => {
        const result = await getUserProfile();
        console.log("result", result.Admins.name);
        setAdminname(result.Admins.name);
      };
      fetchDetails();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const updateData = (tab, date) => {
    // Simulate fetching data based on tab and date
    // Replace this with actual API calls or data fetching logic
    if (tab === 'Today') {
      setOrders(104);
      setProduction(39);
      setDelivered(59);
      setIssue(6);
    } else if (tab === 'Weekly') {
      setOrders(500);
      setProduction(200);
      setDelivered(300);
      setIssue(50);
    } else if (tab === 'Monthly') {
      setOrders(2000);
      setProduction(1000);
      setDelivered(1500);
      setIssue(200);
    }
  };

  useEffect(() => {
    updateData(activeTab, selectedDate);
  }, [activeTab, selectedDate]);

  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [1, 15, 20, 25, 18, 22, 17],
        color: () => '#007BFF', // Blue
      },
      {
        data: [5, 10, 15, 20, 12, 18, 13],
        color: () => '#FF9900', // Orange
      },
      {
        data: [3, 8, 13, 18, 10, 15, 10],
        color: () => '#28A745', // Green
      },
      {
        data: [1, 3, 5, 7, 4, 6, 3],
        color: () => '#DC3545', // Red
      },
    ],
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    Animated.timing(sidebarAnimation, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const SummaryCard = ({ title, value, status, arrowColor }) => {
    const Icon = status === "up" ? TrendingUp : TrendingDown;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.cardValueContainer}>
          <Text style={[styles.cardValue, { color: arrowColor }]}>{value}</Text>
          <Icon color={arrowColor} size={20} style={styles.icon} />
        </View>
        <Text style={styles.cardFooter}>Last 7 Days</Text>
      </View>
    );
  };

  const sampleData = {
    today: [
      { x: 'Orders', y: 10 },
      { x: 'Production', y: 20 },
      { x: 'Delivered', y: 15 },
      { x: 'Issue', y: 5 },
    ],
    weekly: [
      { x: 'Orders', y: 50 },
      { x: 'Production', y: 100 },
      { x: 'Delivered', y: 80 },
      { x: 'Issue', y: 20 },
    ],
    monthly: [
      { x: 'Orders', y: 200 },
      { x: 'Production', y: 400 },
      { x: 'Delivered', y: 350 },
      { x: 'Issue', y: 50 },
    ],
  };

  const navigation = useNavigation();
  const navigateToProcessTime = () => {
    toggleSidebar();
    navigation.navigate('ProcessTime');
  };

  const navigateToVendorList = () => {
    toggleSidebar();
    navigation.navigate('VendorList');
  };

  const navigateToAddVendor = () => {
    toggleSidebar();
    navigation.navigate('AddShop');
  };

  const navigateToColorshade = () => {
    toggleSidebar();
    navigation.navigate('Colorshade');
  };

  const handlePress = () => {
    navigation.navigate('Notification');
  };
  const handleLogout=()=>{
    try {
      AsyncStorage.removeItem('adminToken')
      console.log("Admin token cleared");
      navigation.navigate('Screen')
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  }

  const chartData = sampleData[activeTab.toLowerCase()];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 1,
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#07BAD1',
      fill: 'white',
    },
    propsForBackgroundLines: {
      strokeWidth: '1',
      stroke: '#e0e0e0',
    },
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarAnimation }] },
        ]}
      >
        <View style={styles.sidebarContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleSidebar}
          >
            <X size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.profileSection}>
            <CircleUserRound style={styles.profileImage} />
            <Text style={styles.profileName}>{adminname}</Text>
            <Text style={styles.profileRole}>Admin</Text>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <UserRound size={20} color="#000" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToProcessTime}>
              <TimerReset size={20} color="#000" />
              <Text style={styles.menuText}>Process Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToColorshade}>
              <Palette size={20} color="#000" />
              <Text style={styles.menuText} >Color Shade</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Settings size={20} color="#000" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToVendorList}>
              <UsersRound size={20} color="#000" />
              <Text style={styles.menuText}>Vendor List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={navigateToAddVendor}>
              <UsersRound size={20} color="#000" />
              <Text style={styles.menuText}>Add Vendor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <LogOut size={20} color="#000" />
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.headerContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Text style={styles.menu}>
              <Menu color="#1E1F24" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>Admin</Text>
        </View>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.notification}>
            <Bell size={24} color="black" />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container1}>
        <View style={styles.tabs}>
          {['Today', 'Weekly', 'Monthly'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.date} onPress={showDatePicker}>
            <CalendarDays size={16} color="#BF8965" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleDateString('en-US', { day: '2-digit' })}
            </Text>

            <View style={styles.dateText1}>
              <Text style={styles.monthText}>
                {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
              </Text>
              <Text style={styles.yearText}>
                {selectedDate.toLocaleDateString('en-US', { year: 'numeric' })}
              </Text>
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.container2}>
          <View style={styles.row}>
            <SummaryCard
              title="Orders"
              value={orders}
              status="up"
              arrowColor="#007bff"
            />
            <SummaryCard
              title="Production"
              value={production}
              status="up"
              arrowColor="#D2691E"
            />
          </View>
          <View style={styles.row}>
            <SummaryCard
              title="Delivered"
              value={delivered}
              status="up"
              arrowColor="#3CB371"
            />
            <SummaryCard
              title="Issue"
              value={issue}
              status="down"
              arrowColor="#FF4500"
            />
          </View>
        </View>

        <LineChart
          data={data}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          bezier={false}
          withDots={true}
          withShadow={false}
          withInnerLines={true}
          withOuterLines={true}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  sidebar: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    width: 200,
    height: '100%',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  sidebarContainer: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    color: '#000',
  },
  profileRole: {
    fontSize: 14,
    color: '#888',
    fontFamily:'Lato-Regular',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,

  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
    fontFamily:'Lato-Regular'
  },
  content: {
    flex: 1,
    marginLeft: 0,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4',

  },
  headerContainer: {
    height: height * 0.11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: width * 0.05,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    marginRight: 10,
    fontSize: 24,
    color: '#1E1F24',
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    fontWeight: '600',
    color: '#1E1F24',
  },
  notification: {
    marginLeft: 10,
    fontSize: 24,
  },

  // second container

  container1: {
    backgroundColor: 'white',
    paddingVertical: height * 0.01, 
    justifyContent: 'space-evenly'
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    alignItems: 'center',
    width: width * 0.9, 
    height: height * 0.08,
    paddingHorizontal: width * 0.07,
    
    borderRadius: 10, 
  },

  tabButton: {
    paddingVertical: height * 0.010, 
    paddingHorizontal: width * 0.03, 
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  },

  tabText: {
    fontSize: width * 0.045, 
    color: '#011006',
       fontFamily:'Lato-Regular'
  },

  activeTabText: {
    fontFamily: 'Lato-Bold',
  },

  date: {
    // backgroundColor: '#FDEEE4',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.02, 
  },

  dateText: {
    fontSize: width * 0.05, 
    fontFamily: 'Lato-Bold',
    color: '#011006',
    marginLeft: 8,
    marginRight: 3,
    fontWeight: 'bold',
  },

  dateText1: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  monthText: {
    fontSize: width * 0.035,
    color: '#011006',
  },

  yearText: {
    fontSize: width * 0.03,
    color: '#011006',
  },
 container2: {
    flex: 1,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: height * 0.01,
    gap: width * 0.03,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: width * 0.03,

  },
  cardTitle: {

    fontSize: 14,
    fontWeight: "400",
    color: "#202020",
    fontFamily: 'Lato-Bold',
    lineHeight: 21,
    marginBottom: 10,
  },
  cardValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 24,
   fontFamily:'Lato-Regular'
  },
  icon: {
    marginLeft: 59,
  },
  cardFooter: {
    fontSize: 14,
    color: "#666",
  },

  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 20,
  },

});




export default Home;







// const [adminname, setAdminname] = useState('');



// useEffect(()=>{
//   try {
//     const featchdetailes=async ()=>{
//       const result=await getUserProfile()
//       console.log("result",result.Admins.name);
//       setAdminname(result.Admins.name)
//     }
//     featchdetailes()
//   } catch (error) {
//     console.log(error);
    
//   }
// },[])