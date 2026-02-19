"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getQRCodes, deleteQRCode, updateGroupName, updateQRCode, QRCodeEntry } from '@/app/lib/db';
import FullscreenQRView from '@/app/components/FullscreenQRView';
import QRDetailCard from '@/app/components/QRDetailCard';
import { useLanguage } from '@/app/lib/i18n';
import { ContentType } from '@/app/types';

// --- TYPES ---
type LibraryItemType = 'group' | 'single';

interface LibraryItem {
  type: LibraryItemType;
  id: string;
  name: string;
  createdAt: number;
  entries: QRCodeEntry[];
}

// --- MAIN LIBRARY VIEW ---
interface LibraryViewProps {
  onEdit?: (entry: QRCodeEntry) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onEdit }) => {
  const { t, langCode } = useLanguage();

  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<LibraryItem | null>(null);
  const [fullscreenCode, setFullscreenCode] = useState<QRCodeEntry | null>(null);

  // Edit & Delete States
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  // Card menu states
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!menuOpenId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenId]);

  const loadData = async () => {
    try {
      const codes = await getQRCodes();
      const grouped = processCodes(codes);
      setItems(grouped.sort((a, b) => b.createdAt - a.createdAt));

      if (activeItem) {
        const updated = grouped.find(i => i.id === activeItem.id);
        if (updated) setActiveItem(updated);
        else setActiveItem(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const processCodes = (codes: QRCodeEntry[]): LibraryItem[] => {
    const map = new Map<string, LibraryItem>();

    codes.forEach(code => {
      if (code.group) {
        if (!map.has(code.group)) {
          map.set(code.group, {
            type: 'group',
            id: code.group,
            name: code.groupName || t.common.group,
            createdAt: code.createdAt,
            entries: []
          });
        }
        map.get(code.group)!.entries.push(code);
      }
    });

    const result: LibraryItem[] = Array.from(map.values());

    codes.forEach(code => {
      if (!code.group) {
        result.push({
          type: 'single',
          id: code.id,
          name: code.name,
          createdAt: code.createdAt,
          entries: [code]
        });
      }
    });

    return result;
  };

  const CATEGORY_ORDER: ContentType[] = ['password', 'url', 'text', 'wifi', 'vcard'];

  const getItemCategory = (item: LibraryItem): ContentType => {
    if (item.type === 'group') return 'password';
    return item.entries[0]?.type || 'text';
  };

  const groupedByCategory = CATEGORY_ORDER
    .map(cat => ({
      category: cat,
      label: t.library.categories[cat],
      items: items.filter(item => getItemCategory(item) === cat)
    }))
    .filter(g => g.items.length > 0);

  const handleSaveName = async () => {
    if (!activeItem) return;
    const newName = editNameValue.trim() || t.common.unknown;

    if (activeItem.type === 'group') {
      await updateGroupName(activeItem.id, newName);
    } else {
      const entry = activeItem.entries[0];
      await updateQRCode({ ...entry, name: newName });
    }

    setIsEditingName(false);
    loadData();
  };

  const handleDeleteItem = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    for (const entry of item.entries) {
      await deleteQRCode(entry.id);
    }

    setConfirmDeleteId(null);
    setMenuOpenId(null);
    loadData();
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!activeItem) return;

    await deleteQRCode(entryId);

    if (activeItem.entries.length <= 1) {
      setActiveItem(null);
    }

    loadData();
  };

  // --- RENDER ---

  if (loading) return <div className="p-8 text-center text-gray italic">{t.common.loading}</div>;

  // 1. Fullscreen Overlay
  if (fullscreenCode && activeItem) {
    return (
      <FullscreenQRView
        initialCode={fullscreenCode}
        allCodes={activeItem.entries}
        onClose={() => setFullscreenCode(null)}
      />
    );
  }

  // 2. Detail View
  if (activeItem) {
    return (
      <div className="flex flex-col min-h-full bg-bg">
        <div className="sticky top-0 z-30 bg-[#faf9f5] border-b border-light-gray px-6 py-4 flex items-center justify-between h-[73px] shadow-sm">
          <button
            onClick={() => setActiveItem(null)}
            className="text-[#d97757] font-heading font-semibold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity w-16"
          >
            ← {t.common.back}
          </button>

          <div className="flex-1 text-center mx-2 overflow-hidden">
            {isEditingName ? (
              <input
                autoFocus
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                className="w-full text-center font-heading font-semibold text-lg text-text bg-transparent border-b border-accent focus:outline-none"
              />
            ) : (
              <h2
                onClick={() => { setEditNameValue(activeItem.name); setIsEditingName(true); }}
                className="font-heading font-semibold text-lg text-text truncate cursor-pointer hover:text-accent transition-colors"
                title={t.common.edit}
              >
                {activeItem.name}
              </h2>
            )}
          </div>

          <div className="w-16" />
        </div>

        <div className="p-6 flex-1 pb-32">
          {activeItem.entries.map(entry => (
            <QRDetailCard
              key={entry.id}
              entry={entry}
              onFullscreen={() => setFullscreenCode(entry)}
              onEdit={() => onEdit && onEdit(entry)}
              onDelete={() => handleDeleteEntry(entry.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // 3. Main List View
  return (
    <div className="flex flex-col gap-3 p-6">
      {items.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="font-heading text-lg font-medium text-text mb-2">{t.library.emptyTitle}</p>
            <p className="font-body text-sm text-gray">{t.library.emptySubtitle}</p>
         </div>
      ) : (
        groupedByCategory.map(group => {
          const isExpanded = expandedCategories.has(group.category);
          const toggleCategory = () => {
            setExpandedCategories(prev => {
              const next = new Set(prev);
              if (next.has(group.category)) next.delete(group.category);
              else next.add(group.category);
              return next;
            });
          };

          return (
            <div key={group.category} className="mb-2">
              <button
                onClick={toggleCategory}
                className="flex items-center gap-2 mb-2 w-full text-left"
              >
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#b0aea5" strokeWidth="1.5"
                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                >
                  <path d="M4 2l4 4-4 4" />
                </svg>
                <h2 className="font-heading font-medium text-[#141413]">{group.label}</h2>
                <span className="font-mono text-[10px] text-gray">{group.items.length}</span>
              </button>
              {isExpanded && (
                <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                  {group.items.map(item => {
                    const isMenuOpen = menuOpenId === item.id;

                    return (
                      <div key={item.id} className="relative">
                        <div
                          onClick={() => setActiveItem(item)}
                          className="group bg-card border border-light-gray px-4 py-3 flex justify-between items-center cursor-pointer hover:border-accent transition-all duration-200"
                        >
                          <div className="flex flex-col overflow-hidden">
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-semibold text-sm text-text truncate max-w-[200px]">{item.name}</h3>
                              {item.type === 'group' && (
                                <span className="bg-text text-bg text-[10px] px-1.5 py-0.5 font-mono">
                                  {item.entries.length}
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] uppercase text-gray">
                              {new Intl.DateTimeFormat(langCode === 'auto' ? 'en' : langCode).format(item.createdAt)}
                            </span>
                          </div>

                          <div className="relative" ref={isMenuOpen ? menuRef : undefined}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setMenuOpenId(isMenuOpen ? null : item.id); }}
                              className="p-1.5 text-gray hover:text-text transition-colors"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                                <circle cx="9" cy="3.5" r="1.5" />
                                <circle cx="9" cy="9" r="1.5" />
                                <circle cx="9" cy="14.5" r="1.5" />
                              </svg>
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-full mt-1 z-40 bg-[#ffffff] border border-[#e8e6dc] animate-in fade-in duration-150">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); setConfirmDeleteId(item.id); }}
                                  className="w-full text-left px-4 py-2.5 font-heading font-medium text-sm text-[#c4654a] hover:bg-[#faf9f5] transition-colors whitespace-nowrap"
                                >
                                  {t.common.delete}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
      <div className="text-center pt-8 pb-4">
        <span className="font-body text-xs text-gray italic">{t.library.endOfList}</span>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setConfirmDeleteId(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative bg-[#ffffff] border border-[#e8e6dc] p-6 w-72 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-heading text-sm font-semibold text-text text-center mb-5">{t.library.confirmDelete}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 border border-light-gray text-text text-xs font-heading font-medium uppercase hover:bg-light-gray/50 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => handleDeleteItem(confirmDeleteId)}
                className="flex-1 py-2.5 bg-[#c4654a] text-white text-xs font-heading font-medium uppercase hover:opacity-90 border border-[#c4654a] transition-colors"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
