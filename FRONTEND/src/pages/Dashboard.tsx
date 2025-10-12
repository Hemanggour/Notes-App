import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Search, LogOut, Settings, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NoteCard } from '@/components/NoteCard';
import { NoteModal } from '@/components/NoteModal';
import { NoteWithPreferences } from '@/types';
import { notesAPI } from '@/lib/api';
import { noteStorage } from '@/lib/noteStorage';
import { useNavigate } from 'react-router-dom';
import { noteColors } from '@/data/demoData';

export default function Dashboard() {
  const [notes, setNotes] = useState<NoteWithPreferences[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteWithPreferences[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteWithPreferences | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch notes on mount and merge with local preferences
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await notesAPI.getAll();
        const preferences = noteStorage.getAll();
        
        // Merge backend data with local preferences
        const notesWithPreferences = data.map((note, index) => ({
          ...note,
          color: preferences[note.note_uuid]?.color || noteColors[0],
          position: preferences[note.note_uuid]?.position ?? index,
        }));
        
        // Sort by position
        notesWithPreferences.sort((a, b) => (a.position || 0) - (b.position || 0));
        
        setNotes(notesWithPreferences);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notes. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [toast]);

  // Filter notes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [notes, searchQuery]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: NoteWithPreferences) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData: Partial<NoteWithPreferences>) => {
    try {
      if (editingNote) {
        // Update existing note (only title and content to backend)
        const updated = await notesAPI.update({
          note_uuid: editingNote.note_uuid,
          title: noteData.title,
          content: noteData.content,
        });
        
        // Store color locally if changed
        if (noteData.color) {
          noteStorage.set(editingNote.note_uuid, { color: noteData.color });
        }
        
        setNotes(prevNotes =>
          prevNotes.map(note => 
            note.note_uuid === editingNote.note_uuid 
              ? { ...updated, color: noteData.color || note.color, position: note.position }
              : note
          )
        );
        toast({
          title: 'Note updated!',
          description: 'Your note has been successfully updated.',
        });
      } else {
        // Create new note (only title and content to backend)
        const created = await notesAPI.create({
          title: noteData.title!,
          content: noteData.content!,
        });
        
        // Store color locally
        const color = noteData.color || noteColors[0];
        noteStorage.set(created.note_uuid, { color, position: 0 });
        
        // Add to state with local preferences
        const newNote: NoteWithPreferences = {
          ...created,
          color,
          position: 0,
        };
        
        setNotes(prevNotes => [newNote, ...prevNotes.map((n, i) => ({ ...n, position: i + 1 }))]);
        toast({
          title: 'Note created!',
          description: 'Your new note has been added.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesAPI.delete(noteId);
      noteStorage.remove(noteId); // Remove local preferences
      setNotes(prevNotes => prevNotes.filter(note => note.note_uuid !== noteId));
      toast({
        title: 'Note deleted',
        description: 'The note has been permanently deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleColorChange = (noteId: string, color: string) => {
    // Store color locally only
    noteStorage.set(noteId, { color });
    setNotes(prevNotes =>
      prevNotes.map(note => note.note_uuid === noteId ? { ...note, color } : note)
    );
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredNotes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions locally
    const updatedNotes = items.map((note, index) => {
      const newPosition = index;
      noteStorage.set(note.note_uuid, { position: newPosition });
      return {
        ...note,
        position: newPosition,
      };
    });

    setNotes(prevNotes => {
      const nonFilteredNotes = prevNotes.filter(note => 
        !filteredNotes.some(filtered => filtered.note_uuid === note.note_uuid)
      );
      return [...updatedNotes, ...nonFilteredNotes].sort((a, b) => (a.position || 0) - (b.position || 0));
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background-secondary">
        <div className="text-center">
          <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-secondary">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">My Notes</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>

                <ThemeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.username || 'User'} />
                        <AvatarFallback>{getInitials(user?.username || 'User')}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Notes'}
            </h2>
            <p className="text-muted-foreground mt-1">
              Organize your thoughts and ideas
            </p>
          </div>

          <Button onClick={handleCreateNote} className="animate-scale-in">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first note to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateNote}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first note
              </Button>
            )}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes" direction={viewMode === 'grid' ? undefined : 'vertical'}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-4'
                  } ${snapshot.isDraggingOver ? 'drop-zone active' : 'drop-zone'}`}
                >
                  {filteredNotes.map((note, index) => (
                    <Draggable key={note.note_uuid} draggableId={note.note_uuid} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="group"
                        >
                          <NoteCard
                            note={note}
                            onEdit={handleEditNote}
                            onDelete={handleDeleteNote}
                            onColorChange={handleColorChange}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        isEditing={!!editingNote}
      />
    </div>
  );
}