import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetCustomer } from '@/services/CustomersService'
import CustomerForm from '../CustomerForm'
import sleep from '@/utils/sleep'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import type { CustomerFormSchema } from '../CustomerForm'
import type { Customer } from '../CustomerList/types'

const CustomerEdit = () => {
    const { id } = useParams()
    console.log('Customer ID from URL:', id) // ✅ Log extracted ID
    const navigate = useNavigate()

    const { data: response, isLoading } = useSWR(
        [`/api/users/${id}`, { id: id as string }],
        ([_, params]) => apiGetCustomer(params), // ✅ Fixed API call
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )
    
    console.log("Fetched customer data:", response) // ✅ Debugging log

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        await sleep(800)
        setIsSubmiting(false)
        navigate('/concepts/customers/customer-list')
    }

    const getDefaultValues = () => {
        console.log("Generating default values from data:", response); // ✅ Debugging log
    
        if (response?.data) {  
            const { name, email, phone, address, position, department, hire_date } = response.data;  
    
            // ✅ Split name into first & last name
            const nameParts = name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
    
            return {
                firstName,
                lastName,
                email,
                phoneNumber: phone || '',  // ✅ Use `phone` directly
                address: address || '',    // ✅ Use `address` directly
                position: position,  // ❌ Not in API, set empty
                hire_date: hire_date,
                department: department,
                img: '', // ❌ Not in API, set empty
                tags: [],
            };
        }
    
        return {};
    }
    

    console.log("Final Default Values:", getDefaultValues()) // ✅ Log default values
    
    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        navigate('/concepts/customers/customer-list')
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
    }

    return (
        <>
            {!isLoading && !response?.data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
            {!isLoading && response?.data && (
                <>
                    <CustomerForm
                        defaultValues={getDefaultValues() as unknown as CustomerFormSchema}
                        newCustomer={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmiting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </CustomerForm>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Remove customers"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to remove this customer? This
                            action can&apos;t be undone.
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default CustomerEdit
