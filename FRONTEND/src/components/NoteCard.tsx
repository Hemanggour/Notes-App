import { MoreVertical, Edit, Trash2, Palette } from 'lucide-react';
import { NoteWithPreferences } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { noteColors } from '@/data/demoData';
import { useTheme } from '@/contexts/ThemeContext';

interface NoteCardProps {
  note: NoteWithPreferences;
  onEdit: (note: NoteWithPreferences) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  isDragging?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onColorChange,
  isDragging = false,
}) => {
  const { theme } = useTheme();

  const getDarkenedColor = (color: string) => {
    if (theme === 'light') return color;

    // In dark mode, darken the color significantly for better contrast
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Reduce brightness to about 30% for dark mode
    const darkenFactor = 0.3;
    const newR = Math.floor(r * darkenFactor);
    const newG = Math.floor(g * darkenFactor);
    const newB = Math.floor(b * darkenFactor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      className={`note-card bg-card rounded-xl p-4 shadow-sm border border-border/50 cursor-pointer select-none ${isDragging ? 'dragging' : ''
        }`}
      style={{ backgroundColor: getDarkenedColor(note.color || '#ffffff') }}
      onClick={() => onEdit(note)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-card-foreground text-lg leading-tight line-clamp-2">
          {note.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit note
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                <Palette className="mr-2 h-4 w-4" />
                Change color
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-auto">
                <div className="px-2 py-2">
                  <div className="grid grid-cols-5 gap-2">
                    {noteColors.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onColorChange(note.note_uuid, color);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.note_uuid);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <p className="text-card-foreground/80 text-sm leading-relaxed line-clamp-6">
          {formatContent(note.content)}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Updated {formatDate(note.updated_at)}</span>
        <div className="flex items-center space-x-2">
          <div className="h-1 w-1 bg-muted-foreground rounded-full" />
          <span>{note.content.length} chars</span>
        </div>
      </div>
    </div>
  );
};