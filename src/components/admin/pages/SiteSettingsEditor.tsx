import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSiteSettings, useUpdateSiteSettings } from '../../../hooks/cms/useSiteSettings';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Toggle from '../ui/Toggle';
import ImageUploader from '../ui/ImageUploader';
import FileUploader from '../ui/FileUploader';
import { SkeletonForm } from '../ui/Skeleton';
import type { SiteSettings } from '../../../types/cms';

type SettingsForm = Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>;

const SiteSettingsEditor: React.FC = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [form, setForm] = useState<SettingsForm>({
    site_title: '',
    tagline: '',
    seo_description: '',
    og_image: '',
    resume_url: '',
    favicon_url: '',
    maintenance_mode: false,
    copyright_text: '',
    brand_name: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const update = (key: keyof SettingsForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast.success('Site settings saved!');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) return <SkeletonForm />;

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Global settings for your portfolio"
        action={
          <Button onClick={handleSave} isLoading={updateSettings.isPending} disabled={!isDirty} leftIcon={<Save className="w-4 h-4" />}>
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
        {/* Branding */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white">Branding</h3>
          <FormField label="Site Title" htmlFor="set-title" required>
            <Input id="set-title" value={form.site_title} onChange={e => update('site_title', e.target.value)} placeholder="My Portfolio" />
          </FormField>
          <FormField label="Tagline" htmlFor="set-tagline">
            <Input id="set-tagline" value={form.tagline} onChange={e => update('tagline', e.target.value)} placeholder="Web Developer" />
          </FormField>
          <FormField label="Brand Name (Navbar)" htmlFor="set-brand" hint="Short name shown in the navigation bar">
            <Input id="set-brand" value={form.brand_name} onChange={e => update('brand_name', e.target.value)} placeholder="A.ZAHI" />
          </FormField>
          <FormField label="Copyright Text" htmlFor="set-copyright">
            <Input id="set-copyright" value={form.copyright_text} onChange={e => update('copyright_text', e.target.value)} placeholder="© 2025 A. Zahi Faleel" />
          </FormField>
        </div>

        {/* SEO */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white">Default SEO</h3>
          <FormField label="Meta Description" htmlFor="set-seo-desc">
            <Textarea id="set-seo-desc" value={form.seo_description} onChange={e => update('seo_description', e.target.value)} rows={3} placeholder="Describe your portfolio…" />
          </FormField>
          <FormField label="OG Image" hint="Default Open Graph image for social sharing">
            <ImageUploader
              bucket="seo-assets"
              currentUrl={form.og_image}
              onUpload={url => update('og_image', url)}
              onRemove={() => update('og_image', '')}
              previewClassName="h-36"
            />
          </FormField>
        </div>

        {/* Links */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white">Links</h3>
          <FormField label="Resume" hint="Upload a PDF resume. It will be available for download on the frontend.">
            <FileUploader
              bucket="resumes"
              currentUrl={form.resume_url}
              onUpload={url => update('resume_url', url)}
              onRemove={() => update('resume_url', '')}
              label="Upload Resume (PDF)"
              previewClassName="h-36"
            />
          </FormField>
          <FormField label="Favicon URL" htmlFor="set-favicon" hint="Leave empty to use default">
            <Input id="set-favicon" value={form.favicon_url} onChange={e => update('favicon_url', e.target.value)} placeholder="/favicon.ico" />
          </FormField>
        </div>

        {/* Maintenance */}
        <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl">
          <Toggle
            id="set-maintenance"
            checked={form.maintenance_mode}
            onChange={val => update('maintenance_mode', val)}
            label="Enable maintenance mode"
          />
          {form.maintenance_mode && (
            <p className="text-xs text-yellow-400 mt-2">⚠ The portfolio will show a maintenance page to visitors</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsEditor;
