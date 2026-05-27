import React, { useState, useEffect } from 'react';
import { Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAllSeoPages, useUpsertSeoPage } from '../../../hooks/cms/useSeoPage';
import { useSiteSettings } from '../../../hooks/cms/useSiteSettings';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { SkeletonTable } from '../ui/Skeleton';
import type { SeoPage } from '../../../types/cms';

const SeoManager: React.FC = () => {
  const { data: pages, isLoading } = useAllSeoPages();
  const { data: settings } = useSiteSettings();
  const upsertPage = useUpsertSeoPage();

  const [selected, setSelected] = useState<Partial<SeoPage>>({});
  const [form, setForm] = useState({
    route: '/',
    title: '',
    description: '',
    keywords: '',
    og_image: '',
    og_title: '',
    og_description: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  // Sync og_image form state with site settings default OG image whenever settings or selected page changes
  useEffect(() => {
    if (settings?.og_image !== undefined) {
      setForm(prev => {
        if (prev.og_image !== settings.og_image) {
          return { ...prev, og_image: settings.og_image || '' };
        }
        return prev;
      });
    }
  }, [settings?.og_image, selected.id]);

  const selectPage = (page: SeoPage) => {
    setSelected(page);
    setForm({
      route: page.route,
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      og_image: settings?.og_image || page.og_image || '',
      og_title: page.og_title,
      og_description: page.og_description,
    });
    setIsDirty(false);
  };

  const newPage = () => {
    setSelected({});
    setForm({
      route: '/',
      title: '',
      description: '',
      keywords: '',
      og_image: settings?.og_image || '',
      og_title: '',
      og_description: '',
    });
    setIsDirty(false);
  };

  const update = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!form.route.trim() || !form.title.trim()) {
      toast.error('Route and Title are required');
      return;
    }
    try {
      await upsertPage.mutateAsync(form);
      toast.success('SEO page saved!');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save SEO page');
    }
  };

  return (
    <div>
      <PageHeader
        title="SEO Manager"
        description="Manage meta tags and Open Graph data per page"
        action={<Button onClick={newPage} leftIcon={<Plus className="w-4 h-4" />}>New Page</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page list */}
        <div className="lg:col-span-1">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Pages</p>
          {isLoading ? (
            <SkeletonTable rows={3} />
          ) : (
            <div className="space-y-1.5">
              {(pages ?? []).map(page => (
                <button
                  key={page.id}
                  onClick={() => selectPage(page)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    selected.id === page.id
                      ? 'bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan'
                      : 'bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:text-white hover:border-gray-300 dark:border-white/10'
                  }`}
                >
                  <p className="font-medium">{page.route}</p>
                  <p className="text-xs opacity-70 truncate">{page.title}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {isDirty && (
            <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">
              ⚠ Unsaved changes
            </div>
          )}

          <FormField label="Route" required hint="e.g. / for homepage, /projects for projects page">
            <Input value={form.route} onChange={e => update('route', e.target.value)} placeholder="/" />
          </FormField>
          <FormField label="Page Title" required>
            <Input value={form.title} onChange={e => update('title', e.target.value)} placeholder="My Portfolio – Home" />
          </FormField>
          <FormField label="Meta Description">
            <Textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} placeholder="A brief description of this page…" />
          </FormField>
          <FormField label="Keywords" hint="Comma-separated">
            <Input value={form.keywords} onChange={e => update('keywords', e.target.value)} placeholder="web developer, react, portfolio" />
          </FormField>

          <div className="p-5 bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-charcoal-900 dark:text-white">Open Graph</h3>
            <FormField label="OG Title">
              <Input value={form.og_title} onChange={e => update('og_title', e.target.value)} placeholder="Overrides page title for social sharing" />
            </FormField>
            <FormField label="OG Description">
              <Textarea value={form.og_description} onChange={e => update('og_description', e.target.value)} rows={2} placeholder="Social media description…" />
            </FormField>
            <FormField label="OG Image (Synced from Site Settings)" hint="Manage this image in Site Settings">
              <div className="space-y-3">
                <Input
                  type="url"
                  value={form.og_image}
                  readOnly
                  className="bg-gray-50 dark:bg-charcoal-800/20 cursor-not-allowed opacity-80"
                  placeholder="No OG Image set in Site Settings"
                />
                {form.og_image ? (
                  <div className="relative w-full max-w-md h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 group">
                    <img src={form.og_image} alt="OG Image Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href="/.admin/dashboard/settings"
                        className="text-xs text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-lg transition-all font-medium"
                      >
                        Manage Image in Settings
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-gray-200 dark:border-white/5 rounded-xl text-center text-xs text-gray-400">
                    No default OG image set. Go to{' '}
                    <a href="/.admin/dashboard/settings" className="text-blue-500 hover:underline">
                      Site Settings
                    </a>{' '}
                    to upload one.
                  </div>
                )}
              </div>
            </FormField>
          </div>

          <Button onClick={handleSave} isLoading={upsertPage.isPending} leftIcon={<Save className="w-4 h-4" />}>
            Save SEO Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeoManager;
