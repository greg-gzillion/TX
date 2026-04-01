// Mint operating years database for date validation
export const mintYears: Record<string, { start: number; end: number | 'present' }> = {
  // US Mints
  'Philadelphia (P) - 1792-present': { start: 1792, end: 'present' },
  'Denver (D) - 1906-present': { start: 1906, end: 'present' },
  'San Francisco (S) - 1854-present': { start: 1854, end: 'present' },
  'West Point (W) - 1988-present': { start: 1988, end: 'present' },
  'Carson City (CC) - 1870-1893': { start: 1870, end: 1893 },
  'Charlotte (C) - 1838-1861': { start: 1838, end: 1861 },
  'Dahlonega (D) - 1838-1861': { start: 1838, end: 1861 },
  'New Orleans (O) - 1838-1909': { start: 1838, end: 1909 },
  'Manila (M) - 1920-1922, 1925-1941': { start: 1920, end: 1941 },
  
  // Russian Mints
  'Saint Petersburg Mint (СПБ) - 1724-present': { start: 1724, end: 'present' },
  'Moscow Mint (ММД) - 1942-present': { start: 1942, end: 'present' },
  'Ekaterinburg Mint (ЕМ) - 1725-1876': { start: 1725, end: 1876 },
  'Suzun Mint (СУЗУН) - 1766-1847': { start: 1766, end: 1847 },
  
  // Canadian Mints
  'Royal Canadian Mint - Ottawa (1908-present)': { start: 1908, end: 'present' },
  'Royal Canadian Mint - Winnipeg (1976-present)': { start: 1976, end: 'present' },
  
  // UK Mints
  'Royal Mint - London (886-1975)': { start: 886, end: 1975 },
  'Royal Mint - Llantrisant (1968-present)': { start: 1968, end: 'present' },
  'Royal Mint - Tower Hill (1809-1975)': { start: 1809, end: 1975 },
  'Birmingham Mint (1850-2003)': { start: 1850, end: 2003 },
  
  // Mexico Mints
  'Mexico Mint (Casa de Moneda) - 1535-present': { start: 1535, end: 'present' },
  'Real de Catorce - 1773-1905': { start: 1773, end: 1905 },
  'Zacatecas Mint - 1810-1905': { start: 1810, end: 1905 },
  'Guanajuato Mint - 1812-1905': { start: 1812, end: 1905 },
  
  // Australia Mints
  'Perth Mint (1899-present)': { start: 1899, end: 'present' },
  'Royal Australian Mint - Canberra (1965-present)': { start: 1965, end: 'present' },
  'Sydney Mint (1855-1926)': { start: 1855, end: 1926 },
  'Melbourne Mint (1872-1927)': { start: 1872, end: 1927 },
  
  // Austria Mints
  'Austrian Mint (Münze Österreich) - 1489-present': { start: 1489, end: 'present' },
  'Hall Mint (1271-1809)': { start: 1271, end: 1809 },
  'Kremnica Mint (1328-present)': { start: 1328, end: 'present' },
  
  // South Africa
  'South African Mint - Pretoria (1892-present)': { start: 1892, end: 'present' },
  
  // Switzerland
  'Swissmint - Bern (1855-present)': { start: 1855, end: 'present' },
  'PAMP Suisse (1977-present)': { start: 1977, end: 'present' },
  'Valcambi (1961-present)': { start: 1961, end: 'present' },
  
  // Germany
  'Berlin Mint (A) - 1280-present': { start: 1280, end: 'present' },
  'Hamburg Mint (J) - 834-present': { start: 834, end: 'present' },
  'Munich Mint (D) - 1158-present': { start: 1158, end: 'present' },
  'Stuttgart Mint (F) - 1374-present': { start: 1374, end: 'present' },
  'Karlsruhe Mint (G) - 1827-present': { start: 1827, end: 'present' },
  'Dresden Mint (E) - 1556-present': { start: 1556, end: 'present' },
  'Frankfurt Mint (C) - 1405-present': { start: 1405, end: 'present' },
  
  // China
  'China Mint - Beijing': { start: 1949, end: 'present' },
  'China Mint - Shanghai': { start: 1949, end: 'present' },
  'China Mint - Shenzhen': { start: 1980, end: 'present' },
  'China Mint - Shenyang': { start: 1949, end: 'present' },
};
