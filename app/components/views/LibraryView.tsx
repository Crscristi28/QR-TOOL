"use client";

import React, { useEffect, useState } from 'react';
import { getQRCodes, deleteQRCode, updateGroupName, updateQRCode, QRCodeEntry } from '@/app/lib/db';
import FullscreenQRView from '@/app/components/FullscreenQRView';
import QRDetailCard from '@/app/components/QRDetailCard';
import { useLanguage } from '@/app/lib/i18n';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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

  const handleDelete = async () => {
    if (!activeItem) return;

    for (const entry of activeItem.entries) {
       await deleteQRCode(entry.id);
    }

    setActiveItem(null);
    setShowDeleteConfirm(false);
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
           {!showDeleteConfirm ? (
             <>
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

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="font-heading font-medium text-xs text-red-600 uppercase tracking-wide hover:opacity-70 w-16 text-right"
                >
                  {t.common.delete}
                </button>
             </>
           ) : (
              <div className="flex items-center justify-between w-full animate-in fade-in duration-200">
                 <span className="font-heading text-xs font-semibold text-text mr-4">{t.library.confirmDelete}</span>
                 <div className="flex gap-2">
                   <button
                     onClick={() => setShowDeleteConfirm(false)}
                     className="px-3 py-1.5 border border-light-gray text-text text-xs font-heading font-medium uppercase hover:bg-light-gray/50 transition-colors"
                   >
                     {t.common.cancel}
                   </button>
                   <button
                     onClick={handleDelete}
                     className="px-3 py-1.5 bg-red-600 text-white text-xs font-heading font-medium uppercase hover:bg-red-700 border border-red-600 transition-colors"
                   >
                     {t.common.yes}
                   </button>
                 </div>
              </div>
           )}
        </div>

        <div className="p-6 flex-1 pb-32">
          {activeItem.entries.map(entry => (
            <QRDetailCard
              key={entry.id}
              entry={entry}
              onFullscreen={() => setFullscreenCode(entry)}
              onEdit={() => onEdit && onEdit(entry)}
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
        items.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group bg-card border border-light-gray p-5 flex justify-between items-center cursor-pointer hover:border-accent transition-all duration-200"
          >
             <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                   <h3 className="font-heading font-semibold text-text truncate max-w-[200px]">{item.name}</h3>
                   {item.type === 'group' && (
                     <span className="bg-text text-bg text-[10px] px-1.5 py-0.5 font-mono">
                       {item.entries.length}
                     </span>
                   )}
                </div>
                <div className="flex items-center gap-2">
                   <span className="font-mono text-[10px] uppercase text-gray">
                      {new Intl.DateTimeFormat(langCode === 'auto' ? 'en' : langCode).format(item.createdAt)}
                   </span>
                   {item.type === 'single' && (
                      <span className="font-mono text-[10px] uppercase bg-light-gray px-1.5 py-0.5 text-text">
                        {item.entries[0].type}
                      </span>
                   )}
                </div>
             </div>
             <div className="text-light-gray group-hover:text-accent transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <path d="M9 18l6-6-6-6" />
                </svg>
             </div>
          </div>
        ))
      )}
      <div className="text-center pt-8 pb-4">
        <span className="font-body text-xs text-gray italic">{t.library.endOfList}</span>
      </div>
    </div>
  );
};

export default LibraryView;
