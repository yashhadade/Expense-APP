import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  loadingColor = '#fff',
  variant = 'primary',
  size = 'medium',
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.buttonText;
    }
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButtonText;
      case 'medium':
        return styles.mediumButtonText;
      case 'large':
        return styles.largeButtonText;
      default:
        return styles.mediumButtonText;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        isDisabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            getTextVariantStyle(),
            getSizeTextStyle(),
            isDisabled && styles.disabledButtonText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#E53935',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  // Text styles
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#007AFF',
  },
  // Text size styles
  smallButtonText: {
    fontSize: 14,
  },
  mediumButtonText: {
    fontSize: 16,
  },
  largeButtonText: {
    fontSize: 18,
  },
  // Disabled styles
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    opacity: 0.6,
  },
});

export default Button;
