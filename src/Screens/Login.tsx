import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import Snackbar from 'react-native-snackbar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import userServices from '../service/userService';
import { userLogin } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
  onLoginSuccess: () => void;
}

const totInputsSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email format"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

const Login = ({ navigation, onLoginSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: totInputsSchema,
    onSubmit: (values) => {
      handleSaveForm(values);
    },
  });

  const { errors, touched, handleSubmit, handleChange, values, resetForm } = formik;

  useEffect(() => {
    resetForm({
      values: {
        email: "",
        password: "",
      },
    });
  }, []);

  const handleSaveForm = async (data: userLogin) => {
    setIsLoading(true);
    try {
      console.log(data)
      const res = await userServices.login(data);
      console.log(res)
      if (res && res.success) {
        setIsLoading(false);
        Snackbar.show({
          text: "Login Successful",
          backgroundColor: "#4CAF50",
          textColor: "#fff",
          duration: Snackbar.LENGTH_SHORT,
        });
         if (res.token) {
        await AsyncStorage.setItem("token", res.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.user));
        // Call the onLoginSuccess function to trigger token check
        onLoginSuccess();
      }
        resetForm({
          values: { email: "", password: "" },
        });
      } else {
        setIsLoading(false);
        Snackbar.show({
          text: res.error || "Login failed",
          backgroundColor: "#E53935",
          textColor: "#fff",
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      Snackbar.show({
        text: error.message || "Something went wrong",
        backgroundColor: "#E53935",
        textColor: "#fff",
        duration: Snackbar.LENGTH_SHORT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={values.email}
          onChangeText={handleChange("email")}
        />
        {errors.email && touched.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={values.password}
          onChangeText={handleChange("password")}
        />
        {errors.password && touched.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        {/* Submit Button */
        }
        
        <Button 
                 title="Login"
                 onPress={handleSubmit}
                 style={styles.button}
                 textStyle={styles.buttonText}
                 loading={isLoading}
                 disabled={isLoading}
                 variant="success"
               />
        {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity> */}

        {/* Sign Up Link */}
        <TouchableOpacity 
          style={styles.signupLink} 
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  innerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#E53935",
    fontSize: 14,
    marginBottom: 8,
  },
  signupLink: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupTextBold: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
