import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Download } from 'lucide-react';

interface Document {
  id: string;
  client_id: string | null;
  filename: string | null;
  file_url: string | null;
  created_at: string | null;
  clients?: { name: string; assigned_to_user_id: string | null };
}

const DocumentManagement = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ client_id: '' });
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadDocuments();
    loadClients();
  }, []);

  const loadDocuments = async () => {
    try {
      let query = supabase
        .from('documents')
        .select('*, clients(name, assigned_to_user_id)')
        .order('created_at', { ascending: false });

      if (userProfile?.role === 'employee') {
        query = query.eq('clients.assigned_to_user_id', userProfile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load documents', variant: 'destructive' });
    }
  };

  const loadClients = async () => {
    try {
      let query = supabase.from('clients').select('id, name');
      if (userProfile?.role === 'employee') {
        query = query.eq('assigned_to_user_id', userProfile.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.client_id) return;

    try {
      const path = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);

      const { error: insertError } = await supabase.from('documents').insert({
        client_id: formData.client_id,
        filename: file.name,
        file_url: urlData.publicUrl
      });
      if (insertError) throw insertError;

      toast({ title: 'Success', description: 'Document uploaded successfully' });
      setIsDialogOpen(false);
      setFile(null);
      setFormData({ client_id: '' });
      loadDocuments();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('documents.title')}</h1>
          <p className="text-muted-foreground">Manage client documents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setFormData({ client_id: '' }); setFile(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('documents.addDocument')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('documents.addDocument')}</DialogTitle>
              <DialogDescription>Upload a new document</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">{t('documents.client')}</Label>
                <Select value={formData.client_id} onValueChange={(value) => setFormData({ client_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('documents.file')}</Label>
                <div
                  className="border border-dashed rounded p-4 text-center cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                >
                  {file ? file.name : t('documents.uploadFile')}
                </div>
                <Input type="file" accept="application/pdf,application/msword,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" ref={inputRef} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={!file || !formData.client_id}>
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>All uploaded documents</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('common.search')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('documents.client')}</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.clients?.name}</TableCell>
                  <TableCell>{doc.filename}</TableCell>
                  <TableCell>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}</TableCell>
                  <TableCell>
                    {doc.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManagement;
