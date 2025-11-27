export default {
    // App & Branding
    appTitle: "Bobek — Admin Panel",

    // Navigation / Sections
    dashboard: "Dashboard",
    customers: "Customers",
    orders: "Orders",
    products: "Products",

    // Dashboard KPIs / Panels
    newOrder: "+ New Order",
    pendingOrders: "Pending orders",
    pendingAmount: "Pending amount",
    deliveredToday: "Delivered today",
    revenue7d: "Revenue (7d)",
    topProducts: "Top products (30d)",
    noData: "No data yet.",
    debtTitle: "Customers with highest debt",

    // Common Entities / Fields
    actions: "Actions",
    address: "Address",
    balance: "Balance",
    balanceDebt: "Balance (debt)",
    created: "Created",
    createdAt: "Created",
    date: "Date",
    edit: "Edit",
    itemSingular: "item",
    items: "Items",
    line: "Line",
    lineTotal: "Line total",
    name: "Name",
    price: "Price",
    qty: "Qty",
    status: "Status",
    total: "Total",
    unit: "Unit",
    unitPrice: "Unit Price",

    // Status Values
    delivered: "Delivered",
    toDeliver: "To deliver",
    cancelled: "Cancelled",

    // Customers CRUD
    customer: "Customer",
    newCustomer: "+ New Customer",
    newCustomerTitle: "New Customer",
    editCustomerTitle: "Edit Customer",
    noCustomers: "No customers yet.",
    customerCreated: "Customer created",
    customerUpdated: "Customer updated",
    failedCreateCustomer: "Failed to create customer",
    failedUpdateCustomer: "Failed to update customer",

    // Orders CRUD
    order: "Order",
    createOrder: "Create order",
    noOrdersYet: "No orders yet.",
    orderCreated: "Order created",
    orderUpdated: "Order updated",
    orderCancelled: "Order cancelled",
    orderDelivered: "Order marked as delivered",
    orderBackToPending: "Order set back to pending",
    orderNotFound: "Order not found",
    failedUpdateOrderStatus: "Failed to update order status",
    failedCancelOrder: "Failed to cancel order",
    confirmCancelOrder: "Cancel this order?",

    // Products CRUD
    product: "Product",
    newProduct: "+ New Product",
    newProductTitle: "New Product",
    editProductTitle: "Edit Product",
    noProducts: "No products yet.",
    productCreated: "Product created",
    productUpdated: "Product updated",
    productActivated: "Product activated",
    productDeactivated: "Product deactivated",
    failedCreateProduct: "Failed to create product",
    failedUpdateProduct: "Failed to update product",
    failedToggleProduct: "Failed to toggle product",
    activate: "Activate",
    deactivate: "Deactivate",
    active: "Active",
    inactive: "Inactive",
    showInactive: "Show inactive",
    hideInactive: "Hide inactive",
    revenueLast20: "Revenue (last 20 rows)",
    unitsLast20: "Total units (last 20 rows)",
    updated: "Updated",

    // Forms / Buttons / Generic UI
    addItem: "+ Add item",
    amountPaid: "amount paid",
    cancel: "Cancel",
    confirm: "Confirm",
    couldNotSave: "Could not save. Try again.",
    currentDebt: "Current debt",
    new: "+ New",
    noItems: "No items.",
    payment: "Payment",
    removeLine: "Remove line",
    save: "Save",
    saveChanges: "Save changes",
    saving: "Saving…",
    showLess: "Show less",
    showMoreN: "+{n} more",
    markDelivered: "Mark delivered",
    markPending: "Mark pending",
    select: "Select…",

    // Search / Topbar / Misc
    openMenu: "Open menu",
    search: "Search",
    clear: "Clear",
    searching: "Searching…",
    noResults: "No results",

    // Loading / Errors
    errorLoadingData: "Error loading data",
    loading: "Loading…",

    // Navigation helpers
    back: "Back",
    view: "View",
} as const;
