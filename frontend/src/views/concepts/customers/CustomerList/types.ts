type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phone: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}



type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

// export type GetCustomersListResponse = {
//     list: Customer[]
//     total: number
// }

export type GetCustomerResponse = {
    data: Customer;  // <-- `data` should contain a `Customer` object
    status: string;
};

export type GetCustomersListResponse = {
    data: Customer[]; // Change 'list' to 'data' to match the API response
    filters: unknown[];
    pagination: {
        current_page: number;
        has_next: boolean;
        has_prev: boolean;
    };
    sort: Record<string, unknown>;
    status: string;
};


export type Filter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    status: string
    phone?: string;   
    address?: string; 
    position?: string;
    department?: string;
    hire_date?: string;
}
