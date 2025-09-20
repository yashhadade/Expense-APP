import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import expenseServices from '../service/expenseServise';
import ThemeHeader from '../components/ThemeHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface HomeProps {
  navigation: HomeScreenNavigationProp;
}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [expensePoll, setExpensePoll] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  async function getExpensePoll() {
    try {
      const res = await expenseServices.getExpensePoll();   
      if (res && res.success) {
        setExpensePoll(res.expenseField);
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  useEffect(() => {
    getExpensePoll();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await getExpensePoll();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.fieldName, { color: theme.colors.text }]}>
          {item.fieldName}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            {
              backgroundColor: theme.colors.primary,
              borderColor: 'transparent',
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={() => navigation.navigate('Edit', { expenseData: item, getExpenseData: getExpensePoll })}
        >
          <Text
            style={[
              styles.editButtonText,
              { color: '#ffffff' },
            ]}
          >
            Edit
          </Text>
        </Pressable>
      </View>

      <View style={styles.details}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Received amount: <Text style={styles.value}>{item.RecivedAmount}</Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Balance amount: <Text style={styles.value}>{item.balance}</Text>
        </Text>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          Expiry: <Text style={styles.value}>{item.expiry}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ThemeHeader title="Expense Tracker" />

      <View style={styles.headerSubtitleContainer}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Welcome to your dashboard</Text>
      </View>

      <FlatList
        data={expensePoll}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyEmoji, { color: theme.colors.textTertiary }]}>🧾</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No expenses yet</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Pull down to refresh or add your first expense.</Text>
            <Pressable
              onPress={onRefresh}
              style={({ pressed }) => [
                styles.retryButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.textSecondary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  headerSubtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 5,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 16,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '600',
  },
  details: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontWeight: '600',
    color: '#7b7b7bff',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 0,
  },
  editButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default Home;
