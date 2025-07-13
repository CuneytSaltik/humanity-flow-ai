import React, { createContext, useContext, useState } from 'react';

type Language = 'tr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  tr: {
    // Navigation
    'nav.dashboard': 'Raporlar ve Panel',
    'nav.adminPanel': 'Yönetim Paneli',
    'nav.users': 'Kullanıcılar',
    'nav.clients': 'Müşteriler',
    'nav.appointments': 'Randevular',
    'nav.documents': 'Belgeler',
    'nav.notes': 'Notlar',
    'nav.hr': 'Çalışanlar (İK)',
    'nav.activity': 'Aktivite Günlüğü',
    'nav.chat': 'AI Asistan',
    'nav.settings': 'Ayarlar',
    'nav.logout': 'Çıkış',

    // Common
    'common.add': 'Ekle',
    'common.edit': 'Düzenle',
    'common.delete': 'Sil',
    'common.save': 'Kaydet',
    'common.cancel': 'İptal',
    'common.search': 'Ara',
    'common.filter': 'Filtrele',
    'common.actions': 'İşlemler',
    'common.status': 'Durum',
    'common.name': 'Ad',
    'common.email': 'E-posta',
    'common.phone': 'Telefon',
    'common.address': 'Adres',
    'common.role': 'Rol',
    'common.organization': 'Organizasyon',
    'common.date': 'Tarih',
    'common.time': 'Saat',
    'common.notes': 'Notlar',
    'common.upload': 'Yükle',
    'common.download': 'İndir',
    'common.preview': 'Önizleme',

    // Auth
    'auth.signin': 'Giriş Yap',
    'auth.signup': 'Kayıt Ol',
    'auth.email': 'E-posta',
    'auth.password': 'Şifre',
    'auth.confirmPassword': 'Şifre Onayı',
    'auth.fullName': 'Ad Soyad',
    'auth.signinTitle': 'Hesabınıza Giriş Yapın',
    'auth.signupTitle': 'Yeni Hesap Oluşturun',

    // Dashboard
    'dashboard.title': 'Ana Panel',
    'dashboard.totalUsers': 'Toplam Kullanıcı',
    'dashboard.totalClients': 'Toplam Müşteri',
    'dashboard.totalAppointments': 'Toplam Randevu',
    'dashboard.recentActivity': 'Son Aktiviteler',

    // Users
    'users.title': 'Kullanıcı Yönetimi',
    'users.addUser': 'Kullanıcı Ekle',
    'users.editUser': 'Kullanıcı Düzenle',
    'users.fullName': 'Ad Soyad',
    'users.role.admin': 'Yönetici',
    'users.role.manager': 'Müdür',
    'users.role.employee': 'Çalışan',

    // Clients
    'clients.title': 'Müşteri Yönetimi',
    'clients.addClient': 'Müşteri Ekle',
    'clients.editClient': 'Müşteri Düzenle',
    'clients.assignedTo': 'Atanan Kişi',
    'clients.serviceStartDate': 'Hizmet Başlama Tarihi',

    // Documents
    'documents.title': 'Belge Yönetimi',
    'documents.addDocument': 'Belge Ekle',
    'documents.client': 'Müşteri',
    'documents.file': 'Dosya',
    'documents.uploadFile': 'Dosyayı buraya sürükleyin veya tıklayın',

    // Appointments
    'appointments.title': 'Randevu Yönetimi',
    'appointments.addAppointment': 'Randevu Ekle',
    'appointments.editAppointment': 'Randevu Düzenle',
    'appointments.client': 'Müşteri',
    'appointments.assignedUser': 'Atanan Kullanıcı',

    // HR
    'hr.title': 'İnsan Kaynakları',
    'hr.leaves': 'İzin Talepleri',
    'hr.addLeave': 'İzin Talebi Ekle',
    'hr.leaveType': 'İzin Türü',
    'hr.dateFrom': 'Başlangıç Tarihi',
    'hr.dateTo': 'Bitiş Tarihi',
    'hr.reason': 'Sebep',
    'hr.approve': 'Onayla',
    'hr.reject': 'Reddet',

    // Activity
    'activity.title': 'Aktivite Günlüğü',
    'activity.user': 'Kullanıcı',
    'activity.action': 'İşlem',
    'activity.target': 'Hedef',
    'activity.details': 'Detaylar',

    // Chat
    'chat.title': 'AI Asistan',
    'chat.placeholder': 'Sorunuzu yazın...',
    'chat.send': 'Gönder',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Berichte & Dashboard',
    'nav.adminPanel': 'Admin-Bereich',
    'nav.users': 'Benutzer',
    'nav.clients': 'Kunden',
    'nav.appointments': 'Termine',
    'nav.documents': 'Dokumente',
    'nav.notes': 'Notizen',
    'nav.hr': 'Mitarbeiter (HR)',
    'nav.activity': 'Aktivitätsprotokoll',
    'nav.chat': 'AI Assistent',
    'nav.settings': 'Einstellungen',
    'nav.logout': 'Abmelden',

    // Common
    'common.add': 'Hinzufügen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.actions': 'Aktionen',
    'common.status': 'Status',
    'common.name': 'Name',
    'common.email': 'E-Mail',
    'common.phone': 'Telefon',
    'common.address': 'Adresse',
    'common.role': 'Rolle',
    'common.organization': 'Organisation',
    'common.date': 'Datum',
    'common.time': 'Uhrzeit',
    'common.notes': 'Notizen',
    'common.upload': 'Hochladen',
    'common.download': 'Herunterladen',
    'common.preview': 'Vorschau',

    // Auth
    'auth.signin': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort bestätigen',
    'auth.fullName': 'Vollständiger Name',
    'auth.signinTitle': 'In Ihr Konto einloggen',
    'auth.signupTitle': 'Neues Konto erstellen',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalUsers': 'Gesamtbenutzer',
    'dashboard.totalClients': 'Gesamtkunden',
    'dashboard.totalAppointments': 'Gesamttermine',
    'dashboard.recentActivity': 'Letzte Aktivitäten',

    // Users
    'users.title': 'Benutzerverwaltung',
    'users.addUser': 'Benutzer hinzufügen',
    'users.editUser': 'Benutzer bearbeiten',
    'users.fullName': 'Vollständiger Name',
    'users.role.admin': 'Administrator',
    'users.role.manager': 'Manager',
    'users.role.employee': 'Mitarbeiter',

    // Clients
    'clients.title': 'Kundenverwaltung',
    'clients.addClient': 'Kunde hinzufügen',
    'clients.editClient': 'Kunde bearbeiten',
    'clients.assignedTo': 'Zugewiesen an',
    'clients.serviceStartDate': 'Service-Startdatum',

    // Documents
    'documents.title': 'Dokumentenverwaltung',
    'documents.addDocument': 'Dokument hinzufügen',
    'documents.client': 'Kunde',
    'documents.file': 'Datei',
    'documents.uploadFile': 'Datei hierher ziehen oder klicken',

    // Appointments
    'appointments.title': 'Terminverwaltung',
    'appointments.addAppointment': 'Termin hinzufügen',
    'appointments.editAppointment': 'Termin bearbeiten',
    'appointments.client': 'Kunde',
    'appointments.assignedUser': 'Zugewiesener Benutzer',

    // HR
    'hr.title': 'Personalwesen',
    'hr.leaves': 'Urlaubsanträge',
    'hr.addLeave': 'Urlaubsantrag hinzufügen',
    'hr.leaveType': 'Urlaubsart',
    'hr.dateFrom': 'Von Datum',
    'hr.dateTo': 'Bis Datum',
    'hr.reason': 'Grund',
    'hr.approve': 'Genehmigen',
    'hr.reject': 'Ablehnen',

    // Activity
    'activity.title': 'Aktivitätsprotokoll',
    'activity.user': 'Benutzer',
    'activity.action': 'Aktion',
    'activity.target': 'Ziel',
    'activity.details': 'Details',

    // Chat
    'chat.title': 'AI Assistent',
    'chat.placeholder': 'Stellen Sie Ihre Frage...',
    'chat.send': 'Senden',
  },
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};