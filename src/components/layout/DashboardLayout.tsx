import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import ChatAssistant from '@/components/chat/ChatAssistant';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const { language, setLanguage } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background flex items-center justify-between px-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold">
                Social Services Platform
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={language === 'tr' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('tr')}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  TR
                </Button>
                <Button
                  variant={language === 'de' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('de')}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  DE
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {userProfile?.full_name} ({userProfile?.role})
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6 bg-muted/30">
            {children}
          </main>
        </div>
        
        <ChatAssistant />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;