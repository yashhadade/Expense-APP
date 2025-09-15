import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Expense Tracker</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Welcome to your dashboard</Text>
        
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>₹0</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Expenses</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statNumber, { color: theme.colors.info }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Transactions</Text>
          </View>
        </View>
        
        <View style={[styles.recentContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Transactions</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>No transactions yet</Text>
        </View>
      </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  recentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});

export default Home;