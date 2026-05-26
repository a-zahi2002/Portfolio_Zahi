import React, { useState } from 'react';
import { Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAllSeoPages, useUpsertSeoPage } from '../../../hooks/cms/useSeoPage';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { SkeletonTable } from '../ui/Skeleton';
import type { SeoPage } from '../../../types/cms';

const SeoManager: React.FC = () => {
  const { data: pages, isLoading } = useAllSeoPages();
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

  const selectPage = (page: SeoPage) => {
    setSelected(page);
    setForm({
      route: page.route,
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      og_image: page.og_image,
      og_title: page.og_title,
      og_description: page.og_description,
    });
    setIsDirty(false);
  };

  const newPage = () => {
    setSelected({});
    setForm({ route: '/', title: '', description: '', keywords: '', og_image: '', og_title: '', og_description: '' });
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
                      : 'bg-charcoal-800/40 border border-white/5 text-gray-400 hover:text-white hover:border-white/10'
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

          <div className="p-5 bg-charcoal-800/40 border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Open Graph</h3>
            <FormField label="OG Title">
              <Input value={form.og_title} onChange={e => update('og_title', e.target.value)} placeholder="Overrides page title for social sharing" />
            </FormField>
            <FormField label="OG Description">
              <Textarea value={form.og_description} onChange={e => update('og_description', e.target.value)} rows={2} placeholder="Social media description…" />
            </FormField>
            <FormField label="OG Image URL">
              <Input type="url" value={form.og_image} onChange={e => update('og_image', e.target.value)} placeholder="https://..." />
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
