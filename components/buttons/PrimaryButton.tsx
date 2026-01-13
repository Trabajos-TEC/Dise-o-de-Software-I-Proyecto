// components/buttons/PrimaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  darkTheme?: boolean;
  icon?: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  style,
  darkTheme = false,
  icon,
}) => {
  const themeColors = darkTheme ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: themeColors.btnPrimaryStart,
          borderColor: themeColors.btnPrimaryBorder,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <>{icon}</>}
      <Text
        style={[
          styles.text,
          {
            color: themeColors.btnPrimaryColor,
            marginLeft: icon ? 8 : 0,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PrimaryButton;