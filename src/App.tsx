import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";
import Home from './Screens/Home';
import Create from './Screens/Create';
import Profile from './Screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Define navigation types
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
};

export type TabParamList = {
  Home: undefined;
  Create: undefined;
  Profile: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs({ onLogout }: { onLogout: () => void }) {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconText = "";
          if (route.name === "Home") iconText = "📋";
          else if (route.name === "Create") iconText = "➕";
          else if (route.name === "Profile") iconText = "👤";
          return <Text style={{ fontSize: size, color }}>{iconText}</Text>;
        },
       tabBarStyle: {
      height: 70,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      position: "absolute",
    },
    tabBarIconStyle: {
      marginTop: 5,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginBottom: 5,
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textTertiary,
    tabBarItemStyle: {
      borderRadius: 15,
      margin: 5,
    },
    tabBarActiveBackgroundColor: theme.colors.primary + '20',
  
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Tab.Screen name="Create" component={Create} options={{ title: "Create" }} />
      <Tab.Screen 
        name="Profile" 
        options={{ title: "Profile" }}
      >
        {(props) => <Profile {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function App() {
 const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  },[]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLoginSuccess = async () => {
    await checkLogin();
  };

  if (loading) {
    return null; // show splash or loader if you want
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <RootStack.Screen name="MainTabs">
                {(props) => <MainTabs {...props} onLogout={handleLogout} />}
              </RootStack.Screen>
            ) : (
              <>
                <RootStack.Screen name="Login">
                  {(props) => <Login {...props} onLoginSuccess={handleLoginSuccess} />}
                </RootStack.Screen>
                <RootStack.Screen name="SignUp" component={SignUp} />
              </>
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161616ff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default App;
