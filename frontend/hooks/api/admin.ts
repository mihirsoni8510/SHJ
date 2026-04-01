'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { User, Order } from '@/lib/types';
import {
    getAdminOrdersAction,
    updateOrderStatusAction,
    getAdminUsersAction,
    updateUserRoleAction
} from '@/app/actions/admin';

export function useAdminOrders() {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const result = await getAdminOrdersAction();
            if (result.error) throw new Error(result.error);
            return result.orders as Order[];
        },
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const result = await updateOrderStatusAction(id, status);
            if (result.error) throw new Error(result.error);
            return result.order;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            toast.success('Order status updated!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update order status');
        },
    });
}

export function useAdminUsers() {
    return useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const result = await getAdminUsersAction();
            if (result.error) throw new Error(result.error);
            return result.users as User[];
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            const result = await updateUserRoleAction(id, role);
            if (result.error) throw new Error(result.error);
            return result.user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('User role updated!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update user role');
        },
    });
}
