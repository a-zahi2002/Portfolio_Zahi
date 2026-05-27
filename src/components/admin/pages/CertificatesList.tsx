import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Award, GripVertical, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from '../ui/SortableItem';
import { useAllCertificates, useDeleteCertificate, useToggleCertVisibility, useReorderCertificates } from '../../../hooks/cms/useCertificates';
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
  const reorderCerts = useReorderCertificates();

  const [items, setItems] = useState<CMSCertificate[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CMSCertificate | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (certs) {
      setItems(certs);
    }
  }, [certs]);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    try {
      const payload = reordered.map((item, idx) => ({
        id: item.id,
        order_index: idx,
      }));
      await reorderCerts.mutateAsync(payload);
      toast.success('Certificate order updated');
    } catch {
      toast.error('Failed to update certificate order');
      setItems(certs ?? []);
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
      ) : !items.length ? (
        <EmptyState
          icon={<Award className="w-7 h-7" />}
          title="No certificates yet"
          description="Add your certifications to showcase your credentials."
          actionLabel="Add Certificate"
          onAction={() => navigate('/.admin/dashboard/certificates/new')}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            <SortableContext
              items={items.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map(cert => (
                <SortableItem key={cert.id} id={cert.id}>
                  {({ ref, style, dragHandleProps }) => (
                    <div
                      ref={ref}
                      style={style}
                      className="group flex items-center gap-4 p-4 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-xl hover:border-gray-300 dark:border-white/10 transition-all duration-150"
                    >
                      {/* Drag handle */}
                      <div
                        {...dragHandleProps.attributes}
                        {...dragHandleProps.listeners}
                        className="cursor-grab p-1 hover:bg-gray-100 dark:bg-white/5 rounded text-gray-700 hover:text-gray-500 dark:text-gray-400 transition-colors shrink-0"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-white/5 shrink-0 flex items-center justify-center">
                        {cert.image_url ? (
                          cert.image_url.toLowerCase().endsWith('.pdf') ? (
                            <FileText className="w-5 h-5 text-red-500" />
                          ) : (
                            <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <Award className="w-5 h-5 text-accent-cyan" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal-900 dark:text-white truncate">{cert.title}</p>
                        <p className="text-xs text-gray-500 truncate">{cert.issuer}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={cert.visible ? 'success' : 'neutral'} className="text-xs">
                          {cert.visible ? 'Visible' : 'Hidden'}
                        </Badge>
                        {cert.featured && <Badge variant="info" className="text-xs">Featured</Badge>}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 mt-2 sm:mt-0 w-full sm:w-auto justify-end transition-opacity shrink-0">
                        <button onClick={() => handleToggle(cert)} className="p-2 rounded-lg text-gray-500 hover:text-charcoal-900 dark:text-white hover:bg-gray-100 dark:bg-white/5 transition-colors">
                          {cert.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => navigate(`/.admin/dashboard/certificates/${cert.id}`)} className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(cert)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </div>
        </DndContext>
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
