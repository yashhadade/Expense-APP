import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Yup from "yup";
import { useFormik } from 'formik';
import Snackbar from 'react-native-snackbar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import userServices from '../service/userService';
import { userSignUp } from '../types/user';
import Button from '../components/Button';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const totInputsSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(4, "Name must be at least 4 characters"),
  email: Yup.string().required("Email is required").email("Invalid email format"),
  phoneNo: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

const SignUp = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
    const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNo: "",
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
        name: "",
        email: "",
        phoneNo: "",
        password: "",
      },
    });
  }, []);

  const handleSaveForm = async (data: userSignUp) => {
    setIsLoading(true);
     console.log(data)
    try {
       
      const res = await userServices.signup(data);
      console.log(res)
      if (res && res.success) {
        setIsLoading(false);
        Snackbar.show({
          text: "Signup Successful",
          backgroundColor: "#4CAF50",
          textColor: "#fff",
          duration: Snackbar.LENGTH_SHORT,
        });
        navigation.navigate("Login")
        resetForm({
          values: { name: "", email: "", phoneNo: "", password: "" },
        });
      } else {
        setIsLoading(false);
        Snackbar.show({
          text: res.error || "Signup failed",
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
        <Text style={styles.title}>Sign Up</Text>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#aaa"
          value={values.name}
          onChangeText={handleChange("name")}
        />
        {errors.name && touched.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}

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

        {/* Phone Number Input */}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          value={values.phoneNo}
          onChangeText={handleChange("phoneNo")}
        />
        {errors.phoneNo && touched.phoneNo && (
          <Text style={styles.errorText}>{errors.phoneNo}</Text>
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

        {/* Submit Button */}
        {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity> */}
        <Button
          title="Sign Up"
          onPress={handleSubmit}
          style={styles.button}
          textStyle={styles.buttonText}
          loading={isLoading}
          disabled={isLoading}
          variant="success"
        />

        {/* Login Link */}
        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

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
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginTextBold: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
