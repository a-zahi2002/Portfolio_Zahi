import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, ExternalLink } from 'lucide-react';
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
import { useAllProjects, useDeleteProject, useToggleProjectVisibility, useReorderProjects } from '../../../hooks/cms/useProjects';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import type { CMSProject } from '../../../types/cms';

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useAllProjects();
  const deleteProject = useDeleteProject();
  const toggleVisibility = useToggleProjectVisibility();
  const reorderProjects = useReorderProjects();
  
  const [items, setItems] = useState<CMSProject[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CMSProject | null>(null);
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
    if (projects) {
      setItems(projects);
    }
  }, [projects]);

  const filtered = items.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleToggle = async (project: CMSProject) => {
    try {
      await toggleVisibility.mutateAsync({ id: project.id, visible: !project.visible });
      toast.success(`"${project.title}" is now ${!project.visible ? 'visible' : 'hidden'}`);
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
      await reorderProjects.mutateAsync(payload);
      toast.success('Project order updated');
    } catch {
      toast.error('Failed to update project order');
      setItems(projects ?? []);
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        action={
          <Button
            onClick={() => navigate('/.admin/dashboard/projects/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Project
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search projects…"
          className="w-full max-w-sm px-4 py-2.5 bg-white dark:bg-charcoal-800/60 border border-gray-300 dark:border-white/10 rounded-xl text-charcoal-900 dark:text-white placeholder-gray-600 text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Add your first project to showcase your work."
          actionLabel="Add Project"
          onAction={() => navigate('/.admin/dashboard/projects/new')}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            <SortableContext
              items={filtered.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {filtered.map(project => (
                <SortableItem key={project.id} id={project.id}>
                  {({ ref, style, dragHandleProps }) => (
                    <div
                      ref={ref}
                      style={style}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-xl hover:border-gray-300 dark:border-white/10 transition-all duration-150 group"
                    >
                      {/* Drag handle */}
                      <div
                        {...dragHandleProps.attributes}
                        {...dragHandleProps.listeners}
                        className="cursor-grab p-1 hover:bg-gray-100 dark:bg-white/5 rounded text-gray-700 hover:text-gray-500 dark:text-gray-400 transition-colors shrink-0"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-white/5 shrink-0">
                        {project.thumbnail_url ? (
                          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-charcoal-900 dark:text-white truncate">{project.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{project.category} · {project.technologies.slice(0, 3).join(', ')}</p>
                      </div>

                      {/* Visibility badge */}
                      <Badge variant={project.visible ? 'success' : 'neutral'}>
                        {project.visible ? 'Visible' : 'Hidden'}
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 mt-2 sm:mt-0 w-full sm:w-auto justify-end transition-opacity">
                        <button
                          onClick={() => handleToggle(project)}
                          title={project.visible ? 'Hide' : 'Show'}
                          className="p-2 rounded-lg text-gray-500 hover:text-charcoal-900 dark:text-white hover:bg-gray-100 dark:bg-white/5 transition-colors"
                        >
                          {project.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => navigate(`/.admin/dashboard/projects/${project.id}`)}
                          title="Edit"
                          className="p-2 rounded-lg text-gray-500 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(project)}
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
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteProject.isPending}
      />
    </div>
  );
};

export default ProjectsList;
