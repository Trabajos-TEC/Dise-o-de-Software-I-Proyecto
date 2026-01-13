import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Mi App Anime</Text>
      <View style={styles.buttons}>
        <Button title="Theme" onPress={toggleTheme} />
        <View style={{ width: 10 }} /> {/* Separador */}
        <Button title={language === 'es' ? 'Idioma: ES' : 'Idioma: EN'} onPress={toggleLanguage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
