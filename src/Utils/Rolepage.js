import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

const Rolepage = () => {
    const [value, setValue] = useState(null);
    const navigation = useNavigation();

    const roles = [
        { label: 'Sales', value: 'sales' },
        { label: 'QC', value: 'qc' },
        { label: 'AC', value: 'ac' },
        { label: 'Production', value: 'production' },
        { label: 'Admin', value: 'admin' },

    ];

    const handleNext = () => {
        if (value) {
            navigation.navigate('Login', { selectedRole: value });
        } else {
            alert('Please select a role first');
        }
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                data={roles}
                labelField="label"
                valueField="value"
                placeholder="Select a role"
                value={value}
                onChange={item => setValue(item.value)}
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dropdown: {
        width: '100%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Rolepage;
