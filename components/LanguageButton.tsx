import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const LanguageButton: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Pressable
      onPress={toggleLanguage}
      accessibilityLabel={t('toggleLanguage') || 'Toggle language'}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        <Text>🌐</Text>
      </View>

      <Text style={styles.text}>
        {language === 'en' ? 'ES' : 'EN'}
      </Text>
    </Pressable>
  );
};

export default LanguageButton;

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
