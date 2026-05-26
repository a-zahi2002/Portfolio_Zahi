import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Link2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAllSocialLinks, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink } from '../../../hooks/cms/useSocialLinks';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import { SkeletonTable } from '../ui/Skeleton';
import type { SocialLink, SocialLinkFormData } from '../../../types/cms';

const defaultForm: SocialLinkFormData = {
  platform: '',
  url: '',
  icon: '',
  visible: true,
  order_index: 0,
};

const PLATFORM_ICONS: Record<string, string> = {
  github: 'Github',
  linkedin: 'Linkedin',
  twitter: 'Twitter',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'Youtube',
  dribbble: 'Dribbble',
  behance: 'Figma',
};

const SocialLinksList: React.FC = () => {
  const { data: links, isLoading } = useAllSocialLinks();
  const createLink = useCreateSocialLink();
  const updateLink = useUpdateSocialLink();
  const deleteLink = useDeleteSocialLink();

  const [isAdding, setIsAdding] = useState(false);
  const [editTarget, setEditTarget] = useState<SocialLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [form, setForm] = useState<SocialLinkFormData>(defaultForm);

  const openAdd = () => {
    setForm({ ...defaultForm, order_index: links?.length ?? 0 });
    setEditTarget(null);
    setIsAdding(true);
  };

  const openEdit = (link: SocialLink) => {
    setForm({ platform: link.platform, url: link.url, icon: link.icon, visible: link.visible, order_index: link.order_index });
    setEditTarget(link);
    setIsAdding(true);
  };

  const handlePlatformChange = (platform: string) => {
    const icon = PLATFORM_ICONS[platform.toLowerCase()] || platform;
    setForm(p => ({ ...p, platform, icon }));
  };

  const handleSave = async () => {
    if (!form.platform.trim() || !form.url.trim()) return toast.error('Platform and URL are required');
    try {
      if (editTarget) {
        await updateLink.mutateAsync({ id: editTarget.id, updates: form });
        toast.success('Social link updated!');
      } else {
        await createLink.mutateAsync(form);
        toast.success('Social link added!');
      }
      setIsAdding(false);
      setEditTarget(null);
    } catch {
      toast.error('Failed to save');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLink.mutateAsync(deleteTarget.id);
      toast.success('Social link removed');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (link: SocialLink) => {
    try {
      await updateLink.mutateAsync({ id: link.id, updates: { visible: !link.visible } });
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div>
      <PageHeader
        title="Social Links"
        description="Manage social media links shown in the contact section"
        action={<Button onClick={openAdd} leftIcon={<Plus className="w-4 h-4" />}>Add Link</Button>}
      />

      {isAdding && (
        <div className="mb-6 p-6 bg-charcoal-800/60 border border-accent-cyan/20 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-white">{editTarget ? 'Edit Link' : 'New Social Link'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Platform" required>
              <Input value={form.platform} onChange={e => handlePlatformChange(e.target.value)} placeholder="GitHub, LinkedIn…" />
            </FormField>
            <FormField label="Icon Name" hint="Lucide icon name">
              <Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="Github" />
            </FormField>
          </div>
          <FormField label="URL" required>
            <Input type="url" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
          </FormField>
          <Toggle id="social-visible" checked={form.visible} onChange={val => setForm(p => ({ ...p, visible: val }))} label="Visible" />
          <div className="flex gap-2">
            <Button onClick={handleSave} isLoading={createLink.isPending || updateLink.isPending}>{editTarget ? 'Save' : 'Add'}</Button>
            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <SkeletonTable rows={3} />
      ) : !links?.length ? (
        <EmptyState icon={<Link2 className="w-7 h-7" />} title="No social links yet" actionLabel="Add Link" onAction={openAdd} />
      ) : (
        <div className="space-y-2">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-4 p-4 bg-charcoal-800/40 border border-white/5 rounded-xl hover:border-white/10 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{link.platform}</p>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-accent-cyan truncate block transition-colors">{link.url}</a>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleToggle(link)} className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-colors">
                  {link.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(link)} className="p-2 rounded-lg text-gray-600 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setDeleteTarget(link)} className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Social Link"
        message={`Remove "${deleteTarget?.platform}" link?`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteLink.isPending}
      />
    </div>
  );
};

export default SocialLinksList;
