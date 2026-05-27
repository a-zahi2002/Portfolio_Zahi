import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Code, Zap, Layout, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAboutSection, useUpdateAboutSection } from '../../../hooks/cms/useAboutSection';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import ImageUploader from '../ui/ImageUploader';
import MarkdownEditor from '../ui/MarkdownEditor';
import { SkeletonForm } from '../ui/Skeleton';
import type { AboutSection, HighlightCard } from '../../../types/cms';

type AboutFormData = Omit<AboutSection, 'id' | 'created_at' | 'updated_at'>;

const AboutEditor: React.FC = () => {
  const { data: about, isLoading } = useAboutSection();
  const updateAbout = useUpdateAboutSection();
  const [form, setForm] = useState<AboutFormData>({
    title: 'About',
    title_highlight: 'Me',
    bio_primary: '',
    bio_secondary: '',
    profile_image_url: '',
    availability_status: true,
    availability_label: 'OPEN TO WORK',
    highlights: [],
    stats: [],
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (about) {
      setForm({
        title: about.title,
        title_highlight: about.title_highlight,
        bio_primary: about.bio_primary,
        bio_secondary: about.bio_secondary,
        profile_image_url: about.profile_image_url,
        availability_status: about.availability_status,
        availability_label: about.availability_label,
        highlights: about.highlights ?? [],
        stats: about.stats ?? [],
      });
    }
  }, [about]);

  const update = (key: keyof AboutFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleAddHighlight = () => {
    const newHighlight: HighlightCard = { icon: 'Code', title: '', subtitle: '' };
    update('highlights', [...form.highlights, newHighlight]);
  };

  const handleRemoveHighlight = (index: number) => {
    const updated = form.highlights.filter((_, i) => i !== index);
    update('highlights', updated);
  };

  const handleUpdateHighlight = (index: number, key: keyof HighlightCard, value: string) => {
    const updated = form.highlights.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    update('highlights', updated);
  };

  const handleMoveHighlight = (index: number, direction: 'up' | 'down') => {
    const newHighlights = [...form.highlights];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newHighlights.length) {
      const temp = newHighlights[index];
      newHighlights[index] = newHighlights[targetIndex];
      newHighlights[targetIndex] = temp;
      update('highlights', newHighlights);
    }
  };

  const handleSave = async () => {
    try {
      await updateAbout.mutateAsync(form);
      toast.success('About section updated!');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save changes');
    }
  };

  if (isLoading) return <SkeletonForm />;

  return (
    <div>
      <PageHeader
        title="About Section"
        description="Edit your bio, profile image, and highlights using Markdown"
        action={
          <Button
            onClick={handleSave}
            isLoading={updateAbout.isPending}
            disabled={!isDirty}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        }
      />

      {isDirty && (
        <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
          ⚠ You have unsaved changes
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Profile image */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl">
          <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white mb-4">Profile Image</h3>
          <ImageUploader
            bucket="profile-images"
            currentUrl={form.profile_image_url}
            onUpload={url => update('profile_image_url', url)}
            onRemove={() => update('profile_image_url', '')}
            label="Upload profile photo"
            previewClassName="h-56 w-56 rounded-xl"
          />
        </div>

        {/* Section title */}
        <div className="grid grid-cols-2 gap-6">
          <FormField label="Section Title" htmlFor="about-title">
            <Input id="about-title" value={form.title} onChange={e => update('title', e.target.value)} placeholder="About" />
          </FormField>
          <FormField label="Highlighted Word" htmlFor="about-highlight">
            <Input id="about-highlight" value={form.title_highlight} onChange={e => update('title_highlight', e.target.value)} placeholder="Me" />
          </FormField>
        </div>

        {/* Bio */}
        <FormField label="Primary Bio (Markdown supported)" htmlFor="about-bio-primary" required>
          <MarkdownEditor
            id="about-bio-primary"
            value={form.bio_primary}
            onChange={val => update('bio_primary', val)}
            rows={5}
            placeholder="I am a passionate **Creative Developer**..."
          />
        </FormField>

        <FormField label="Secondary Bio (Markdown supported)" htmlFor="about-bio-secondary">
          <MarkdownEditor
            id="about-bio-secondary"
            value={form.bio_secondary}
            onChange={val => update('bio_secondary', val)}
            rows={4}
            placeholder="With a strong foundation in..."
          />
        </FormField>

        {/* Availability */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white">Availability Badge</h3>
          <Toggle
            id="about-availability"
            checked={form.availability_status}
            onChange={val => update('availability_status', val)}
            label="Show availability badge"
          />
          {form.availability_status && (
            <FormField label="Badge Label" htmlFor="about-availability-label">
              <Input
                id="about-availability-label"
                value={form.availability_label}
                onChange={e => update('availability_label', e.target.value)}
                placeholder="OPEN TO WORK"
              />
            </FormField>
          )}
        </div>

        {/* Highlights Section */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white">Highlight Cards</h3>
              <p className="text-xs text-gray-500 mt-0.5">Customize the highlight cards shown below your bio.</p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddHighlight}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Card
            </Button>
          </div>

          {form.highlights.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">No highlight cards configured.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.highlights.map((highlight, index) => {
                const IconComponent =
                  highlight.icon === 'Zap'
                    ? Zap
                    : highlight.icon === 'Layout'
                    ? Layout
                    : highlight.icon === 'Smartphone'
                    ? Smartphone
                    : Code;

                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl items-start md:items-center relative group"
                  >
                    {/* Icon representation & Selector */}
                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                      <div className="p-2.5 bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-white/10 rounded-xl text-blue-600 dark:text-accent-cyan">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="w-full md:w-36">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          Icon
                        </label>
                        <select
                          value={highlight.icon}
                          onChange={e => handleUpdateHighlight(index, 'icon', e.target.value)}
                          className="w-full px-2 py-1 bg-white dark:bg-charcoal-900 border border-gray-200 dark:border-white/10 rounded-lg text-charcoal-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:border-blue-500 dark:focus:border-accent-cyan/50 focus:ring-blue-500/20 dark:focus:ring-accent-cyan/20 cursor-pointer"
                        >
                          <option value="Code">Code</option>
                          <option value="Zap">Zap</option>
                          <option value="Layout">Layout</option>
                          <option value="Smartphone">Smartphone</option>
                        </select>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          Title
                        </label>
                        <Input
                          value={highlight.title}
                          onChange={e => handleUpdateHighlight(index, 'title', e.target.value)}
                          placeholder="e.g. Clean Code"
                          className="py-1 px-3 text-xs rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          Subtitle
                        </label>
                        <Input
                          value={highlight.subtitle}
                          onChange={e => handleUpdateHighlight(index, 'subtitle', e.target.value)}
                          placeholder="e.g. Scalable & Maintainable"
                          className="py-1 px-3 text-xs rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 self-end md:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveHighlight(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-accent-cyan dark:text-gray-400 hover:bg-accent-cyan/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveHighlight(index, 'down')}
                        disabled={index === form.highlights.length - 1}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-accent-cyan dark:text-gray-400 hover:bg-accent-cyan/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(index)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 dark:text-gray-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutEditor;
