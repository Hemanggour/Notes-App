import { NoteWithPreferences, User } from '@/types';

export const demoUser: User = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  username: 'demouser',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const demoNotes: NoteWithPreferences[] = [
  {
    note_uuid: 'note-1',
    title: 'Welcome to Your Notes App! 🎉',
    content: 'This is your first note. You can edit, delete, and rearrange notes by dragging them around. Try creating a new note to get started!',
    color: '#FFE4E1',
    position: 0,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    note_uuid: 'note-2',
    title: 'Project Ideas 💡',
    content: `- Build a personal portfolio website
- Create a mobile app for expense tracking
- Learn a new programming language
- Contribute to open source projects
- Write technical blog posts`,
    color: '#E1F5FE',
    position: 1,
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z',
  },
  {
    note_uuid: 'note-3',
    title: 'Shopping List 🛒',
    content: `- Milk
- Bread
- Eggs
- Apples
- Coffee beans
- Yogurt
- Chicken breast`,
    color: '#E8F5E8',
    position: 2,
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
  {
    note_uuid: 'note-4',
    title: 'Meeting Notes 📝',
    content: `Team standup - January 12th

Discussed:
- Q1 roadmap planning
- New feature requirements
- Bug fixes priority list

Action items:
- Update documentation by Friday
- Schedule user testing sessions
- Review design mockups`,
    color: '#FFF3E0',
    position: 3,
    created_at: '2024-01-12T14:00:00Z',
    updated_at: '2024-01-12T14:00:00Z',
  },
  {
    note_uuid: 'note-5',
    title: 'Recipe: Chocolate Chip Cookies 🍪',
    content: `Ingredients:
- 2¼ cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter, softened
- ¾ cup granulated sugar
- ¾ cup brown sugar
- 2 large eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips

Instructions:
1. Preheat oven to 375°F
2. Mix dry ingredients
3. Cream butter and sugars
4. Add eggs and vanilla
5. Combine wet and dry ingredients
6. Fold in chocolate chips
7. Bake 9-11 minutes`,
    color: '#F3E5F5',
    position: 4,
    created_at: '2024-01-11T16:45:00Z',
    updated_at: '2024-01-11T16:45:00Z',
  },
  {
    note_uuid: 'note-6',
    title: 'Workout Plan 💪',
    content: `Monday - Chest & Triceps
- Bench press: 3x8-10
- Incline dumbbell press: 3x10-12
- Tricep dips: 3x12-15

Wednesday - Back & Biceps
- Pull-ups: 3x8-10
- Rows: 3x10-12
- Bicep curls: 3x12-15

Friday - Legs & Shoulders
- Squats: 3x8-10
- Lunges: 3x12 each leg
- Shoulder press: 3x10-12`,
    color: '#E0F2F1',
    position: 5,
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-01-10T08:30:00Z',
  },
];

// Note colors for the color picker
export const noteColors = [
  '#FFE4E1', // Light pink
  '#E1F5FE', // Light blue
  '#E8F5E8', // Light green
  '#FFF3E0', // Light orange
  '#F3E5F5', // Light purple
  '#E0F2F1', // Light teal
  '#FFF8E1', // Light yellow
  '#FCE4EC', // Light rose
  '#E3F2FD', // Light indigo
  '#F1F8E9', // Light lime
];
