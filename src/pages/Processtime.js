import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { Clock, MoreVertical ,ArrowLeft } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ProcessTime = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([
    { id: '1', title: 'Delivery Time', time: '2 hr' },
    { id: '2', title: 'Process 1', time: '24 hr' },
    { id: '3', title: 'Process 2', time: '24 hr' },
    { id: '4', title: 'Process 3', time: '48 hr' },
    { id: '5', title: 'Process 4', time: '48 hr' },
  ]);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigation = useNavigation(); 

  const handleGoBack = () => {
    navigation.goBack(); 
  };
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };
  const saveChanges = () => {

    if (selectedItem?.time && !selectedItem.time.includes("hr")) {
      selectedItem.time = `${selectedItem.time} hr`;
    }
    const updatedData = data.map((item) =>
      item.id === selectedItem.id ? selectedItem : item
    );
    setData(updatedData);
    closeModal();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
  <View style={styles.card}>
  <View style={styles.cardContent}>
    <View style={styles.row}>
      <View style={styles.iconText}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={24} color="#7f7f7f" />
      </TouchableOpacity>
    </View>
    <View style={styles.row1}>
      <Clock size={24} color="#7f7f7f" />
      <Text style={styles.time}>{item.time}</Text>
    </View>
  </View>
</View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
            <ArrowLeft size={24} color="black"  />
          </TouchableOpacity>
        <Text style={styles.headerText}>Process</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Process and Time</Text>
            <TextInput
              style={styles.input}
              value={selectedItem?.title}
              placeholder="Enter Process Title"
              onChangeText={(text) =>
                setSelectedItem({ ...selectedItem, title: text })
              }
            />

            <TextInput
              style={styles.input}
              value={
                selectedItem?.time
                  ? selectedItem.time.replace(" hr", "")
                  : ""
              }
              placeholder="Enter Process Time (e.g., 12 hr)"
              keyboardType="numeric"
              onChangeText={(text) => {

                setSelectedItem({ ...selectedItem, time: text });
              }}
              onBlur={() => {

                if (selectedItem?.time && !selectedItem.time.includes("hr")) {
                  setSelectedItem({
                    ...selectedItem,
                    time: `${selectedItem.time} hr`,
                  });
                }
              }}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                <Text style={styles.saveButtonText}>Save</Text>
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
    backgroundColor: '#F4F4F4',
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
    fontFamily:'Lato-Bold'
  },
  list: {
    padding: width * 0.04,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: width * 0.01,
    padding: width * 0.04,
    marginBottom: height * 0.015,
  },
  cardContent: {
      paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: width * 0.03,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: '500',
    color: '#333',
  },
  time: {
    fontSize: width * 0.04,
    color: '#7f7f7f',
    marginTop: height * 0.004,
    marginLeft: 10,
  },
  moreButton: {
    padding: width * 0.02,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: width * 0.03,
    padding: width * 0.05,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    marginBottom: height * 0.02,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    padding: width * 0.03,
    marginBottom: height * 0.02,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#1B2F2E',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.02,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: width * 0.045,
  },
  closeButton: {
    borderWidth: 1, 
    borderColor: 'var(--Primary-light, #1B2F2E)', 
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: width * 0.01,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: width * 0.045,
  },
});

export default ProcessTime;
