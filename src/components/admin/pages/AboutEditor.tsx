import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
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
import type { AboutSection } from '../../../types/cms';

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

        <p className="text-xs text-gray-600 mt-2">
          💡 Highlight cards are configured as JSON. Advanced editing coming soon.
        </p>
      </div>
    </div>
  );
};

export default AboutEditor;
