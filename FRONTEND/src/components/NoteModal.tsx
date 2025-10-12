import { useState, useEffect } from 'react';
import { X, Save, Palette } from 'lucide-react';
import { NoteWithPreferences } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { noteColors } from '@/data/demoData';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<NoteWithPreferences>) => void;
  note?: NoteWithPreferences | null;
  isEditing?: boolean;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  note,
  isEditing = false,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (note && isEditing) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedColor(note.color || noteColors[0]);
    } else {
      setTitle('');
      setContent('');
      setSelectedColor(noteColors[0]);
    }
  }, [note, isEditing, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;

    const noteData: Partial<NoteWithPreferences> = {
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
    };

    if (isEditing && note) {
      noteData.note_uuid = note.note_uuid;
    }

    onSave(noteData);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? 'Edit Note' : 'Create New Note'}</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="h-8 w-8 p-0"
              >
                <Palette className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {showColorPicker && (
            <div className="space-y-2">
              <Label>Note Color</Label>
              <div className="flex space-x-2 flex-wrap">
                {noteColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                      selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
              autoFocus
            />
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] resize-none"
              style={{ backgroundColor: selectedColor + '20' }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{content.length} characters</span>
            <span className="flex items-center space-x-2">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Enter</kbd>
              <span>to save</span>
            </span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Note' : 'Save Note'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};