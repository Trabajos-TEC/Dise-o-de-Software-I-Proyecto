import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const ThemeButton: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityLabel={
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
      }
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        <Text>{isDarkMode ? '☀️' : '🌙'}</Text>
      </View>

      <Text style={styles.text}>
        {isDarkMode ? 'Light' : 'Dark'}
      </Text>
    </Pressable>
  );
};

export default ThemeButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    fontSize: 16,
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
});
