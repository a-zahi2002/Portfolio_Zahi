import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useExperience,
  useCreateExperience,
  useUpdateExperience,
  useAllExperiences,
} from '../../../hooks/cms/useExperiences';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import MarkdownEditor from '../ui/MarkdownEditor';
import { SkeletonForm } from '../ui/Skeleton';
import type { ExperienceFormData } from '../../../types/cms';

const defaultForm: ExperienceFormData = {
  company: '',
  role: '',
  start_date: '',
  end_date: 'Present',
  description: '',
  technologies: [],
  visible: true,
  order_index: 0,
};

const ExperienceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!(id && id !== 'new');
  const navigate = useNavigate();
  const queryClient = useAllExperiences(); // to get list length for default order index
  
  const { data: exp, isLoading } = useExperience(id ?? '');
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  const [form, setForm] = useState<ExperienceFormData>(defaultForm);
  const [techInput, setTechInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isEdit && exp) {
      setForm({
        company: exp.company,
        role: exp.role,
        start_date: exp.start_date,
        end_date: exp.end_date ?? 'Present',
        description: exp.description ?? '',
        technologies: exp.technologies ?? [],
        visible: exp.visible,
        order_index: exp.order_index,
      });
      setTechInput((exp.technologies ?? []).join(', '));
    } else if (!isEdit) {
      setForm(prev => ({
        ...prev,
        order_index: queryClient.data?.length ?? 0,
      }));
    }
  }, [exp, isEdit, queryClient.data]);

  const update = (key: keyof ExperienceFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleTechChange = (val: string) => {
    setTechInput(val);
    const tags = val
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    update('technologies', tags);
  };

  const handleSave = async () => {
    if (!form.company.trim()) return toast.error('Company is required');
    if (!form.role.trim()) return toast.error('Role is required');
    if (!form.start_date.trim()) return toast.error('Start Date is required');

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, updates: form });
        toast.success('Experience updated');
      } else {
        await createMutation.mutateAsync(form);
        toast.success('Experience added');
      }
      setIsDirty(false);
      navigate('/.admin/dashboard/experiences');
    } catch {
      toast.error('Failed to save experience');
    }
  };

  if (isEdit && isLoading) return <SkeletonForm />;

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/.admin/dashboard/experiences')}
          className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={isEdit ? 'Edit Experience' : 'New Experience'}
          description={isEdit ? `Edit details for ${form.company}` : 'Add a new stop in your career journey'}
        />
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField label="Role / Title" required>
            <Input
              value={form.role}
              onChange={e => update('role', e.target.value)}
              placeholder="e.g. Frontend Engineer"
            />
          </FormField>
          <FormField label="Company" required>
            <Input
              value={form.company}
              onChange={e => update('company', e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Start Date" required hint="e.g. June 2023, Jan 2021">
            <Input
              value={form.start_date}
              onChange={e => update('start_date', e.target.value)}
              placeholder="e.g. Jun 2023"
            />
          </FormField>
          <FormField label="End Date" hint="e.g. Present, Dec 2024">
            <Input
              value={form.end_date}
              onChange={e => update('end_date', e.target.value)}
              placeholder="Present"
            />
          </FormField>
        </div>

        <FormField label="Technologies / Skills Used" hint="Comma-separated list (e.g. React, Next.js, Node.js)">
          <Input
            value={techInput}
            onChange={e => handleTechChange(e.target.value)}
            placeholder="React, TypeScript, Tailwind"
          />
        </FormField>

        <FormField label="Description (Markdown supported)" required>
          <MarkdownEditor
            value={form.description}
            onChange={val => update('description', val)}
            rows={6}
            placeholder="Describe your responsibilities, achievements, and impact..."
          />
        </FormField>

        <Toggle
          id="exp-visible"
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
            {isEdit ? 'Save Changes' : 'Create Experience'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/.admin/dashboard/experiences')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEditor;
