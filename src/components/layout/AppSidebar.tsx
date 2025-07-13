import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
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
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const { userProfile, signOut } = useAuth();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/50';

  const filteredItems = menuItems.filter(item => 
    userProfile?.role && item.roles.includes(userProfile.role)
  );

  return (
    <Sidebar className="w-60">
      <SidebarTrigger className="m-2 self-end" />
      
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
                  <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      <span>{t(item.title)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
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