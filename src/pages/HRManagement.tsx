import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface HRLeave {
  id: string;
  user_id: string;
  type: string;
  date_from: string;
  date_to: string;
  reason: string;
  status: string;
  approved_by: string;
  created_at: string;
  users?: { full_name: string };
  approvers?: { full_name: string };
}

const HRManagement = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [leaves, setLeaves] = useState<HRLeave[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<HRLeave[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'annual',
    date_from: '',
    date_to: '',
    reason: ''
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  useEffect(() => {
    filterLeaves();
  }, [leaves, searchTerm, selectedStatus]);

  const loadLeaves = async () => {
    try {
      let query = supabase
        .from('hr_leaves')
        .select('*, users!user_id(full_name)')
        .order('created_at', { ascending: false });

      // If user is employee, only show their own leaves
      if (userProfile?.role === 'employee') {
        query = query.eq('user_id', userProfile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeaves(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive",
      });
    }
  };

  const filterLeaves = () => {
    let filtered = leaves;

    if (searchTerm) {
      filtered = filtered.filter(leave => 
        leave.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(leave => leave.status === selectedStatus);
    }

    setFilteredLeaves(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('hr_leaves')
        .insert({
          ...formData,
          user_id: userProfile?.id,
          status: 'pending'
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });

      setIsDialogOpen(false);
      setFormData({
        type: 'annual',
        date_from: '',
        date_to: '',
        reason: ''
      });
      loadLeaves();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApproval = async (leaveId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('hr_leaves')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          approved_by: userProfile?.id
        })
        .eq('id', leaveId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Leave request ${action}d successfully`,
      });
      
      loadLeaves();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800',
      personal: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const canApprove = userProfile?.role === 'admin' || userProfile?.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('hr.title')}</h1>
          <p className="text-muted-foreground">Manage leave requests and HR processes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormData({
                type: 'annual',
                date_from: '',
                date_to: '',
                reason: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('hr.addLeave')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('hr.addLeave')}</DialogTitle>
              <DialogDescription>
                Submit a new leave request
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t('hr.leaveType')}</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="emergency">Emergency Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_from">{t('hr.dateFrom')}</Label>
                <Input
                  id="date_from"
                  type="date"
                  value={formData.date_from}
                  onChange={(e) => setFormData({...formData, date_from: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date_to">{t('hr.dateTo')}</Label>
                <Input
                  id="date_to"
                  type="date"
                  value={formData.date_to}
                  onChange={(e) => setFormData({...formData, date_to: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">{t('hr.reason')}</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
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
              <CardTitle>{t('hr.leaves')}</CardTitle>
              <CardDescription>All leave requests in the system</CardDescription>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {canApprove && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.users?.full_name}</TableCell>
                  <TableCell>
                    <Badge className={getLeaveTypeBadge(leave.type)}>
                      {leave.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{leave.date_from}</TableCell>
                  <TableCell>{leave.date_to}</TableCell>
                  <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(leave.status)}>
                      {leave.status}
                    </Badge>
                  </TableCell>
                  {canApprove && (
                    <TableCell>
                      {leave.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproval(leave.id, 'approve')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproval(leave.id, 'reject')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRManagement;