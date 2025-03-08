import { GetCustomerResponse } from '@/views/concepts/customers/CustomerList/types';
import ApiService from './ApiService'

export async function apiGetCustomersList<T, U extends Record<string, unknown>>(params: U) {
    const response = await ApiService.fetchDataWithAxios<T>({
        url: '/users',
        method: 'get',
        params,
    });

    console.log("Fetched Customers Response:", response); // ✅ Debugging log

    return response;
}


export async function apiGetCustomer(params: { id: string }) {
    return ApiService.fetchDataWithAxios<GetCustomerResponse>({
        url: `/users/${params.id}`,
        method: 'get',
        params,
    });
}


export async function apiGetCustomerLog<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/users/log`,
        method: 'get',
        params,
    })
}
