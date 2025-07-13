import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  service_start_date: string;
}

interface Document {
  id: string;
  filename: string | null;
  file_url: string | null;
  created_at: string | null;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  users?: { full_name: string };
}

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!clientId) return;
    const loadData = async () => {
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      setClient(clientData);

      let docQuery = supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      if (userProfile?.role === 'employee') {
        docQuery = docQuery.eq('clients.assigned_to_user_id', userProfile.id);
      }
      const { data: docData } = await docQuery;
      setDocuments(docData || []);

      let apptQuery = supabase
        .from('appointments')
        .select('*, users(full_name)')
        .eq('client_id', clientId)
        .order('date', { ascending: false });
      if (userProfile?.role === 'employee') {
        apptQuery = apptQuery.eq('user_id', userProfile.id);
      }
      const { data: apptData } = await apptQuery;
      setAppointments(apptData || []);
    };
    loadData();
  }, [clientId, userProfile]);

  if (!client) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">{t('clients.infoTab')}</TabsTrigger>
          <TabsTrigger value="documents">{t('clients.documentsTab')}</TabsTrigger>
          <TabsTrigger value="appointments">{t('clients.appointmentsTab')}</TabsTrigger>
          <TabsTrigger value="notes">{t('clients.notesTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.profile')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>{t('common.email')}: {client.email}</div>
              <div>{t('common.phone')}: {client.phone}</div>
              <div>{t('common.address')}: {client.address}</div>
              <div>{t('common.status')}: {client.status}</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{t('documents.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.filename}</TableCell>
                      <TableCell>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>{t('appointments.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('common.time')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('appointments.assignedUser')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell>{appt.date}</TableCell>
                      <TableCell>{appt.time}</TableCell>
                      <TableCell>{appt.status}</TableCell>
                      <TableCell>{appt.users?.full_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>{t('clients.notesTab')}</CardTitle>
            </CardHeader>
            <CardContent>
              Coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
