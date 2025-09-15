import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../contexts/ThemeContext';
import Snackbar from 'react-native-snackbar';
import expenseServices from '../service/expenseServise';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

interface FormValues {
  fieldName: string;
  RecivedAmount: string;
  fieldType: "Personal" | "Team";
  expiry: string;
}

const validationSchema = Yup.object().shape({
  fieldName: Yup.string()
    .required("Expense Pool Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  RecivedAmount: Yup.string()
    .required("Received Amount is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount")
    .test('positive', 'Amount must be greater than 0', value => {
      return value ? parseFloat(value) > 0 : false;
    }),
  fieldType: Yup.string()
    .oneOf(["Personal", "Team"], "Please select a valid field type")
    .required("Field Type is required"),
  expiry: Yup.string()
    .required("Expiry date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date in YYYY-MM-DD format")
    .test('future-date', 'Expiry date must be in the future', value => {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today;
    }),
});

const Create = () => {
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fieldTypeOptions = [
    { label: 'Personal', value: 'Personal' as const, icon: '👤' },
    { label: 'Team', value: 'Team' as const, icon: '👥' }
  ];

  const durationOptions = [
    { label: '30 Days', value: '30', days: 30 },
    { label: '60 Days', value: '60', days: 60 },
    { label: '90 Days', value: '90', days: 90 },
    { label: 'Custom Date', value: 'custom', days: null }
  ];

  const initialValues: FormValues = {
    fieldName: "",
    RecivedAmount: "",
    fieldType: "Personal",
    expiry: "",
  };

  const calculateExpiryDate = (days: number) => {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate.getTime() + (days * 24 * 60 * 60 * 1000));
    return expiryDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const handleDurationSelect = (option: typeof durationOptions[0], setFieldValue: (field: string, value: any) => void) => {
    setSelectedDuration(option.value);
    
    if (option.value === 'custom') {
      setFieldValue('expiry', customDate);
    } else if (option.days) {
      const calculatedDate = calculateExpiryDate(option.days);
      setFieldValue('expiry', calculatedDate);
    }
  };

  const handleCustomDateChange = (date: string, setFieldValue: (field: string, value: any) => void) => {
    setCustomDate(date);
    if (selectedDuration === 'custom') {
      setFieldValue('expiry', date);
    }
  };

  const getSelectedExpiryText = () => {
    if (!selectedDuration) return 'Not selected';
    
    const selectedOption = durationOptions.find(option => option.value === selectedDuration);
    if (selectedDuration === 'custom') {
      return customDate ? customDate : 'Not selected';
    } else if (selectedOption?.days) {
      return calculateExpiryDate(selectedOption.days);
    }
    return 'Not selected';
  };

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    setIsLoading(true);
    try {
      console.log(values);
      const res = await expenseServices.createField(values);
      console.log(res);
      
      if (res && res.success) {
        setIsLoading(false);
        Snackbar.show({
          text: "Expense creation Successful",
          backgroundColor: "#4CAF50",
          textColor: "#fff",
          duration: Snackbar.LENGTH_SHORT,
        });
        resetForm();
        setSelectedDuration(null);
        setCustomDate('');
      } else {
        setIsLoading(false);
        Snackbar.show({
          text: res.error || "Expense creation failed",
          backgroundColor: "#E53935",
          textColor: "#fff",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (error: any) {
      setIsLoading(false);
        Snackbar.show({
        text: error?.message || "Something went wrong",
        backgroundColor: "#E53935",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Add Expense Pool</Text>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (
            <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Expense Pool Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  borderColor: errors.fieldName && touched.fieldName ? '#E53935' : theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Expense Pool Name"
                placeholderTextColor={theme.colors.textTertiary}
                value={values.fieldName}
                onChangeText={handleChange('fieldName')}
                onBlur={handleBlur('fieldName')}
              />
              {errors.fieldName && touched.fieldName && (
                <Text style={styles.errorText}>{errors.fieldName}</Text>
              )}
              
              <Text style={[styles.label, { color: theme.colors.text }]}>Recived Amount (₹)</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  borderColor: errors.RecivedAmount && touched.RecivedAmount ? '#E53935' : theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Recived Amount (₹)"
                placeholderTextColor={theme.colors.textTertiary}
                value={values.RecivedAmount}
                onChangeText={handleChange('RecivedAmount')}
                onBlur={handleBlur('RecivedAmount')}
                keyboardType="numeric"
              />
              {errors.RecivedAmount && touched.RecivedAmount && (
                <Text style={styles.errorText}>{errors.RecivedAmount}</Text>
              )}
              
              {/* Field Type Dropdown */}
              <Text style={[styles.label, { color: theme.colors.text }]}>Field Type</Text>
              <TouchableOpacity
                style={[styles.dropdown, { 
                  backgroundColor: theme.colors.background,
                  borderColor: errors.fieldType && touched.fieldType ? '#E53935' : theme.colors.border,
                }]}
                onPress={() => setIsDropdownOpen(true)}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownContent}>
                  <View style={styles.dropdownLeft}>
                    <Text style={styles.dropdownIcon}>
                      {fieldTypeOptions.find(option => option.value === values.fieldType)?.icon}
                    </Text>
                    <Text style={[styles.dropdownText, { color: theme.colors.text }]}>
                      {values.fieldType}
                    </Text>
                  </View>
                  <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>
                    {isDropdownOpen ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>
              {errors.fieldType && touched.fieldType && (
                <Text style={styles.errorText}>{errors.fieldType}</Text>
              )}

              {/* Dropdown Modal */}
              <Modal
                visible={isDropdownOpen}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDropdownOpen(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setIsDropdownOpen(false)}
                >
                  <View style={[styles.dropdownModal, { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border 
                  }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                      <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                        Select Type
                      </Text>
                    </View>
                    <FlatList
                      data={fieldTypeOptions}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.dropdownItem, 
                            { 
                              borderBottomColor: theme.colors.border,
                              backgroundColor: values.fieldType === item.value 
                                ? theme.colors.primary + '20' 
                                : 'transparent'
                            }
                          ]}
                          onPress={() => {
                            setFieldValue('fieldType', item.value);
                            setIsDropdownOpen(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.dropdownItemContent}>
                            <Text style={styles.dropdownItemIcon}>{item.icon}</Text>
                            <Text style={[
                              styles.dropdownItemText, 
                              { 
                                color: values.fieldType === item.value 
                                  ? theme.colors.primary 
                                  : theme.colors.text 
                              }
                            ]}>
                              {item.label}
                            </Text>
                            {values.fieldType === item.value && (
                              <Text style={[styles.checkmark, { color: theme.colors.primary }]}>
                                ✓
                              </Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
              
              {/* Expense Pool Duration */}
              <Text style={[styles.label, { color: theme.colors.text }]}>Expense Pool Duration</Text>
              
              <View style={styles.durationContainer}>
                {durationOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.durationOption,
                      index % 2 === 0 ? styles.leftOption : styles.rightOption,
                      { 
                        borderColor: selectedDuration === option.value ? theme.colors.primary : theme.colors.border 
                      }
                    ]}
                    onPress={() => handleDurationSelect(option, setFieldValue)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.radioContainer}>
                      <View style={[
                        styles.radioOuter,
                        { borderColor: selectedDuration === option.value ? theme.colors.primary : theme.colors.border }
                      ]}>
                        {selectedDuration === option.value && (
                          <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />
                        )}
                      </View>
                      <Text style={[
                        styles.durationText,
                        { 
                          color: selectedDuration === option.value ? theme.colors.primary : theme.colors.text,
                          fontWeight: selectedDuration === option.value ? '600' : '400'
                        }
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Date Input */}
              {selectedDuration === 'custom' && (
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    marginTop: 10
                  }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={customDate}
                  onChangeText={(date) => handleCustomDateChange(date, setFieldValue)}
                />
              )}

              {errors.expiry && touched.expiry && (
                <Text style={styles.errorText}>{errors.expiry}</Text>
              )}

              {/* Selected Expiry Date Display */}
              <View style={[styles.expiryDisplay, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.expiryLabel, { color: theme.colors.textSecondary }]}>
                  Selected Expiry Date: 
                </Text>
                <Text style={[styles.expiryDate, { color: theme.colors.text }]}>
                  {getSelectedExpiryText()}
                </Text>
              </View>
              
               <Button 
                 title="Add Expense"
                 onPress={handleSubmit}
                 loading={isLoading}
                 disabled={isLoading}
                 variant="success"
                 style={styles.button}
                 textStyle={styles.buttonText}
               />
              {/* <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.success }]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Add Expense</Text>
              </TouchableOpacity> */}
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    minHeight: 50,
    justifyContent: 'center',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    minHeight: 60,
    justifyContent: 'center',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    flex: 1,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  durationOption: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  leftOption: {
    marginRight: '2%',
  },
  rightOption: {
    marginLeft: '2%',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 14,
    flex: 1,
  },
  expiryDisplay: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  expiryDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Create;