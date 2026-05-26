import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCertificate, useCreateCertificate, useUpdateCertificate } from '../../../hooks/cms/useCertificates';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import ImageUploader from '../ui/ImageUploader';
import { SkeletonForm } from '../ui/Skeleton';
import type { CertificateFormData } from '../../../types/cms';

const defaultForm: CertificateFormData = {
  title: '',
  issuer: '',
  issue_date: null,
  credential_url: '',
  image_url: '',
  category: 'General',
  featured: false,
  visible: true,
  order_index: 0,
};

const CertificateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: existing, isLoading } = useCertificate(id ?? '');
  const createCert = useCreateCertificate();
  const updateCert = useUpdateCertificate();

  const [form, setForm] = useState<CertificateFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CertificateFormData, string>>>({});

  useEffect(() => {
    if (existing) setForm({ ...defaultForm, ...existing });
  }, [existing]);

  const update = <K extends keyof CertificateFormData>(key: K, value: CertificateFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.issuer.trim()) errs.issuer = 'Issuer is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (isEditing && id) {
        await updateCert.mutateAsync({ id, updates: form });
        toast.success('Certificate updated!');
      } else {
        await createCert.mutateAsync(form);
        toast.success('Certificate created!');
        navigate('/.admin/dashboard/certificates');
      }
    } catch {
      toast.error('Failed to save certificate');
    }
  };

  if (isLoading && isEditing) return <SkeletonForm />;
  const isSaving = createCert.isPending || updateCert.isPending;

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Certificate' : 'New Certificate'}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/.admin/dashboard/certificates')} leftIcon={<ArrowLeft className="w-4 h-4" />}>Back</Button>
            <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        }
      />

      <div className="max-w-2xl space-y-6">
        <div className="p-5 bg-charcoal-800/40 border border-white/5 rounded-2xl">
          <h3 className="text-sm font-semibold text-white mb-4">Certificate Image</h3>
          <ImageUploader
            bucket="certificates"
            currentUrl={form.image_url}
            onUpload={url => update('image_url', url)}
            onRemove={() => update('image_url', '')}
            previewClassName="h-48"
          />
        </div>

        <FormField label="Certificate Title" required error={errors.title}>
          <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="Certificate Name" error={errors.title} />
        </FormField>

        <FormField label="Issuing Organization" required error={errors.issuer}>
          <Input value={form.issuer} onChange={e => update('issuer', e.target.value)} placeholder="e.g. Coursera, Google" error={errors.issuer} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Issue Date">
            <Input type="date" value={form.issue_date ?? ''} onChange={e => update('issue_date', e.target.value || null)} />
          </FormField>
          <FormField label="Category">
            <Input value={form.category} onChange={e => update('category', e.target.value)} placeholder="General" />
          </FormField>
        </div>

        <FormField label="Credential URL" hint="Link to verify the certificate">
          <Input type="url" value={form.credential_url} onChange={e => update('credential_url', e.target.value)} placeholder="https://..." />
        </FormField>

        <div className="p-5 bg-charcoal-800/40 border border-white/5 rounded-2xl space-y-4">
          <Toggle id="cert-featured" checked={form.featured} onChange={val => update('featured', val)} label="Mark as featured" />
          <Toggle id="cert-visible" checked={form.visible} onChange={val => update('visible', val)} label="Visible on portfolio" />
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;
