'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import type { User } from '@/lib/types';
import {
    logoutAction,
    getMeAction,
    updateProfileAction
} from '@/app/actions/auth';

export function useAuth() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const result = await getMeAction();
            return result.user as User | null;
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await logoutAction();
            // Clear NextAuth session
            await signOut({ redirect: false });
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Logged out successfully!');
            window.location.href = '/';
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userData: { name: string; phone?: string }) => {
            const result = await updateProfileAction(userData);
            if (result.error) throw new Error(result.error);
            return result.user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Profile updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update profile');
        },
    });
}
