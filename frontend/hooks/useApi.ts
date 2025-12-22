'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { User, Product, CartItem, WishlistItem, Category, Order } from '@/lib/types';

// Import server actions
import {
    loginAction,
    registerAction,
    logoutAction,
    getMeAction,
    updateProfileAction,
    forgotPasswordAction,
    resetPasswordAction
} from '@/app/actions/auth';
import {
    getProductsAction,
    getProductBySlugAction,
    createProductAction,
    updateProductAction,
    deleteProductAction
} from '@/app/actions/products';
import {
    getCategoriesAction,
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction
} from '@/app/actions/categories';
import {
    getCartAction,
    addToCartAction,
    updateCartAction,
    removeFromCartAction
} from '@/app/actions/cart';
import {
    getWishlistAction,
    addToWishlistAction,
    removeFromWishlistAction
} from '@/app/actions/wishlist';
import {
    getAdminOrdersAction,
    updateOrderStatusAction,
    getAdminUsersAction,
    updateUserRoleAction,
    getAdminProductAction,
    getAdminCategoryAction,
    getAdminProductsAction
} from '@/app/actions/admin';
import { uploadImageAction } from '@/app/actions/upload';

// Auth hooks
export function useAuth() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const result = await getMeAction();
            return result.user as User | null;
        },
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const result = await loginAction(credentials);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: (data) => {
            if (data?.user) {
                queryClient.setQueryData(['user'], data.user);
            }
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Logged in successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Login failed');
        },
    });
}

export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: {
            email: string;
            password: string;
            name: string;
            phone?: string;
        }) => {
            const result = await registerAction(userData);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Account created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Registration failed');
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await logoutAction();
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Logged out successfully!');
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

export function useForgotPassword() {
    return useMutation({
        mutationFn: async (email: string) => {
            const result = await forgotPasswordAction(email);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Reset link sent to your email');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to request password reset');
        },
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: async (data: any) => {
            const result = await resetPasswordAction(data);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Password reset successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to reset password');
        },
    });
}

// Products hooks
export function useProducts(filters?: {
    category?: string;
    search?: string;
    metal?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            const result = await getProductsAction(filters);
            return result as { products: Product[]; pagination: any };
        },
    });
}

export function useAdminProducts() {
    return useQuery({
        queryKey: ['admin-products'],
        queryFn: async () => {
            const result = await getAdminProductsAction();
            return result.products as Product[];
        },
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productData: Partial<Product>) => {
            const result = await createProductAction(productData);
            if (result.error) throw new Error(result.error);
            return result.product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create product');
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: productData }: { id: string; data: Partial<Product> }) => {
            const result = await updateProductAction(id, productData);
            if (result.error) throw new Error(result.error);
            return result.product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update product');
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteProductAction(id);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete product');
        },
    });
}

export function useProduct(slug: string) {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const result = await getProductBySlugAction(slug);
            if (result.error) throw new Error(result.error);
            return result.product as Product;
        },
        enabled: !!slug,
    });
}

export function useAdminProduct(id: string) {
    return useQuery({
        queryKey: ['admin-product', id],
        queryFn: async () => {
            const result = await getAdminProductAction(id);
            if (result.error) throw new Error(result.error);
            return result.product as Product;
        },
        enabled: !!id,
    });
}

export function useUploadImage() {
    return useMutation({
        mutationFn: async (base64: string) => {
            const result = await uploadImageAction(base64);
            if (result.error) throw new Error(result.error);
            return result.url as string;
        },
    });
}

// Cart hooks
export function useCart() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const result = await getCartAction();
            return result.cartItems as CartItem[];
        },
    });
}

export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
            const result = await addToCartAction(productId, quantity);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Added to cart!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add to cart');
        },
    });
}

export function useUpdateCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
            const result = await updateCartAction(productId, quantity);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update cart');
        },
    });
}

export function useRemoveFromCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const result = await removeFromCartAction(productId);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Removed from cart');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove from cart');
        },
    });
}

// Wishlist hooks
export function useWishlist() {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const result = await getWishlistAction();
            return result.wishlistItems as WishlistItem[];
        },
    });
}

export function useAddToWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const result = await addToWishlistAction(productId);
            if (result.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Added to wishlist!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add to wishlist');
        },
    });
}

export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const result = await removeFromWishlistAction(productId);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Removed from wishlist');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to remove from wishlist');
        },
    });
}

// Admin Orders hooks
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

export function useAdminCategory(id: string) {
    return useQuery({
        queryKey: ['admin-category', id],
        queryFn: async () => {
            const result = await getAdminCategoryAction(id);
            if (result.error) throw new Error(result.error);
            return result.category as Category;
        },
        enabled: !!id,
    });
}

// Categories hooks
export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const result = await getCategoriesAction();
            return result.categories as Category[];
        },
    });
}

export function useCreateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: Partial<Category>) => {
            const result = await createCategoryAction(categoryData);
            if (result.error) throw new Error(result.error);
            return result.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create category');
        },
    });
}

export function useUpdateCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data: categoryData }: { id: string; data: Partial<Category> }) => {
            const result = await updateCategoryAction(id, categoryData);
            if (result.error) throw new Error(result.error);
            return result.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update category');
        },
    });
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const result = await deleteCategoryAction(id);
            if (result.error) throw new Error(result.error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });
}

// Admin Users hooks
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
