// src/components/MainLayout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
  children: React.ReactNode;
  headerProps?: React.ComponentProps<typeof Header>;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  headerProps = {},
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`simpsons-app ${isDarkMode ? 'dark-mode' : 'light-mode'} ${className}`}>
      {showHeader && <Header {...headerProps} />}
      
      <main className="app-main">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;