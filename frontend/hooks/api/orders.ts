'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/types';
import {
    createOrderAction,
    getUserOrdersAction,
    getOrderDetailsAction
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
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['user-orders'] });
            toast.success('Order placed successfully!');
            router.push(`/orders/${data.orderId}?success=true`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to place order');
        },
    });
}

export function useUserOrders() {
    return useQuery({
        queryKey: ['user-orders'],
        queryFn: async () => {
            const result = await getUserOrdersAction();
            if (result.error) throw new Error(result.error);
            return result.orders as Order[];
        },
    });
}

export function useOrderDetails(orderId: string) {
    return useQuery({
        queryKey: ['order-details', orderId],
        queryFn: async () => {
            const result = await getOrderDetailsAction(orderId);
            if (result.error) throw new Error(result.error);
            return result.order;
        },
        enabled: !!orderId,
    });
}
