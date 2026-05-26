import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useEducationItem,
  useCreateEducation,
  useUpdateEducation,
  useAllEducation,
} from '../../../hooks/cms/useEducation';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import MarkdownEditor from '../ui/MarkdownEditor';
import { SkeletonForm } from '../ui/Skeleton';
import type { EducationFormData } from '../../../types/cms';

const defaultForm: EducationFormData = {
  institution: '',
  degree: '',
  start_date: '',
  end_date: 'Present',
  description: '',
  visible: true,
  order_index: 0,
};

const EducationEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();
  const queryClient = useAllEducation(); // to get list length for default order index

  const { data: edu, isLoading } = useEducationItem(id ?? '');
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();

  const [form, setForm] = useState<EducationFormData>(defaultForm);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isEdit && edu) {
      setForm({
        institution: edu.institution,
        degree: edu.degree,
        start_date: edu.start_date,
        end_date: edu.end_date ?? 'Present',
        description: edu.description ?? '',
        visible: edu.visible,
        order_index: edu.order_index,
      });
    } else if (!isEdit) {
      setForm(prev => ({
        ...prev,
        order_index: queryClient.data?.length ?? 0,
      }));
    }
  }, [edu, isEdit, queryClient.data]);

  const update = (key: keyof EducationFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!form.institution.trim()) return toast.error('Institution is required');
    if (!form.degree.trim()) return toast.error('Degree is required');
    if (!form.start_date.trim()) return toast.error('Start Date is required');

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, updates: form });
        toast.success('Education updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Education added');
      }
      setIsDirty(false);
      navigate('/.admin/dashboard/education');
    } catch {
      toast.error('Failed to save education item');
    }
  };

  if (isEdit && isLoading) return <SkeletonForm />;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/.admin/dashboard/education')}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={isEdit ? 'Edit Education Item' : 'New Education Item'}
          description={isEdit ? `Edit details for ${form.degree}` : 'Add a new academic milestone'}
        />
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField label="Degree / Course" required>
            <Input
              value={form.degree}
              onChange={e => update('degree', e.target.value)}
              placeholder="e.g. B.Sc. in Computer Science"
            />
          </FormField>
          <FormField label="Institution" required>
            <Input
              value={form.institution}
              onChange={e => update('institution', e.target.value)}
              placeholder="e.g. University of Moratuwa"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Start Date" required hint="e.g. Oct 2021, Sept 2018">
            <Input
              value={form.start_date}
              onChange={e => update('start_date', e.target.value)}
              placeholder="e.g. Oct 2021"
            />
          </FormField>
          <FormField label="End Date" hint="e.g. Present, Nov 2025">
            <Input
              value={form.end_date}
              onChange={e => update('end_date', e.target.value)}
              placeholder="Present"
            />
          </FormField>
        </div>

        <FormField label="Description (Markdown supported)">
          <MarkdownEditor
            value={form.description}
            onChange={val => update('description', val)}
            rows={5}
            placeholder="Describe courses, achievements, thesis details, and key activities..."
          />
        </FormField>

        <Toggle
          id="edu-visible"
          checked={form.visible}
          onChange={val => update('visible', val)}
          label="Visible on portfolio page"
        />

        <div className="flex items-center gap-3 pt-4">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!isDirty && isEdit}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEdit ? 'Save Changes' : 'Create Education Item'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/.admin/dashboard/education')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EducationEditor;
