import { apiGetCustomer, apiGetCustomersList } from '@/services/CustomersService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { GetCustomersListResponse } from '../types'
import type { TableQueries } from '@/@types/common'


// CustomerListTable (Main Table Component)
// Uses useCustomerList (a custom hook) to fetch customer data.


// useCustomerList (Data Fetching Hook)
export default function useCustomerList() { 
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

// Fetch customer list
    const { data, error, isLoading, mutate } = useSWR(
        ['/api/users', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCustomersList<GetCustomersListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    // Extract customer list from API response
    const customerList = data?.data || []
    const customerListTotal = Array.isArray(customerList) ? customerList.length : 0
    

    


    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}
