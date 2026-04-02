'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    createOrderAction,
    getOrdersAction,
    getOrderAction
} from '@/app/actions/orders';

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (orderData: {
            address: {
                name: string;
                phone: string;
                address: string;
                city: string;
                state: string;
                pincode: string;
            },
            paymentMethod: string;
        }) => {
            const result = await createOrderAction(orderData);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order placed successfully!');
            router.push(`/orders/${data.orderId}?success=true`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to place order');
        },
    });
}

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const result = await getOrdersAction();
            if (result.error) throw new Error(result.error);
            return result.orders;
        },
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
            const result = await getOrderAction(id);
            if (result.error) throw new Error(result.error);
            return result.order;
        },
        enabled: !!id,
    });
}
