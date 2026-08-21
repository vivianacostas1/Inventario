export interface ShareholderProductRelation {
  id: string;
  shareholderId: string;
  productId: string;
  assignedAt: Date;
  shareholder?: {
    id: string;
    name: string;
    email: string | null;
  };
  product?: {
    id: string;
    sku: string;
    name: string;
  };
}

export interface AssignProductToShareholderDTO {
  shareholderId: string;
  productId: string;
}