export type Order = {
    id: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    items: { productId: string; name: string; price: number; quantity: number }[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    payment: { method: string; status: string };
    status: string;
    statusHistory: { status: string; time: string; label: string }[];
    createdAt: string;
    estimatedTime: string;
    notes: string;
}
