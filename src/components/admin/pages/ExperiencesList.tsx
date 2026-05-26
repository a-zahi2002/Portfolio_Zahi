import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Briefcase, Calendar } from 'lucide-react';
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
  useAllExperiences,
  useDeleteExperience,
  useToggleExperienceVisibility,
  useReorderExperiences,
} from '../../../hooks/cms/useExperiences';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import type { Experience } from '../../../types/cms';

const ExperiencesList: React.FC = () => {
  const navigate = useNavigate();
  const { data: experiences, isLoading } = useAllExperiences();
  const deleteExperience = useDeleteExperience();
  const toggleVisibility = useToggleExperienceVisibility();
  const reorderExperiences = useReorderExperiences();
  
  const [items, setItems] = useState<Experience[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
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
    if (experiences) {
      setItems(experiences);
    }
  }, [experiences]);

  const filtered = items.filter(e =>
    e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExperience.mutateAsync(deleteTarget.id);
      toast.success(`Experience at "${deleteTarget.company}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete experience');
    }
  };

  const handleToggle = async (exp: Experience) => {
    try {
      await toggleVisibility.mutateAsync({ id: exp.id, visible: !exp.visible });
      toast.success(`Experience is now ${!exp.visible ? 'visible' : 'hidden'}`);
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
      await reorderExperiences.mutateAsync(payload);
      toast.success('Experience order updated');
    } catch {
      toast.error('Failed to update experience order');
      setItems(experiences ?? []);
    }
  };

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Manage your professional career history"
        action={
          <Button
            onClick={() => navigate('/.admin/dashboard/experiences/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Experience
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search experiences…"
          className="w-full max-w-sm px-4 py-2.5 bg-charcoal-800/60 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-7 h-7" />}
          title="No experiences found"
          description="Add your first professional experience to showcase your journey."
          actionLabel="Add Experience"
          onAction={() => navigate('/.admin/dashboard/experiences/new')}
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
              {filtered.map(exp => (
                <SortableItem key={exp.id} id={exp.id}>
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
                      <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{exp.role}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {exp.company} · <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3 inline" /> {exp.start_date} - {exp.end_date || 'Present'}</span>
                        </p>
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {exp.technologies.map(tech => (
                              <span key={tech} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Visibility badge */}
                      <Badge variant={exp.visible ? 'success' : 'neutral'}>
                        {exp.visible ? 'Visible' : 'Hidden'}
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggle(exp)}
                          title={exp.visible ? 'Hide' : 'Show'}
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {exp.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => navigate(`/.admin/dashboard/experiences/${exp.id}`)}
                          title="Edit"
                          className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(exp)}
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
        title="Delete Experience"
        message={`Are you sure you want to delete the experience at "${deleteTarget?.company}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteExperience.isPending}
      />
    </div>
  );
};

export default ExperiencesList;
