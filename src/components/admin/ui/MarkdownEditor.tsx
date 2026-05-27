import React, { useState, useRef } from 'react';
import { Bold, Italic, Link, List, ListOrdered, Code, Heading, Eye, Edit2 } from 'lucide-react';
import { parseMarkdown } from '../../../utils/markdown';
import Textarea from './Textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  error?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write markdown here...',
  rows = 8,
  id,
  error,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;
    let length = 0;

    switch (syntax) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        cursorOffset = 2;
        length = (selectedText || 'bold text').length;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        cursorOffset = 1;
        length = (selectedText || 'italic text').length;
        break;
      case 'heading':
        replacement = `\n### ${selectedText || 'Heading'}\n`;
        cursorOffset = 5;
        length = (selectedText || 'Heading').length;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        cursorOffset = 1;
        length = (selectedText || 'link text').length;
        break;
      case 'list-bullet':
        replacement = `\n- ${selectedText || 'List item'}`;
        cursorOffset = 3;
        length = (selectedText || 'List item').length;
        break;
      case 'list-number':
        replacement = `\n1. ${selectedText || 'List item'}`;
        cursorOffset = 4;
        length = (selectedText || 'List item').length;
        break;
      case 'code':
        replacement = `\n\`\`\`\n${selectedText || 'code block'}\n\`\`\`\n`;
        cursorOffset = 5;
        length = (selectedText || 'code block').length;
        break;
      default:
        return;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + length);
    }, 0);
  };

  const previewHtml = activeTab === 'preview' ? parseMarkdown(value) : '';

  return (
    <div className="border border-gray-300 dark:border-white/10 rounded-xl overflow-hidden bg-gray-50 dark:bg-charcoal-900/60">
      {/* Editor Header / Tab bar */}
      <div className="flex items-center justify-between border-b border-gray-300 dark:border-white/10 px-4 py-2 bg-white dark:bg-charcoal-900/40">
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'write'
                ? 'bg-accent-cyan/15 text-accent-cyan'
                : 'text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:text-white'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-accent-cyan/15 text-accent-cyan'
                : 'text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {/* Formatting Toolbar */}
        {activeTab === 'write' && (
          <div className="flex items-center gap-0.5 sm:gap-1 text-gray-500 dark:text-gray-400">
            <button
              type="button"
              onClick={() => insertMarkdown('bold')}
              title="Bold"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('italic')}
              title="Italic"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('heading')}
              title="Heading"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => insertMarkdown('link')}
              title="Link"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('list-bullet')}
              title="Bullet List"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('list-number')}
              title="Numbered List"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('code')}
              title="Code Block"
              className="p-1.5 rounded hover:bg-gray-100 dark:bg-white/5 hover:text-charcoal-900 dark:text-white transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="p-1">
        {activeTab === 'write' ? (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            error={error}
            ref={textareaRef}
            className="border-none focus:ring-0 focus:border-none bg-transparent"
          />
        ) : (
          <div
            className="px-4 py-3 min-h-[164px] bg-transparent text-gray-300 text-sm overflow-auto max-h-[400px]
              prose prose-invert prose-sm max-w-none
              prose-headings:text-charcoal-900 dark:text-white prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
              prose-p:mb-4 prose-p:leading-relaxed
              prose-a:text-accent-cyan prose-a:underline hover:prose-a:text-cyan-400
              prose-strong:text-charcoal-900 dark:text-white prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4
              prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4
              prose-code:text-accent-cyan prose-code:bg-gray-100 dark:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-charcoal-950 prose-pre:border prose-pre:border-gray-200 dark:border-white/5 prose-pre:p-4 prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="text-gray-600 italic">Nothing to preview</p>' }}
          />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
