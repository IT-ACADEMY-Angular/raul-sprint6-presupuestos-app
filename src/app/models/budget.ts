export interface CurrentBudget {
  name: string;
  description: string;
  price: number;
  pagesQuantity?: number;
  languagesQuantity?: number;
}

export interface InProgressBudget {
  name: string;
  email: string;
  phone: string;
  items: CurrentBudget[];
  pagesQuantity: number;
  languagesQuantity: number;
  total: number;
  date: string;
}
