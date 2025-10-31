export type TodoId = string;

export interface Todo {
  id: TodoId;
  title: string;
  description?: string;
  imageUri?: string;
  completed: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface TodoDBRow {
  id: TodoId;
  title: string;
  description: string | null;
  image_uri: string | null;
  completed: 1 | 0;
  latitude: number | null;
  longitude: number | null;
  created_at: number; // timestamp
  updated_at: number; // timestamp
}
