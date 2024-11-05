export interface CurrentBudget {
    name: string;
    description: string;
    price: number;
    pagesQuantity?: number;
    languagesQuantity?: number;
}

export interface InProgressBudget {
    name: string;
    mail: string;
    phone: number;
    items: CurrentBudget[];
}
