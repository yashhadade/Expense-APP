import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import expenseServices from '../service/expenseServise';
import Snackbar from 'react-native-snackbar';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface FixedExpenseProps {
  data: any[];
  onRefresh: () => void;
  screen?: string;
}

// Validation schema
const expenseValidationSchema = Yup.object().shape({
  desc: Yup.string()
    .min(3, 'Description must be at least 3 characters')
    .required('Description is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  category: Yup.string()
    .required('Category is required'),
  date: Yup.string()
    .required('Date is required'),
});

const FixedExpense: React.FC<FixedExpenseProps> = ({ data, onRefresh, screen }) => {
  const { theme } = useTheme();
  const [fixedExpense, setFixedExpense] = useState<any>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateInputText, setDateInputText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const categories = [
    { id: '1', name: 'Food' },
    { id: '2', name: 'Travel' },
    { id: '3', name: 'FixedExpense' },
    { id: '4', name: 'OtherExpense' },
  ];

useEffect(() => {
  getFixedExpense();
}, []);

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
const handleDateSelect = (date: Date, setFieldValue: any) => {
  setSelectedDate(date);
  setDateInputText(date.toISOString().split('T')[0]);
  setFieldValue('date', formatDateForAPI(date));
  setShowDateModal(false);
};

// Handle date input change
const handleDateInputChange = (text: string, setFieldValue: any) => {
  setDateInputText(text);
  if (text.length === 10 && text.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const newDate = new Date(text + 'T00:00:00.000Z');
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
      setFieldValue('date', formatDateForAPI(newDate));
    }
  }
};

const getFixedExpense = async () => {
    try {
        const res = await expenseServices.getFixedExpense(data[0]._id || "");
        if (res && res.success) {
            setFixedExpense(res.field);
        } else {
            console.log(res.error);
        }
            } catch (error) {
        console.log(error);
    }
 
};

const handleAddExpense = async (values: any, { resetForm }: any) => {
  try {
    const expenseData = {
      desc: values.desc,
      price: parseFloat(values.price),
      category: values.category,
      date: values.date,
      fieldId: data[0]._id,
    };

    const res = await expenseServices.createFieldsExpense(data[0]._id ,expenseData);
    if (res && res.sucess) {
      Snackbar.show({
        text: res.message || "Expense added successfully",
        backgroundColor: "#4CAF50",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
      setModalVisible(false);
      resetForm();
      getFixedExpense(); // Refresh the list
      onRefresh();
        if (onRefresh) onRefresh(); // Refresh the list
    } else {
      Snackbar.show({
        text: res.error?.message || "Failed to add expense",
        backgroundColor: "#E53935",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  } catch (error: any) {
    console.log(error);
    Snackbar.show({
      text: error?.message || "Failed to add expense",
      backgroundColor: "#E53935",
      textColor: "#fff",
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};

const handleEditExpense = async (values: any, { resetForm }: any) => {
  try {
    const expenseData = {
      desc: values.desc,
      price: parseFloat(values.price),
      category: values.category,
      date: values.date,
      fieldId: data[0]._id,
    };

    const res = await expenseServices.updateFieldsExpense( editingExpense._id, expenseData);
    if (res && res.success) {
      Snackbar.show({
        text: res.message || "Expense updated successfully",
        backgroundColor: "#4CAF50",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
      setModalVisible(false);
      setIsEditing(false);
      setEditingExpense(null);
      resetForm();
      getFixedExpense(); // Refresh the list
      onRefresh();
    } else {
      Snackbar.show({
        text: res.error?.message || "Failed to update expense",
        backgroundColor: "#E53935",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  } catch (error: any) {
    console.log(error);
    Snackbar.show({
      text: error?.message || "Failed to update expense",
      backgroundColor: "#E53935",
      textColor: "#fff",
      duration: Snackbar.LENGTH_SHORT,
    });
  }
};

const handleDeleteExpense = (expense: any) => {
  Alert.alert(
    "Delete Expense",
    "Are you sure you want to delete this expense?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await expenseServices.deleteFieldsExpense(expense._id);
            if (res && res.success) {
              Snackbar.show({
                text: res.message || "Expense deleted successfully",
                backgroundColor: "#4CAF50",
                textColor: "#fff",
                duration: Snackbar.LENGTH_SHORT,
              });
              getFixedExpense(); // Refresh the list
              onRefresh();
            } else {
              Snackbar.show({
                text: res.error?.message || "Failed to delete expense",
                backgroundColor: "#E53935",
                textColor: "#fff",
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          } catch (error: any) {
            console.log(error);
            Snackbar.show({
              text: error?.message || "Failed to delete expense",
              backgroundColor: "#E53935",
              textColor: "#fff",
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        }
      }
    ]
  );
};

const handleEditPress = (expense: any) => {
  setIsEditing(true);
  setEditingExpense(expense);
  setModalVisible(true);
};

const handleModalClose = () => {
  setModalVisible(false);
  setIsEditing(false);
  setEditingExpense(null);
};

  const renderExpenseItem = ({ item }: { item: any }) => (
    <View style={[
      styles.expenseItem,
      {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }
    ]}>
      <View style={styles.expenseHeader}>
        <Text style={[styles.expenseDescription, { color: theme.colors.text }]}>
          {item.desc || 'No Description'}
        </Text>
        <Text style={[styles.expenseAmount, { color: theme.colors.primary }]}>
          ₹{item.price || 0}
        </Text>
      </View>
      <View style={styles.expenseDetails}>
        <Text style={[styles.expenseCategory, { color: theme.colors.textSecondary }]}>
          {item.category || 'No Category'}
        </Text>
        <Text style={[styles.expenseDate, { color: theme.colors.textSecondary }]}>
          {item.date ? new Date(item.date).toLocaleDateString() : 'No Date'}
        </Text>
      </View>
      <View style={styles.expenseActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleEditPress(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: '#E53935' }]}
          onPress={() => handleDeleteExpense(item)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyEmoji, { color: theme.colors.textTertiary }]}>📝</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Fixed Expenses</Text>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Add your first fixed expense to get started.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
      <View style={[styles.balanceCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Total Balance</Text>
        <Text style={[styles.balanceAmount, { color: theme.colors.primary }]}>
          ₹{(screen === "expensePollList" ? data[0]?.balance : data[0]?.RecivedAmount) || 0}
        </Text>
      </View>
      
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Expenses</Text>
      
      <FlatList
        data={fixedExpense?.expenses || []}
        renderItem={renderExpenseItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={false}
      />

      {/* Add Button */}
     

      {/* Modal for Add Expense Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </Text>
            
            <Formik
              initialValues={{
                desc: isEditing ? editingExpense?.desc || '' : '',
                price: isEditing ? editingExpense?.price?.toString() || '' : '',
                category: isEditing ? editingExpense?.category || '' : '',
                date: isEditing ? editingExpense?.date || '' : '',
              }}
              validationSchema={expenseValidationSchema}
              onSubmit={isEditing ? handleEditExpense : handleAddExpense}
            >
              {({ values, errors, touched, handleChange, setFieldValue, handleSubmit, resetForm }) => (
                <>
                  <TextInput
                    style={[
                      styles.input, 
                      { 
                        backgroundColor: theme.colors.background, 
                        borderColor: errors.desc && touched.desc ? '#E53935' : theme.colors.border, 
                        color: theme.colors.text 
                      }
                    ]}
                    placeholder="Description"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.desc}
                    onChangeText={handleChange('desc')}
                  />
                  {errors.desc && touched.desc && (
                    <Text style={[styles.errorText, { color: '#E53935' }]}>{String(errors.desc)}</Text>
                  )}
                  
                  <TextInput
                    style={[
                      styles.input, 
                      { 
                        backgroundColor: theme.colors.background, 
                        borderColor: errors.price && touched.price ? '#E53935' : theme.colors.border, 
                        color: theme.colors.text 
                      }
                    ]}
                    placeholder="Price"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={values.price}
                    onChangeText={handleChange('price')}
                    keyboardType="numeric"
                  />
                  {errors.price && touched.price && (
                    <Text style={[styles.errorText, { color: '#E53935' }]}>{String(errors.price)}</Text>
                  )}
                  
                  <TouchableOpacity
                    style={[
                      styles.dropdown, 
                      { 
                        backgroundColor: theme.colors.background, 
                        borderColor: errors.category && touched.category ? '#E53935' : theme.colors.border 
                      }
                    ]}
                    onPress={() => setShowCategoryModal(true)}
                  >
                    <Text style={[
                      styles.dropdownText, 
                      { color: values.category ? theme.colors.text : theme.colors.textSecondary }
                    ]}>
                      {values.category || 'Category'}
                    </Text>
                    <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>▼</Text>
                  </TouchableOpacity>
                  {errors.category && touched.category && (
                    <Text style={[styles.errorText, { color: '#E53935' }]}>{String(errors.category)}</Text>
                  )}
                  
                  <TouchableOpacity
                    style={[
                      styles.dropdown, 
                      { 
                        backgroundColor: theme.colors.background, 
                        borderColor: errors.date && touched.date ? '#E53935' : theme.colors.border 
                      }
                    ]}
                    onPress={() => {
                      setDateInputText(selectedDate.toISOString().split('T')[0]);
                      setShowDateModal(true);
                    }}
                  >
                    <Text style={[
                      styles.dropdownText, 
                      { color: values.date ? theme.colors.text : theme.colors.textSecondary }
                    ]}>
                      {values.date ? formatDateForDisplay(new Date(values.date)) : 'Date'}
                    </Text>
                    <Text style={styles.dropdownIcon}>📅</Text>
                  </TouchableOpacity>
                  {errors.date && touched.date && (
                    <Text style={[styles.errorText, { color: '#E53935' }]}>{String(errors.date)}</Text>
                  )}
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton, { backgroundColor: theme.colors.textSecondary }]}
                      onPress={handleModalClose}
                    >
                      <Text style={[styles.buttonText, { color: theme.colors.surface }]}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.button, styles.submitButton, { backgroundColor: theme.colors.primary }]}
                      onPress={() => handleSubmit()}
                    >
                      <Text style={[styles.buttonText, { color: theme.colors.surface }]}>
                        {isEditing ? 'Update' : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </View>

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
                                onChangeText={(text) => handleDateInputChange(text, setFieldValue)}
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
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          setIsEditing(false);
          setEditingExpense(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
  },
  contentContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 40,
  },
  expenseItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  expenseDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    // backgroundColor will be set dynamically
  },
  deleteButton: {
    // backgroundColor will be set dynamically
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    position: 'absolute',
    bottom: 60,
    right: 2,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    
  },
  addButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    width: '90%',
    maxWidth: 400,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: -4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  submitButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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

export default FixedExpense;
