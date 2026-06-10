import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProject, useCreateProject, useUpdateProject } from '../../../hooks/cms/useProjects';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Toggle from '../ui/Toggle';
import ImageUploader from '../ui/ImageUploader';
import { SkeletonForm } from '../ui/Skeleton';
import type { ProjectFormData } from '../../../types/cms';

const defaultForm: ProjectFormData = {
  title: '',
  slug: '',
  description: '',
  technologies: [],
  category: 'Web',
  github_url: '',
  live_url: '',
  thumbnail_url: '',
  gallery_images: [],
  featured: false,
  visible: true,
  order_index: 0,
};

const ProjectEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: existing, isLoading } = useProject(id ?? '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [form, setForm] = useState<ProjectFormData>(defaultForm);
  const [techInput, setTechInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        description: existing.description,
        technologies: existing.technologies,
        category: existing.category,
        github_url: existing.github_url,
        live_url: existing.live_url,
        thumbnail_url: existing.thumbnail_url,
        gallery_images: existing.gallery_images,
        featured: existing.featured,
        visible: existing.visible,
        order_index: existing.order_index,
      });
    }
  }, [existing]);

  const update = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));

    // Auto-generate slug from title
    if (key === 'title') {
      const slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setForm(prev => ({ ...prev, title: value as string, slug }));
    }
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      update('technologies', [...form.technologies, t]);
    }
    setTechInput('');
  };

  const removeTech = (tech: string) => {
    update('technologies', form.technologies.filter(t => t !== tech));
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isEditing && id) {
        await updateProject.mutateAsync({ id, updates: form });
        toast.success('Project updated!');
      } else {
        await createProject.mutateAsync(form);
        toast.success('Project created!');
        navigate('/.admin/dashboard/projects');
      }
    } catch (err: unknown) {
      toast.error(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (isLoading && isEditing) return <SkeletonForm />;

  const isSaving = createProject.isPending || updateProject.isPending;

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Project' : 'New Project'}
        description={isEditing ? `Editing "${form.title}"` : 'Add a new project to your portfolio'}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/.admin/dashboard/projects')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        }
      />

      <div className="max-w-2xl space-y-6">
        {/* Thumbnail */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl">
          <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white mb-4">Thumbnail Image</h3>
          <ImageUploader
            bucket="project-images"
            currentUrl={form.thumbnail_url}
            onUpload={url => update('thumbnail_url', url)}
            onRemove={() => update('thumbnail_url', '')}
            previewClassName="h-48"
          />
        </div>

        {/* Basic info */}
        <FormField label="Project Title" htmlFor="proj-title" required error={errors.title}>
          <Input id="proj-title" value={form.title} onChange={e => update('title', e.target.value)} placeholder="My Project" error={errors.title} />
        </FormField>

        <FormField label="Slug" htmlFor="proj-slug" hint="Auto-generated from title. Used in URLs." error={errors.slug}>
          <Input id="proj-slug" value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="my-project" error={errors.slug} />
        </FormField>

        <FormField label="Description" htmlFor="proj-desc" required error={errors.description}>
          <Textarea id="proj-desc" value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder="A short description of the project..." error={errors.description} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" htmlFor="proj-cat">
            <Input id="proj-cat" value={form.category} onChange={e => update('category', e.target.value)} placeholder="Web / Desktop / Mobile" />
          </FormField>
          <FormField label="Display Order" htmlFor="proj-order">
            <Input id="proj-order" type="number" value={form.order_index} onChange={e => update('order_index', Number(e.target.value))} placeholder="0" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="GitHub URL" htmlFor="proj-github">
            <Input id="proj-github" type="url" value={form.github_url} onChange={e => update('github_url', e.target.value)} placeholder="https://github.com/..." />
          </FormField>
          <FormField label="Live URL" htmlFor="proj-live">
            <Input id="proj-live" type="url" value={form.live_url} onChange={e => update('live_url', e.target.value)} placeholder="https://..." />
          </FormField>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Technologies</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
              placeholder="Add a technology and press Enter"
              className="flex-1"
            />
            <Button variant="secondary" onClick={addTech} leftIcon={<Plus className="w-4 h-4" />}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.technologies.map(tech => (
              <span key={tech} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-medium">
                {tech}
                <button onClick={() => removeTech(tech)} className="hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
          <Toggle id="proj-visible" checked={form.visible} onChange={val => update('visible', val)} label="Visible on portfolio" />
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
