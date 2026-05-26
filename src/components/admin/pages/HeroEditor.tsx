import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useHeroSection, useUpdateHeroSection } from '../../../hooks/cms/useHeroSection';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Toggle from '../ui/Toggle';
import { SkeletonForm } from '../ui/Skeleton';
import type { HeroSection } from '../../../types/cms';

type HeroFormData = Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>;

const HeroEditor: React.FC = () => {
  const { data: hero, isLoading } = useHeroSection();
  const updateHero = useUpdateHeroSection();

  const [form, setForm] = useState<HeroFormData>({
    heading: '',
    heading_highlight: '',
    subheading: '',
    cta_text: '',
    cta_scroll_target: '',
    availability_status: true,
    availability_label: 'OPEN TO WORK',
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        heading: hero.heading,
        heading_highlight: hero.heading_highlight,
        subheading: hero.subheading,
        cta_text: hero.cta_text,
        cta_scroll_target: hero.cta_scroll_target,
        availability_status: hero.availability_status,
        availability_label: hero.availability_label,
      });
    }
  }, [hero]);

  const update = (key: keyof HeroFormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateHero.mutateAsync(form);
      toast.success('Hero section updated!');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save changes');
    }
  };

  if (isLoading) return <SkeletonForm />;

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Edit the main hero banner of your portfolio"
        action={
          <Button
            onClick={handleSave}
            isLoading={updateHero.isPending}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="Name / Heading" htmlFor="hero-heading" required>
            <Input
              id="hero-heading"
              value={form.heading}
              onChange={e => update('heading', e.target.value)}
              placeholder="e.g. A. Zahi"
            />
          </FormField>
          <FormField label="Highlighted Text" htmlFor="hero-highlight" required hint="The colored part of the heading">
            <Input
              id="hero-highlight"
              value={form.heading_highlight}
              onChange={e => update('heading_highlight', e.target.value)}
              placeholder="e.g. Faleel"
            />
          </FormField>
        </div>

        <FormField label="Subheading / Tagline" htmlFor="hero-subheading" required>
          <Textarea
            id="hero-subheading"
            value={form.subheading}
            onChange={e => update('subheading', e.target.value)}
            rows={3}
            placeholder="Building immersive Digital Experiences..."
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField label="CTA Button Text" htmlFor="hero-cta">
            <Input
              id="hero-cta"
              value={form.cta_text}
              onChange={e => update('cta_text', e.target.value)}
              placeholder="e.g. Explore Work"
            />
          </FormField>
          <FormField label="CTA Scroll Target" htmlFor="hero-cta-target" hint="Section ID to scroll to (no #)">
            <Input
              id="hero-cta-target"
              value={form.cta_scroll_target}
              onChange={e => update('cta_scroll_target', e.target.value)}
              placeholder="e.g. projects"
            />
          </FormField>
        </div>

        <div className="p-5 bg-charcoal-800/40 border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Availability Badge</h3>
          <Toggle
            id="hero-availability"
            checked={form.availability_status}
            onChange={val => update('availability_status', val)}
            label="Show availability badge"
          />
          {form.availability_status && (
            <FormField label="Badge Label" htmlFor="hero-availability-label">
              <Input
                id="hero-availability-label"
                value={form.availability_label}
                onChange={e => update('availability_label', e.target.value)}
                placeholder="OPEN TO WORK"
              />
            </FormField>
          )}
        </div>

        {/* Live preview */}
        <div className="p-6 bg-charcoal-900/40 border border-white/5 rounded-2xl">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">Preview</p>
          <h1 className="text-4xl font-bold text-white font-['Space_Grotesk']">
            {form.heading} <span className="text-accent-cyan">{form.heading_highlight}</span>
          </h1>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">{form.subheading}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">{form.cta_text}</span>
            {form.availability_status && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 text-green-400 text-xs font-semibold border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {form.availability_label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;
