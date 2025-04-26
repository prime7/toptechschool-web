import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { CertificationItem } from '../types';
import { Plus, Trash2, Pencil, ExternalLink, Calendar, Award, Building } from 'lucide-react';
import { generateId } from '../utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const emptyCertification: Omit<CertificationItem, 'id'> = {
  name: '',
  issuer: '',
  date: '',
  expires: '',
  url: ''
};

const CertificationsEditor: React.FC = () => {
  const { state, dispatch } = useResume();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<CertificationItem, 'id'>>(emptyCertification);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      dispatch({
        type: 'UPDATE_CERTIFICATION',
        payload: { id: isEditing, data: formData }
      });
      setIsEditing(null);
    } else {
      dispatch({
        type: 'ADD_CERTIFICATION',
        payload: { id: generateId(), ...formData }
      });
    }
    setFormData(emptyCertification);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData(emptyCertification);
    setIsModalOpen(false);
    setIsEditing(null);
  };

  const handleEdit = (item: CertificationItem) => {
    setFormData({
      name: item.name,
      issuer: item.issuer,
      date: item.date,
      expires: item.expires || '',
      url: item.url || ''
    });
    setIsEditing(item.id);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch({ type: 'REMOVE_CERTIFICATION', payload: deleteId });
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('default', { month: 'short', year: 'numeric' });
  };

  const addNewCertification = () => {
    setIsEditing(null);
    setFormData(emptyCertification);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Certifications</h2>
        <p className="text-muted-foreground mt-1">
          Add professional certifications, licenses, and courses you've completed.
        </p>
      </div>
      
      <Button onClick={addNewCertification} variant="default" size="sm" className="flex gap-1">
        <Plus className="h-4 w-4" />
        <span>Add Certification</span>
      </Button>
      
      {state.certifications.length === 0 && !isModalOpen && (
        <Alert className="bg-muted/50 text-muted-foreground border border-dashed border-muted">
          <Award className="h-4 w-4" />
          <AlertDescription>
            You haven't added any certifications yet. Add certifications to demonstrate your professional qualifications.
          </AlertDescription>
        </Alert>
      )}
      
      {state.certifications.length > 0 && (
        <div className="grid gap-4">
          {state.certifications.map((item) => (
            <Card key={item.id} className="group overflow-hidden bg-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{item.issuer}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Issued: {formatDate(item.date)}
                        {item.expires && ` · Expires: ${formatDate(item.expires)}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteDialog(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                
                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-3 text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Certification Form Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
            <DialogDescription>
              Enter your certification details below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Certification Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="AWS Certified Solutions Architect, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issuer">Issuing Organization</Label>
              <Input
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                placeholder="Amazon Web Services, Cisco, etc."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date Issued</Label>
                <Input
                  type="month"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expires">Expiration Date (Optional)</Label>
                <Input
                  type="month"
                  id="expires"
                  name="expires"
                  value={formData.expires}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">Certificate URL (Optional)</Label>
              <Input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/certificate"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="button" onClick={handleSubmit}>
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CertificationsEditor;