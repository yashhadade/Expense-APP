import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import ThemeHeader from '../components/ThemeHeader';
import FixedExpense from '../components/FixedExpense';

// Define the expense data type based on what we see in Home.tsx
interface ExpenseData {
  fieldName: string;
  RecivedAmount: string;
  balance: string;
  expiry: string;
  // Add other properties as needed
}

interface EditProps {
  route: {
    params: {
      expenseData: ExpenseData;
      getExpenseData: () => void;
    };
  };
  navigation: any;
}

const Edit: React.FC<EditProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { expenseData } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ThemeHeader title="Expense Poll List" />
      
      <FixedExpense data={[expenseData]} onRefresh={route.params.getExpenseData} screen="expensePollList" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default Edit;
