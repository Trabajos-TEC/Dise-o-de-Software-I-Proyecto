// components/Header.tsx
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { getGlobalStyles } from '../styles/global';
import { NavigationProp } from '../navigation/AppNavigator';

interface HeaderProps {
  toggleTheme: () => void;
  darkTheme: boolean;
  onLogoPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleTheme, 
  darkTheme,
  onLogoPress 
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { language, toggleLanguage, t } = useLanguage();
  const globalStyles = getGlobalStyles(darkTheme);
  const { theme } = globalStyles;

  const handleLogoPress = () => {
    if (onLogoPress) {
      onLogoPress();
    }
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.header, { 
      backgroundColor: theme.headerBg,
      borderBottomColor: theme.divider 
    }]}>
      {/* Logo como botón */}
      <TouchableOpacity 
        style={styles.logoContainer}
        onPress={handleLogoPress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/simpsons_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Botones a la derecha */}
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'rgba(0,0,0,0.05)' }]}
          onPress={toggleTheme}
          accessibilityLabel={t('toggleTheme')}
        >
          <Text style={[styles.iconText, { color: theme.text }]}>
            {darkTheme ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: 'rgba(0,0,0,0.05)', marginLeft: 8 }]}
          onPress={toggleLanguage}
          accessibilityLabel={t('toggleLanguage')}
        >
          <Text style={[styles.iconText, { color: theme.text }]}>
            {language === 'es' ? '🇪🇸' : '🇺🇸'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    height: 100,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 140,
    height: 70,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
});

export default Header;