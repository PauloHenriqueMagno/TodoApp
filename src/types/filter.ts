export type FilterType = {
  query: string;
  status: "all" | "completed" | "pending";
  sortBy: "created_at" | "title";
  sortOrder: "asc" | "desc";
  hasImage: boolean;
  hasLocation: boolean;
};
