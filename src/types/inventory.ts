export type InventoryItem = {
  id?: string;
  name?: string;
  description?: string;
  quantity?: number;
  cost: number;
  status?: "active" | "inactive";
  imageUrl?: string;
};
