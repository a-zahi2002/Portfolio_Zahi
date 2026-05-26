import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Wrench, GripVertical } from 'lucide-react';
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
import { useAllSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, useReorderSkills } from '../../../hooks/cms/useSkills';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import type { CMSSkill, SkillFormData } from '../../../types/cms';

const defaultSkill: SkillFormData = {
  name: '',
  category: 'Frontend',
  icon: '',
  color: '#00f3ff',
  proficiency: 80,
  visible: true,
  display_order: 0,
};

const SkillsList: React.FC = () => {
  const { data: skills, isLoading } = useAllSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const reorderSkills = useReorderSkills();

  const [items, setItems] = useState<CMSSkill[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<CMSSkill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CMSSkill | null>(null);
  const [form, setForm] = useState<SkillFormData>(defaultSkill);

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
    if (skills) {
      setItems(skills);
    }
  }, [skills]);

  const openAdd = () => {
    setForm({ ...defaultSkill, display_order: (items?.length ?? 0) });
    setEditTarget(null);
    setIsAdding(true);
  };

  const openEdit = (skill: CMSSkill) => {
    setForm({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      color: skill.color,
      proficiency: skill.proficiency,
      visible: skill.visible,
      display_order: skill.display_order,
    });
    setEditTarget(skill);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    try {
      if (editTarget) {
        await updateSkill.mutateAsync({ id: editTarget.id, updates: form });
        toast.success('Skill updated!');
      } else {
        await createSkill.mutateAsync(form);
        toast.success('Skill added!');
      }
      setIsAdding(false);
      setEditTarget(null);
    } catch {
      toast.error('Failed to save skill');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSkill.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" removed`);
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete skill');
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
        display_order: idx,
      }));
      await reorderSkills.mutateAsync(payload);
      toast.success('Skills order updated');
    } catch {
      toast.error('Failed to update skills order');
      setItems(skills ?? []);
    }
  };

  const isSaving = createSkill.isPending || updateSkill.isPending;

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Manage your technical skills shown in the marquee"
        action={<Button onClick={openAdd} leftIcon={<Plus className="w-4 h-4" />}>Add Skill</Button>}
      />

      {/* Inline form */}
      {isAdding && (
        <div className="mb-6 p-6 bg-charcoal-800/60 border border-accent-cyan/20 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-white">{editTarget ? 'Edit Skill' : 'New Skill'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Skill Name" required>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. React" />
            </FormField>
            <FormField label="Category">
              <Input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="Frontend" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Color" hint="Used as the dot color">
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="h-10 w-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                <Input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} placeholder="#00f3ff" />
              </div>
            </FormField>
            <FormField label="Proficiency (%)">
              <Input type="number" min={0} max={100} value={form.proficiency} onChange={e => setForm(p => ({ ...p, proficiency: Number(e.target.value) }))} />
            </FormField>
            <FormField label="Display Order">
              <Input type="number" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: Number(e.target.value) }))} />
            </FormField>
          </div>
          <Toggle id="skill-visible" checked={form.visible} onChange={val => setForm(p => ({ ...p, visible: val }))} label="Visible in marquee" />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleSave} isLoading={isSaving}>{editTarget ? 'Save Changes' : 'Add Skill'}</Button>
            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <SkeletonTable />
      ) : !items.length ? (
        <EmptyState icon={<Wrench className="w-7 h-7" />} title="No skills yet" actionLabel="Add Skill" onAction={openAdd} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            <SortableContext
              items={items.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map(skill => (
                <SortableItem key={skill.id} id={skill.id}>
                  {({ ref, style, dragHandleProps }) => (
                    <div
                      ref={ref}
                      style={style}
                      className="flex items-center gap-4 p-3 bg-charcoal-800/40 border border-white/5 rounded-xl hover:border-white/10 transition-all duration-150 group"
                    >
                      {/* Drag handle */}
                      <div
                        {...dragHandleProps.attributes}
                        {...dragHandleProps.listeners}
                        className="cursor-grab p-1 hover:bg-white/5 rounded text-gray-700 hover:text-gray-400 transition-colors shrink-0"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: skill.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{skill.name}</p>
                        <p className="text-xs text-gray-600">{skill.category} · {skill.proficiency}%</p>
                      </div>
                      {!skill.visible && <span className="text-xs text-gray-600">Hidden</span>}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-gray-600 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(skill)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
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
        title="Remove Skill"
        message={`Remove "${deleteTarget?.name}" from your skills?`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteSkill.isPending}
      />
    </div>
  );
};

export default SkillsList;
