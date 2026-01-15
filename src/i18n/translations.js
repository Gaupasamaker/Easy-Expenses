// Translations for EasyExpenses AI
// Languages: English (en), Spanish (es)

export const translations = {
    en: {
        // Common
        app_name: "EasyExpenses",
        loading: "Loading...",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        confirm: "Confirm",
        close: "Close",
        search: "Search",
        filter: "Filter",
        all: "All",

        // Auth
        sign_in: "Sign In",
        sign_out: "Sign Out",
        sign_in_google: "Sign in with Google",
        signed_in_as: "Signed in as",

        // Navigation
        trips: "Trips",
        settings: "Settings",
        analytics: "Analytics",

        // Trips
        my_trips: "My Trips",
        no_trips: "No trips yet",
        no_trips_desc: "Start tracking your travel expenses by creating your first trip.",
        create_trip: "Create New Trip",
        load_demo: "Load Demo Data",
        creating: "Creating...",
        active: "Active",
        archived: "Archived",
        archive: "Archive",
        activate: "Activate",
        no_active_trips: "No active trips found.",
        no_archived_trips: "No archived trips found.",
        budget_spent: "Budget / Spent",
        delete_trip: "Delete Trip",
        delete_trip_confirm: "Are you sure you want to delete this trip? This action cannot be undone and all expenses will be lost.",

        // Trip Form
        trip_name: "Trip Name",
        trip_name_placeholder: "e.g., Summer Vacation 2026",
        destination: "Destination",
        destination_placeholder: "e.g., Paris, France",
        description: "Description",
        description_placeholder: "Optional notes about your trip...",
        start_date: "Start Date",
        end_date: "End Date",
        budget: "Budget",

        // Expenses
        expenses: "Expenses",
        add_expense: "Add Expense",
        no_expenses: "No expenses yet",
        no_expenses_desc: "Add your first expense or scan a receipt.",
        scan_receipt: "Scan Receipt",
        manual_entry: "Manual Entry",
        expense_name: "Name",
        expense_amount: "Amount",
        expense_category: "Category",
        expense_date: "Date",
        expense_notes: "Notes",
        edit_expense: "Edit Expense",
        delete_expense: "Delete Expense",
        delete_expense_confirm: "Are you sure you want to delete this expense?",

        // Categories
        category_food: "Food & Dining",
        category_transport: "Transportation",
        category_accommodation: "Accommodation",
        category_entertainment: "Entertainment",
        category_shopping: "Shopping",
        category_health: "Health",
        category_other: "Other",

        // Scanner
        scanning: "Scanning...",
        scan_success: "Receipt scanned successfully!",
        scan_error: "Could not read the receipt. Please try again or enter manually.",
        take_photo: "Take Photo",
        upload_image: "Upload Image",

        // Analytics
        total_spent: "Total Spent",
        remaining_budget: "Remaining",
        over_budget: "Over Budget",
        budget_used: "of budget used",
        spending_by_category: "Spending by Category",
        daily_spending: "Daily Spending",

        // Budget Alerts
        budget_warning: "You've used {percent}% of your budget!",
        budget_exceeded: "You've exceeded your budget by {amount}!",

        // Settings
        profile: "Profile",
        currency: "Currency",
        currency_desc: "This affects how amounts are displayed throughout the app.",
        language: "Language",
        language_desc: "Choose your preferred language.",
        appearance: "Appearance",
        dark_mode: "Dark Mode",
        light_mode: "Light Mode",
        system_mode: "System",
        data_management: "Data Management",
        sync_totals: "Sync Trip Totals",
        sync_totals_desc: "Use this if your dashboard amounts don't match your expenses.",
        synced_trips: "Synced totals for {count} trips.",
        debug: "Debug",
        project_id: "Project ID",
        test_permissions: "Test Database Permissions",
        test_permissions_desc: "This creates and deletes a test document to verify write permissions.",
        about: "About",
        version: "Version",
        build: "Build",

        // Export
        export: "Export",
        export_excel: "Export to Excel",
        export_zip: "Download ZIP",
        exporting: "Exporting...",

        // Errors
        error: "Error",
        permission_denied: "Permission Denied: Check your Firestore Security Rules.",
        network_error: "Network error. Please check your connection.",

        // Time
        today: "Today",
        yesterday: "Yesterday",
        this_week: "This Week",
        this_month: "This Month",
    },

    es: {
        // Common
        app_name: "EasyExpenses",
        loading: "Cargando...",
        cancel: "Cancelar",
        save: "Guardar",
        delete: "Eliminar",
        edit: "Editar",
        confirm: "Confirmar",
        close: "Cerrar",
        search: "Buscar",
        filter: "Filtrar",
        all: "Todo",

        // Auth
        sign_in: "Iniciar Sesión",
        sign_out: "Cerrar Sesión",
        sign_in_google: "Iniciar sesión con Google",
        signed_in_as: "Conectado como",

        // Navigation
        trips: "Viajes",
        settings: "Ajustes",
        analytics: "Estadísticas",

        // Trips
        my_trips: "Mis Viajes",
        no_trips: "Sin viajes",
        no_trips_desc: "Empieza a registrar tus gastos de viaje creando tu primer viaje.",
        create_trip: "Crear Nuevo Viaje",
        load_demo: "Cargar Datos Demo",
        creating: "Creando...",
        active: "Activo",
        archived: "Archivado",
        archive: "Archivar",
        activate: "Activar",
        no_active_trips: "No hay viajes activos.",
        no_archived_trips: "No hay viajes archivados.",
        budget_spent: "Presupuesto / Gastado",
        delete_trip: "Eliminar Viaje",
        delete_trip_confirm: "¿Estás seguro de que quieres eliminar este viaje? Esta acción no se puede deshacer y se perderán todos los gastos.",

        // Trip Form
        trip_name: "Nombre del Viaje",
        trip_name_placeholder: "ej., Vacaciones de Verano 2026",
        destination: "Destino",
        destination_placeholder: "ej., París, Francia",
        description: "Descripción",
        description_placeholder: "Notas opcionales sobre tu viaje...",
        start_date: "Fecha de Inicio",
        end_date: "Fecha de Fin",
        budget: "Presupuesto",

        // Expenses
        expenses: "Gastos",
        add_expense: "Añadir Gasto",
        no_expenses: "Sin gastos",
        no_expenses_desc: "Añade tu primer gasto o escanea un recibo.",
        scan_receipt: "Escanear Recibo",
        manual_entry: "Entrada Manual",
        expense_name: "Nombre",
        expense_amount: "Importe",
        expense_category: "Categoría",
        expense_date: "Fecha",
        expense_notes: "Notas",
        edit_expense: "Editar Gasto",
        delete_expense: "Eliminar Gasto",
        delete_expense_confirm: "¿Estás seguro de que quieres eliminar este gasto?",

        // Categories
        category_food: "Comida y Restaurantes",
        category_transport: "Transporte",
        category_accommodation: "Alojamiento",
        category_entertainment: "Ocio",
        category_shopping: "Compras",
        category_health: "Salud",
        category_other: "Otros",

        // Scanner
        scanning: "Escaneando...",
        scan_success: "¡Recibo escaneado con éxito!",
        scan_error: "No se pudo leer el recibo. Inténtalo de nuevo o introduce los datos manualmente.",
        take_photo: "Tomar Foto",
        upload_image: "Subir Imagen",

        // Analytics
        total_spent: "Total Gastado",
        remaining_budget: "Restante",
        over_budget: "Excedido",
        budget_used: "del presupuesto usado",
        spending_by_category: "Gasto por Categoría",
        daily_spending: "Gasto Diario",

        // Budget Alerts
        budget_warning: "¡Has usado el {percent}% de tu presupuesto!",
        budget_exceeded: "¡Has excedido tu presupuesto en {amount}!",

        // Settings
        profile: "Perfil",
        currency: "Moneda",
        currency_desc: "Esto afecta cómo se muestran los importes en toda la app.",
        language: "Idioma",
        language_desc: "Elige tu idioma preferido.",
        appearance: "Apariencia",
        dark_mode: "Modo Oscuro",
        light_mode: "Modo Claro",
        system_mode: "Sistema",
        data_management: "Gestión de Datos",
        sync_totals: "Sincronizar Totales",
        sync_totals_desc: "Usa esto si los importes del dashboard no coinciden con tus gastos.",
        synced_trips: "Sincronizados los totales de {count} viajes.",
        debug: "Depuración",
        project_id: "ID del Proyecto",
        test_permissions: "Probar Permisos",
        test_permissions_desc: "Esto crea y elimina un documento de prueba para verificar los permisos de escritura.",
        about: "Acerca de",
        version: "Versión",
        build: "Build",

        // Export
        export: "Exportar",
        export_excel: "Exportar a Excel",
        export_zip: "Descargar ZIP",
        exporting: "Exportando...",

        // Errors
        error: "Error",
        permission_denied: "Permiso Denegado: Revisa las reglas de seguridad de Firestore.",
        network_error: "Error de red. Comprueba tu conexión.",

        // Time
        today: "Hoy",
        yesterday: "Ayer",
        this_week: "Esta Semana",
        this_month: "Este Mes",
    }
};

export default translations;
