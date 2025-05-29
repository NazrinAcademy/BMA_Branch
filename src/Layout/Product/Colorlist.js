import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions, Modal, Image, Animated, BlurView, Pressable
} from 'react-native';
import {
  Plus, Search, ArrowLeft, CircleChevronDown, CircleChevronRight
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getColorshade } from '../../Utils/apiService';

const { width, height } = Dimensions.get('window');

const Colorlist = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageOverlayVisible, setImageOverlayVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [featchdataes, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getColorshade();
        console.log("Fetched Data:", fetchedData);

        if (fetchedData?.data) {
          setData(fetchedData.data);
        } else {
          setData([]);
          console.warn("No data found in API response");
        }
      } catch (error) {
        console.error("Error fetching color shades:", error);
      }
    };
    fetchData();
    return () => {
      isMounted.current = false; 
    };
  }, []);

  const handleCardClick = (product) => {
    console.log("colorshadeimage", product.colorshades);

    if (!product.colorshades || product.colorshades.length === 0) {
      console.warn("No colorshades found for this product.");
      return;
    }

    // ✅ Only include valid images
    const images = product.colorshades
      .filter(shade => shade.colorshadeimage.length > 0 && shade.colorshadeimage[0]?.url)
      .map(shade => ({
        id: shade._id,
        name: shade.colorshadename,
        imageUrl: shade.colorshadeimage[0]?.url,
      }));

    if (images.length === 0) {
      console.warn("No valid images available.");
      return; // Don't open modal if there are no images
    }

    setSelectedImages(images);
    setImageOverlayVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const getFilteredData = () => {
    if (!searchText.trim()) return featchdataes;
    return featchdataes.filter((item) =>
      item.producttype.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  
  const handleArrowLeftClick = () => {
    setImageOverlayVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#202020" />
        </TouchableOpacity>
        {isSearchActive ? (
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
          <Text style={styles.headerTitle}>Colorshade</Text>
        )}
        {!isSearchActive && (
          <TouchableOpacity onPress={() => setIsSearchActive(true)}>
            <Search size={24} color="#202020" />
          </TouchableOpacity>
        )}
      </View>

      {/* Color List */}
      <FlatList
        data={getFilteredData()}
        contentContainerStyle={styles.memberList}
        
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.memberCard} onPress={() => handleCardClick(item)}>
            <View style={styles.cardCont}>
              <Text style={styles.cardTitle}>{item.producttype}</Text>
              <Text style={styles.cardSubtitle}>
                Color Shades: {item.colorshades.length}
              </Text>
             
            </View>
            <CircleChevronRight  size={24} color="#333" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()} 
      />

      {/* Modal for Image Preview */}
      {imageOverlayVisible && selectedImages.length > 0 && (
        <Modal transparent={true} visible={imageOverlayVisible} animationType="fade">
          <Pressable style={styles.modalBackground} onPress={() => setImageOverlayVisible(false)}>
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
              <Text style={styles.overlayHeader}>Available Colors</Text>
              <View style={styles.imagerow1}>
              {selectedImages.map((image) => (
                <View key={image.id} style={styles.imageContainer}>
                  <Image source={{ uri: image.imageUrl }} style={styles.image} />
                  {/* ✅ Ensure Text is inside a Text component */}
                  <Text style={styles.overlayText}>{image.name}</Text>
                </View>
              ))}
              </View>
            </Animated.View>
          </Pressable>
        </Modal>
      )}

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Addcolorshades')}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.001,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  tabText: {
    fontSize: width * 0.045,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  activeTab: {
    color: '#1B2F2E',
    borderBottomWidth: 3,
    borderBottomColor: '#1B2F2E',
    paddingBottom: height * 0.01,
    borderRadius: 2,
    fontFamily: 'Lato-Bold',

  },
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f5f5f5', marginBottom: 10, borderRadius: 5 },
  itemText: { fontSize: 16 },
  memberList: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: width * 0.04,
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
  memberInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: width * 0.045,
    color: '#202020',
    fontFamily: 'Lato-Regular',
  },
  cardSubtitle: {
    fontSize: width * 0.04,
    color: '#838383',
    marginTop: height * 0.007,
    fontFamily: 'Lato-Regular',
  },
  addButton: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#1B2F2E',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.65,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: height * 0.030,
    paddingVertical: height * 0.020,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  overlayText: {
    fontSize: 16,
    color: '#202020',
    fontFamily: 'Lato-Regular',
    paddingVertical: height * 0.014,

  },
  overlayHeaderText: {
    borderColor: '#CDCED7',
    borderWidth: 3,
    width: width * 0.2,
    height: height * 0.003,
    borderRadius: width * 0.01,
    alignSelf: 'center',
    marginBottom: 10
  },
  overlayHeader: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    paddingVertical: height * 0.008,
    color: '#202020',

  },
  imagerow1:{

    padding: width * 0.04,
    marginTop: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageRow: {
    flexDirection: "column",
    flexWrap: "wrap",      // Allow wrapping if needed
    justifyContent:"flex-start", // Center images in the row
    marginTop: 10,

  },
  imageContainer: {
    alignItems: "center",
    marginHorizontal: 10, // Space between images
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35, // Makes the image circular
    borderWidth: 2,   // Optional: Add border
    borderColor: "#ccc", // Optional: Border color
  },

});

export default Colorlist;
