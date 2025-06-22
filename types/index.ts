export interface Attachment {
  uri: string;
  type: string; // 'image' or 'file'
  name: string;
  size: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  attachments: Attachment[];
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
}
