import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import AnalyticsButton from './AnalyticsButton';
import { searchCards } from './cardUtils';
import LanguageButton from './LanguageButton';
import PerfilButton from './perfilButton';
import SignInButton from './SignInButton';
import ThemeButton from './ThemeButton';

interface HeaderProps {
  showSearch?: boolean;
  disableSearch?: boolean;
  onLogoPress?: () => void;
  onSearchResults?: (query: string, results: any[]) => void;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = true,
  disableSearch = false,
  onLogoPress,
  onSearchResults,
}) => {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleLogoPress = () => {
    setSearchQuery('');
    onLogoPress?.();
  };

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed || disableSearch) return;

    setIsSearching(true);
    try {
      const results = await searchCards(trimmed);
      onSearchResults?.(trimmed, results);
    } catch (err) {
      console.error('Search error:', err);
      alert(`${t('searchingFor')}: "${searchQuery}"`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* IZQUIERDA – LOGO */}
      <Pressable onPress={handleLogoPress} style={styles.logoButton}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Pressable>

      {/* CENTRO – BUSCADOR */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={!isSearching && !disableSearch}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          <Pressable
            style={[
              styles.searchButton,
              (isSearching || !searchQuery.trim()) && styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text style={styles.searchIcon}>⌕</Text>
            )}
          </Pressable>
        </View>
      )}

      {/* DERECHA – BOTONES */}
      <View style={styles.actions}>
        <AnalyticsButton />
        <LanguageButton />
        <ThemeButton />
        <SignInButton />
        <PerfilButton />
      </View>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD90F',
  },

  logoButton: {
    padding: 4,
  },

  logo: {
    width: 90,
    height: 36,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 14,
  },

  searchButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  searchButtonDisabled: {
    opacity: 0.5,
  },

  searchIcon: {
    fontSize: 16,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
