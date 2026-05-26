import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAllCertificates, useDeleteCertificate, useToggleCertVisibility } from '../../../hooks/cms/useCertificates';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import type { CMSCertificate } from '../../../types/cms';

const CertificatesList: React.FC = () => {
  const navigate = useNavigate();
  const { data: certs, isLoading } = useAllCertificates();
  const deleteCert = useDeleteCertificate();
  const toggleVis = useToggleCertVisibility();
  const [deleteTarget, setDeleteTarget] = useState<CMSCertificate | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCert.mutateAsync(deleteTarget.id);
      toast.success('Certificate deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete certificate');
    }
  };

  const handleToggle = async (cert: CMSCertificate) => {
    try {
      await toggleVis.mutateAsync({ id: cert.id, visible: !cert.visible });
      toast.success(`"${cert.title}" is now ${!cert.visible ? 'visible' : 'hidden'}`);
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Manage your certificates and credentials"
        action={
          <Button onClick={() => navigate('/.admin/dashboard/certificates/new')} leftIcon={<Plus className="w-4 h-4" />}>
            Add Certificate
          </Button>
        }
      />

      {isLoading ? (
        <SkeletonTable />
      ) : !certs?.length ? (
        <EmptyState
          icon={<Award className="w-7 h-7" />}
          title="No certificates yet"
          description="Add your certifications to showcase your credentials."
          actionLabel="Add Certificate"
          onAction={() => navigate('/.admin/dashboard/certificates/new')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certs.map(cert => (
            <div key={cert.id} className="group flex gap-4 p-4 bg-charcoal-800/40 border border-white/5 rounded-xl hover:border-white/10 transition-all">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal-900 border border-white/5 shrink-0 flex items-center justify-center">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  <Award className="w-6 h-6 text-accent-cyan" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{cert.title}</p>
                <p className="text-xs text-gray-500 truncate">{cert.issuer}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={cert.visible ? 'success' : 'neutral'} className="text-xs">
                    {cert.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                  {cert.featured && <Badge variant="info" className="text-xs">Featured</Badge>}
                </div>
              </div>

              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => handleToggle(cert)} className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
                  {cert.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => navigate(`/.admin/dashboard/certificates/${cert.id}`)} className="p-1.5 rounded-lg text-gray-600 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(cert)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteCert.isPending}
      />
    </div>
  );
};

export default CertificatesList;
