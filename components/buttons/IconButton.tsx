// components/buttons/IconButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  style?: ViewStyle;
  darkTheme?: boolean;
  size?: number;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  icon,
  style,
  darkTheme = false,
  size = 40,
}) => {
  const themeColors = darkTheme ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor: themeColors.menuToggleBg,
          borderColor: darkTheme ? themeColors.blue : themeColors.yellow,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 2,
  },
});

export default IconButton;