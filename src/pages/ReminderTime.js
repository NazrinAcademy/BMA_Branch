import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ChevronDown, ArrowLeft, Clock } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const ReminderTime = ({ navigation }) => {
  const [reminderTime, setReminderTime] = useState('');
  const [unit, setUnit] = useState('Hr');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleUnitSelection = (selectedUnit) => {
    setUnit(selectedUnit);
    setShowDropdown(false);
  };

  const handleSave = () => {
    setIsSaved(true); // Hide input and show card
  };

  const handleEdit = () => {
    setIsSaved(false); // Show input and hide card
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.headerIcon}>
          <ArrowLeft size={width * 0.06} color="#1E1F24" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Time</Text>
      </View>

      {/* Reminder Snooze Time Section */}
      {!isSaved ? (
        <>
          <Text style={styles.reminderText}>Reminder Snooze Time</Text>
          <View style={styles.content}>
            {/* Fieldset Legend (Conditional Rendering) */}
            {isFocused && (
              <Text style={styles.fieldsetLegend}>Reminder Time</Text>
            )}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: isFocused ? '#CECECE' : '#CECECE' },
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={reminderTime}
                  keyboardType="numeric"
                  onChangeText={setReminderTime}
                  placeholder={isFocused ? '' : 'Reminder Time'}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <View style={styles.verticalLine} />
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text style={styles.unitText}>{unit}</Text>
                  <ChevronDown size={width * 0.06} color="black" />
                </TouchableOpacity>
              </View>

              {/* Dropdown Options */}
              {showDropdown && (
                <View style={styles.dropdownOptions}>
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => handleUnitSelection('Hr')}
                  >
                    <Text style={styles.dropdownOptionText}>Hr</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownOption}
                    onPress={() => handleUnitSelection('Min')}
                  >
                    <Text style={styles.dropdownOptionText}>Min</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Display Card with Selected Time and Unit
        <View style={styles.cardContainer}>
          <Text style={styles.reminderText}>Reminder Snooze Time</Text>
          {/* Wrap only the card in TouchableOpacity */}
          <TouchableOpacity onPress={handleEdit} style={styles.card}>
            <Text style={styles.cardTitle}>Reminder Time</Text>
            <View style={styles.cardContentContainer}>
              <Clock size={width * 0.06} color="#838383" style={styles.clockIcon} />
              <Text style={styles.cardContent}>
                {reminderTime} {unit}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    height: height * 0.1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerIcon: {
    position: 'absolute',
    left: width * 0.05, 
  },
  headerText: {
    fontSize: width * 0.05, 
    color: '#1E1F24',
    fontFamily: 'Lato-Bold',
  },
  content: {
    flex: 1, 
    marginTop: height * 0.04, 
    paddingHorizontal: width * 0.05, 
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: height * 0.02, 
  },
  inputContainer: {
    position: 'relative',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: width * 0.01, 
    backgroundColor: '#F4F4F4',
    paddingHorizontal: width * 0.03, 
  },
  input: {
    flex: 1,
    padding: height * 0.015, 
    fontSize: width * 0.04, 
  },
  verticalLine: {
    width: 1,
    height: '100%', 
    backgroundColor: '#CECECE',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03, 
    paddingVertical: height * 0.01, 
  },
  unitText: {
    fontSize: width * 0.04, 
    marginRight: width * 0.02, 
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%', 
    right: 0, 
    width: width * 0.3, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02, 
    marginTop: height * 0.01, 
    zIndex: 1, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: height * 0.015,
    alignItems: 'center', 
  },
  dropdownOptionText: {
    fontSize: width * 0.04, 
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: height * 0.02, 
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B2F2E',
    padding: height * 0.02, 
    borderRadius: width * 0.01, 
    marginHorizontal: width * 0.05, 
  },
  saveButtonText: {
    color: '#D6B06B',
    fontSize: width * 0.045, 
    fontFamily: 'Lato-Bold',
  },
  fieldsetLegend: {
    position: 'absolute',
    top: -height * 0.012,
    left: width * 0.09,
    backgroundColor: '#F4F4F4', 
    paddingHorizontal: width * 0.013, 
    fontSize: width * 0.035, 
    color: '#838383', 
    zIndex: 1, 
    fontFamily:'Lato-Regular'
  },
  reminderText: {
    fontSize: width * 0.05, 
    color: '#202020',  
    fontFamily: 'Lato-Regular',
    marginLeft:width * 0.065,
    marginTop:height*0.02,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: width * 0.04,
    backgroundColor: '#FFF',
    borderRadius: width * 0.01,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: height * 0.02,
    borderLeftWidth: 3,
    borderLeftColor: '#202020',
  },
  cardTitle: {
    fontSize: width * 0.04,
    color: '#202020',
    fontFamily: 'Lato-Regular',
    marginBottom: height * 0.02,
  },
  cardContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: width * 0.02, // Add spacing between icon and text
  },
  cardContent: {
    fontSize: width * 0.04,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
});

export default ReminderTime;