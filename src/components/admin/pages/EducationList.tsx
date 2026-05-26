import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, GraduationCap, Calendar } from 'lucide-react';
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
import {
  useAllEducation,
  useDeleteEducation,
  useToggleEducationVisibility,
  useReorderEducation,
} from '../../../hooks/cms/useEducation';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import type { Education } from '../../../types/cms';

const EducationList: React.FC = () => {
  const navigate = useNavigate();
  const { data: education, isLoading } = useAllEducation();
  const deleteEducation = useDeleteEducation();
  const toggleVisibility = useToggleEducationVisibility();
  const reorderEducation = useReorderEducation();

  const [items, setItems] = useState<Education[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    if (education) {
      setItems(education);
    }
  }, [education]);

  const filtered = items.filter(edu =>
    edu.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    edu.degree.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEducation.mutateAsync(deleteTarget.id);
      toast.success(`Education at "${deleteTarget.institution}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete education item');
    }
  };

  const handleToggle = async (edu: Education) => {
    try {
      await toggleVisibility.mutateAsync({ id: edu.id, visible: !edu.visible });
      toast.success(`Education item is now ${!edu.visible ? 'visible' : 'hidden'}`);
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
      await reorderEducation.mutateAsync(payload);
      toast.success('Education order updated');
    } catch {
      toast.error('Failed to update education order');
      setItems(education ?? []);
    }
  };

  return (
    <div>
      <PageHeader
        title="Education"
        description="Manage your academic background"
        action={
          <Button
            onClick={() => navigate('/.admin/dashboard/education/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Education
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search education…"
          className="w-full max-w-sm px-4 py-2.5 bg-charcoal-800/60 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-7 h-7" />}
          title="No education items found"
          description="Add your first academic item to showcase your background."
          actionLabel="Add Education"
          onAction={() => navigate('/.admin/dashboard/education/new')}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            <SortableContext
              items={filtered.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {filtered.map(edu => (
                <SortableItem key={edu.id} id={edu.id}>
                  {({ ref, style, dragHandleProps }) => (
                    <div
                      ref={ref}
                      style={style}
                      className="flex items-center gap-4 p-4 bg-charcoal-800/40 border border-white/5 rounded-xl hover:border-white/10 transition-all duration-150 group"
                    >
                      {/* Drag handle */}
                      <div
                        {...dragHandleProps.attributes}
                        {...dragHandleProps.listeners}
                        className="cursor-grab p-1 hover:bg-white/5 rounded text-gray-700 hover:text-gray-400 transition-colors shrink-0"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Icon & Info */}
                      <div className="w-10 h-10 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{edu.degree}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {edu.institution} · <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3 inline" /> {edu.start_date} - {edu.end_date || 'Present'}</span>
                        </p>
                      </div>

                      {/* Visibility badge */}
                      <Badge variant={edu.visible ? 'success' : 'neutral'}>
                        {edu.visible ? 'Visible' : 'Hidden'}
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggle(edu)}
                          title={edu.visible ? 'Hide' : 'Show'}
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {edu.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => navigate(`/.admin/dashboard/education/${edu.id}`)}
                          title="Edit"
                          className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(edu)}
                          title="Delete"
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                        >
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
        title="Delete Education Item"
        message={`Are you sure you want to delete "${deleteTarget?.degree}" from "${deleteTarget?.institution}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteEducation.isPending}
      />
    </div>
  );
};

export default EducationList;
