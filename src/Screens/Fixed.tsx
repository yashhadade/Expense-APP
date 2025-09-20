import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../contexts/ThemeContext';
import ThemeHeader from '../components/ThemeHeader';
import Button from '../components/Button';
import FixedExpense from '../components/FixedExpense';
import expenseServices from '../service/expenseServise';
import Snackbar from 'react-native-snackbar';

const categories = [
  { id: '1', name: 'Food' },
  { id: '2', name: 'Travel' },
  { id: '3', name: 'FixedExpense' },
  { id: '4', name: 'OtherExpense' },
];

const validationSchema = Yup.object().shape({
  desc: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  date: Yup.date().required('Date is required'),
  price: Yup.number()
    .required('Bill amount is required')
    .positive('Bill amount must be positive')
    .typeError('Bill amount must be a number'),
});

const Fixed = () => {
  const { theme } = useTheme();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateInputText, setDateInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fixedExpense, setFixedExpense] = useState<any>([]);
  // Helper function to format date for display
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format date for API (ISO format with timezone)
  const formatDateForAPI = (date: Date) => {
    return date.toISOString();
  };

  // Handle date selection
  const handleDateSelect = (date: Date, setFieldValue: (field: string, value: any) => void) => {
    setSelectedDate(date);
    setDateInputText(date.toISOString().split('T')[0]);
    setFieldValue('date', formatDateForAPI(date));
    setShowDateModal(false);
  };

  // Handle date input change
  const handleDateInputChange = (text: string) => {
    setDateInputText(text);
    if (text.length === 10 && text.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const newDate = new Date(text + 'T00:00:00.000Z');
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      }
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any ) => {
    setIsLoading(true);
    // Convert data to proper formats
    const formattedData = {
      ...values,
      date: values.date, // Already in ISO format from date picker
      price: parseFloat(values.price) || 0, // Convert to number
    };
    try {
      const res = await expenseServices.createFixedExpense(formattedData);
      console.log(res)
    if (res && res.success) {
      Snackbar.show({
        text: res.message || "Expense creation Successful",
        backgroundColor: "#4CAF50",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
      getFixedExpense();
      resetForm();
    } else {
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
        text: error || "Something went wrong",
        backgroundColor: "#E53935",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
    } finally {
      setIsLoading(false);
    }
    // Handle form submission logic here
  };
  useEffect(() => {
    getFixedExpense();
  }, []);
  const getFixedExpense = async () => {
    const res = await expenseServices.getExpensePoll("Primary");
    setFixedExpense(res.expenseField);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ThemeHeader title={!(fixedExpense && fixedExpense.length > 0) ? "Add Expense" : "Fixed Expense"} />
      {!(fixedExpense && fixedExpense.length > 0) ? (
        <FlatList
          data={[{}]} // Single item to render the form
          renderItem={() => (
            <View style={styles.scrollContainer}>
              <Formik
          initialValues={{
            desc: '',
            category: '',
            date: '',
            price: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
            <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.colors.background,
                      borderColor: errors.desc && touched.desc ? theme.colors.error : theme.colors.border,
                      color: theme.colors.text 
                    }
                  ]}
                  placeholder="Description"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={values.desc}
                  onChangeText={handleChange('desc')}
                  onBlur={handleBlur('desc')}
                />
                {touched.desc && errors.desc && (
                  <Text style={styles.errorText}>{errors.desc}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Category *</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    { 
                      backgroundColor: theme.colors.background,
                      borderColor: errors.category && touched.category ? theme.colors.error : theme.colors.border,
                    }
                  ]}
                  onPress={() => setShowCategoryModal(true)}
                >
                  <Text style={[
                    styles.dropdownText, 
                    { color: values.category ? theme.colors.text : theme.colors.textTertiary }
                  ]}>
                    {values.category || 'Category'}
                  </Text>
                  <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>▼</Text>
                </TouchableOpacity>
                {touched.category && errors.category && (
                  <Text style={styles.errorText}>{String(errors.category)}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Date *</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    { 
                      backgroundColor: theme.colors.background,
                      borderColor: errors.date && touched.date ? theme.colors.error : theme.colors.border,
                    }
                  ]}
                  onPress={() => {
                    setDateInputText(selectedDate.toISOString().split('T')[0]);
                    setShowDateModal(true);
                  }}
                >
                  <Text style={[
                    styles.dropdownText, 
                    { color: values.date ? theme.colors.text : theme.colors.textTertiary }
                  ]}>
                    {values.date ? formatDateForDisplay(new Date(values.date)) : 'Date'}
                  </Text>
                  <Text style={styles.dropdownIcon}>📅</Text>
                </TouchableOpacity>
                {touched.date && errors.date && (
                  <Text style={styles.errorText}>{String(errors.date)}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Bill Amount *</Text>
                <View style={[
                  styles.amountContainer,
                  { 
                    backgroundColor: theme.colors.background,
                    borderColor: errors.price && touched.price ? theme.colors.error : theme.colors.border,
                  }
                ]}>
                  <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>₹</Text>
                  <TextInput
                    style={[
                      styles.amountInput,
                      { color: theme.colors.text }
                    ]}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textTertiary}
                    value={values.price}
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    keyboardType="numeric"
                  />
                </View>
                {touched.price && errors.price && (
                  <Text style={styles.errorText}>{String(errors.price)}</Text>
                )}
              </View>

              <Button 
                title="ADD EXPENSE"
                onPress={handleSubmit}
                variant="success"
                style={styles.submitButton}
                textStyle={styles.submitButtonText}
                loading={isLoading}
                disabled={isLoading}
              />

              {/* Category Selection Modal */}
              <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.modalHeader}>
                      <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Category</Text>
                      <TouchableOpacity
                        onPress={() => setShowCategoryModal(false)}
                        style={styles.closeButton}
                      >
                        <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={categories}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.categoryItem,
                            { borderBottomColor: theme.colors.border }
                          ]}
                          onPress={() => {
                            setFieldValue('category', item.name);
                            setShowCategoryModal(false);
                          }}
                        >
                          <Text style={[styles.categoryItemText, { color: theme.colors.text }]}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </Modal>

              {/* Date Selection Modal */}
              <Modal
                visible={showDateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDateModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={[styles.dateModalContent, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.modalHeader}>
                      <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Date</Text>
                      <TouchableOpacity
                        onPress={() => setShowDateModal(false)}
                        style={styles.closeButton}
                      >
                        <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.datePickerContainer}>
                      <Text style={[styles.datePickerLabel, { color: theme.colors.textSecondary }]}>
                        Current Date: {formatDateForDisplay(selectedDate)}
                      </Text>
                      
                      <View style={styles.dateButtonsContainer}>
                        <TouchableOpacity
                          style={[styles.dateButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => handleDateSelect(new Date(), setFieldValue)}
                        >
                          <Text style={styles.dateButtonText}>Today</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.dateButton, { backgroundColor: theme.colors.primary }]}
                          onPress={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            handleDateSelect(tomorrow, setFieldValue);
                          }}
                        >
                          <Text style={styles.dateButtonText}>Tomorrow</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.dateInputContainer}>
                        <Text style={[styles.dateInputLabel, { color: theme.colors.text }]}>
                          Or select specific date:
                        </Text>
                        <View style={styles.dateInputRow}>
                          <TextInput
                            style={[
                              styles.dateInput,
                              { 
                                backgroundColor: theme.colors.background,
                                borderColor: theme.colors.border,
                                color: theme.colors.text 
                              }
                            ]}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={dateInputText}
                            onChangeText={handleDateInputChange}
                          />
                          <TouchableOpacity
                            style={[styles.confirmDateButton, { backgroundColor: theme.colors.success }]}
                            onPress={() => handleDateSelect(selectedDate, setFieldValue)}
                          >
                            <Text style={styles.confirmDateButtonText}>Confirm</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}
              </Formik>
            </View>
          )}
          keyExtractor={() => 'form'}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FixedExpense data={fixedExpense} onRefresh={getFixedExpense} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    flex: 1,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 50,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdownIcon: {
    fontSize: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  currencySymbol: {
    fontSize: 16,
    paddingLeft: 15,
    paddingRight: 5,
    fontWeight: '500',
  },
  amountInput: {
    flex: 1,
    padding: 15,
    paddingLeft: 0,
    fontSize: 16,
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  categoryItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateModalContent: {
    width: '90%',
    maxHeight: '60%',
    borderRadius: 12,
    padding: 20,
  },
  datePickerContainer: {
    paddingVertical: 10,
  },
  datePickerLabel: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dateInputContainer: {
    marginTop: 10,
  },
  dateInputLabel: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '500',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  confirmDateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Fixed;