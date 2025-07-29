'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후에만 다크모드 설정 적용
    setMounted(true);
    
    // 초기 다크모드 설정 확인
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    // 다크모드 클래스 즉시 적용
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // 즉시 클래스 적용
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 마운트 전까지는 기본 스타일 적용 (다크모드 없음)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header darkMode={false} toggleDarkMode={() => {}} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 