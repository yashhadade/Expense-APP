import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const ThemeHeader: React.FC<ThemeHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  onBackPress,
  rightComponent 
}) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={theme.colors.background === '#0f0f0f' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.border 
      }]}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        </View>
        
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ThemeHeader;
