import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useContactInfo, useUpdateContactInfo } from '../../../hooks/cms/useContactInfo';
import PageHeader from '../ui/PageHeader';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import Input from '../ui/Input';
import { SkeletonForm } from '../ui/Skeleton';
import type { ContactInfo } from '../../../types/cms';

type ContactFormData = Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>;

const ContactEditor: React.FC = () => {
  const { data: contact, isLoading } = useContactInfo();
  const updateContact = useUpdateContactInfo();
  const [form, setForm] = useState<ContactFormData>({
    email: '',
    phone: '',
    location: '',
    section_eyebrow: "What's Next?",
    section_heading: "Let's build something",
    section_heading_highlight: 'extraordinary.',
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        section_eyebrow: contact.section_eyebrow,
        section_heading: contact.section_heading,
        section_heading_highlight: contact.section_heading_highlight,
      });
    }
  }, [contact]);

  const update = (key: keyof ContactFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateContact.mutateAsync(form);
      toast.success('Contact info updated!');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save changes');
    }
  };

  if (isLoading) return <SkeletonForm />;

  return (
    <div>
      <PageHeader
        title="Contact Info"
        description="Manage your contact details and section copy"
        action={
          <Button onClick={handleSave} isLoading={updateContact.isPending} disabled={!isDirty} leftIcon={<Save className="w-4 h-4" />}>
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
        <div className="p-5 bg-charcoal-800/40 border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Contact Details</h3>
          <FormField label="Email Address" required htmlFor="contact-email">
            <Input id="contact-email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
          </FormField>
          <FormField label="Phone Number" htmlFor="contact-phone">
            <Input id="contact-phone" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 234 567 890" />
          </FormField>
          <FormField label="Location" htmlFor="contact-location">
            <Input id="contact-location" value={form.location} onChange={e => update('location', e.target.value)} placeholder="Sri Lanka" />
          </FormField>
        </div>

        <div className="p-5 bg-charcoal-800/40 border border-white/5 rounded-2xl space-y-4">
          <h3 className="text-sm font-semibold text-white">Section Copy</h3>
          <FormField label="Eyebrow Text" htmlFor="contact-eyebrow" hint="Small text above the heading">
            <Input id="contact-eyebrow" value={form.section_eyebrow} onChange={e => update('section_eyebrow', e.target.value)} placeholder="What's Next?" />
          </FormField>
          <FormField label="Main Heading" htmlFor="contact-heading">
            <Input id="contact-heading" value={form.section_heading} onChange={e => update('section_heading', e.target.value)} placeholder="Let's build something" />
          </FormField>
          <FormField label="Highlighted Word/Phrase" htmlFor="contact-highlight" hint="Shown in gradient below the main heading">
            <Input id="contact-highlight" value={form.section_heading_highlight} onChange={e => update('section_heading_highlight', e.target.value)} placeholder="extraordinary." />
          </FormField>
        </div>

        {/* Preview */}
        <div className="p-6 bg-charcoal-900/40 border border-white/5 rounded-2xl text-center">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-4">Section Preview</p>
          <p className="text-accent-purple text-xs font-medium uppercase tracking-widest mb-2">{form.section_eyebrow}</p>
          <h2 className="text-3xl font-bold text-white mb-1">{form.section_heading}</h2>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-500">{form.section_heading_highlight}</h2>
          <p className="text-gray-400 text-lg font-mono mt-4">{form.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactEditor;
