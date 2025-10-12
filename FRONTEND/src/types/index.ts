export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend Note structure
export interface Note {
  note_uuid: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Frontend Note with local preferences
export interface NoteWithPreferences extends Note {
  color?: string;
  position?: number;
}

export interface AuthResponse {
  data: {
    tokens: {
      access: string;
      refresh: string;
    };
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  note_uuid: string;
  title?: string;
  content?: string;
}
