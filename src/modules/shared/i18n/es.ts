export default {
    // App & Branding
    appTitle: "Bobek — Panel Administrativo",

    // Navigation / Sections
    dashboard: "Tablero",
    customers: "Clientes",
    orders: "Pedidos",
    products: "Productos",

    // Dashboard KPIs / Panels
    newOrder: "+ Nuevo pedido",
    pendingOrders: "Pedidos pendientes",
    pendingAmount: "Monto pendiente",
    deliveredToday: "Entregados hoy",
    revenue7d: "Ingresos (7d)",
    topProducts: "Productos top (30d)",
    noData: "Sin datos.",
    debtTitle: "Clientes con mayor deuda",

    // Common Entities / Fields
    actions: "Acciones",
    address: "Dirección",
    balance: "Saldo",
    balanceDebt: "Saldo (deuda)",
    created: "Creado",
    createdAt: "Creado",
    date: "Fecha",
    edit: "Editar",
    itemSingular: "ítem",
    items: "Ítems",
    line: "Línea",
    lineTotal: "Subtotal",
    name: "Nombre",
    price: "Precio",
    qty: "Cant.",
    status: "Estado",
    total: "Total",
    unit: "Unidad",
    unitPrice: "Precio unitario",

    // Status Values
    delivered: "Entregado",
    toDeliver: "A entregar",
    cancelled: "Cancelado",

    // Customers CRUD
    customer: "Cliente",
    newCustomer: "+ Nuevo cliente",
    newCustomerTitle: "Nuevo cliente",
    editCustomerTitle: "Editar cliente",
    noCustomers: "Aún no hay clientes.",
    customerCreated: "Cliente creado",
    customerUpdated: "Cliente actualizado",
    failedCreateCustomer: "No se pudo crear el cliente",
    failedUpdateCustomer: "No se pudo actualizar el cliente",

    // Orders CRUD
    order: "Pedido",
    createOrder: "Crear pedido",
    noOrdersYet: "Aún no hay pedidos.",
    orderCreated: "Pedido creado",
    orderUpdated: "Pedido actualizado",
    orderCancelled: "Pedido cancelado",
    orderDelivered: "Pedido marcado como entregado",
    orderBackToPending: "Pedido vuelto a pendiente",
    orderNotFound: "Pedido no encontrado",
    failedUpdateOrderStatus: "No se pudo actualizar el estado del pedido",
    failedCancelOrder: "No se pudo cancelar el pedido",
    confirmCancelOrder: "¿Cancelar este pedido?",

    // Products CRUD
    product: "Producto",
    newProduct: "+ Nuevo producto",
    newProductTitle: "Nuevo producto",
    editProductTitle: "Editar producto",
    noProducts: "Aún no hay productos.",
    productCreated: "Producto creado",
    productUpdated: "Producto actualizado",
    productActivated: "Producto activado",
    productDeactivated: "Producto desactivado",
    failedCreateProduct: "No se pudo crear el producto",
    failedUpdateProduct: "No se pudo actualizar el producto",
    failedToggleProduct: "No se pudo cambiar el estado del producto",
    activate: "Activar",
    deactivate: "Desactivar",
    active: "Activo",
    inactive: "Inactivo",
    showInactive: "Ver inactivos",
    hideInactive: "Ocultar inactivos",
    revenueLast20: "Ingresos (últimas 20 filas)",
    unitsLast20: "Unidades (últimas 20 filas)",
    updated: "Actualizado",

    // Forms / Buttons / Generic UI
    addItem: "+ Agregar ítem",
    amountPaid: "monto pagado",
    cancel: "Cancelar",
    confirm: "Confirmar",
    couldNotSave: "No se pudo guardar. Intenta de nuevo.",
    currentDebt: "Deuda actual",
    new: "+ Nuevo",
    noItems: "Sin ítems.",
    payment: "Pago",
    removeLine: "Eliminar línea",
    save: "Guardar",
    saveChanges: "Guardar cambios",
    saving: "Guardando…",
    showLess: "Mostrar menos",
    showMoreN: "+{n} más",
    markDelivered: "Marcar como entregado",
    markPending: "Volver a pendiente",
    select: "Seleccionar…",

    // Search / Topbar / Misc
    openMenu: "Abrir menú",
    search: "Buscar",
    clear: "Limpiar",
    searching: "Buscando…",
    noResults: "Sin resultados",

    // Loading / Errors
    errorLoadingData: "Error al cargar datos",
    loading: "Cargando…",

    // Navigation helpers
    back: "Atrás",
    view: "Ver",
} as const;
