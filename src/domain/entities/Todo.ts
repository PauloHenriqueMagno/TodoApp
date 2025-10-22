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
