// components/buttons/SecondaryButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  darkTheme?: boolean;
  icon?: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
          backgroundColor: themeColors.btnSecondaryStart,
          borderColor: themeColors.btnSecondaryBorder,
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
            color: themeColors.btnSecondaryColor,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 90,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SecondaryButton;