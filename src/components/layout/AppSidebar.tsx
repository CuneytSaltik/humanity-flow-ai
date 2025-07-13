import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  StickyNote,
  Briefcase,
  Activity,
  Settings,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

// Hatanın kaynağı olan, eksik menuItems tanımını buraya ekliyoruz.
const menuItems = [
  { title: 'nav.dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
  { title: 'nav.users', url: '/users', icon: Users, roles: ['admin'] },
  { title: 'nav.clients', url: '/clients', icon: UserCheck, roles: ['admin', 'manager', 'employee'] },
  { title: 'nav.appointments', url: '/appointments', icon: Calendar, roles: ['admin', 'manager', 'employee'] },
  { title: 'nav.documents', url: '/documents', icon: FileText, roles: ['admin', 'manager', 'employee'] },
  { title: 'nav.notes', url: '/notes', icon: StickyNote, roles: ['admin', 'manager', 'employee'] },
  { title: 'nav.hr', url: '/hr', icon: Briefcase, roles: ['admin', 'manager'] },
  { title: 'nav.activity', url: '/activity', icon: Activity, roles: ['admin'] },
];

export function AppSidebar() {
  const location = useLocation();
  const { t } = useLanguage();
  const { userProfile, signOut, loading } = useAuth();
  const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  // Profil yüklenirken veya bulunamazsa iskelet (skeleton) göster
  if (loading || !userProfile) {
    return (
      <Sidebar className="w-60">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Social Services Platform</SidebarGroupLabel>
            <SidebarGroupContent className="p-2">
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Kullanıcının rolüne göre menüleri filtrele
  const filteredItems = menuItems.filter(item =>
    userProfile.role && item.roles.includes(userProfile.role)
  );

  return (
    <Sidebar className="w-60">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Social Services Platform
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls({ isActive: location.pathname === item.url })}>
                      <item.icon className="w-4 h-4" />
                      <span>{t(item.title)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls({ isActive: location.pathname === '/settings' })}>
                    <Settings className="w-4 h-4" />
                    <span>{t('nav.settings')}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}