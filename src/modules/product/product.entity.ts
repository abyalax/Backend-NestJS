export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

export interface ProductCreate {
    name: string;
    category: string;
    price: number;
}