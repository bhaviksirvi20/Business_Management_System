// Database operations using Supabase

class DatabaseManager {
    constructor() {
        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // Client operations
    async getClients() {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.CLIENTS)
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching clients:', error);
            this.showToast('Error fetching clients', 'error');
            return [];
        }
    }

    async addClient(clientData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.CLIENTS)
                .insert([{
                    client_name: clientData.clientName,
                    company_name: clientData.companyName,
                    contact_info: clientData.contactInfo,
                    service_name: clientData.serviceName,
                    service_cost: parseFloat(clientData.serviceCost),
                    added_date: new Date().toISOString().split('T')[0]
                }])
                .select();

            if (error) throw error;
            this.showToast('Client added successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error adding client:', error);
            this.showToast('Error adding client', 'error');
            throw error;
        }
    }

    async updateClient(id, clientData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.CLIENTS)
                .update({
                    client_name: clientData.clientName,
                    company_name: clientData.companyName,
                    contact_info: clientData.contactInfo,
                    service_name: clientData.serviceName,
                    service_cost: parseFloat(clientData.serviceCost)
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            this.showToast('Client updated successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error updating client:', error);
            this.showToast('Error updating client', 'error');
            throw error;
        }
    }

    async deleteClient(id) {
        try {
            const { error } = await this.supabase
                .from(TABLES.CLIENTS)
                .delete()
                .eq('id', id);

            if (error) throw error;
            this.showToast('Client deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting client:', error);
            this.showToast('Error deleting client', 'error');
            throw error;
        }
    }

    // Expense operations
    async getExpenses() {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.EXPENSES)
                .select(`
                    *,
                    clients (
                        client_name
                    )
                `)
                .order('expense_date', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching expenses:', error);
            this.showToast('Error fetching expenses', 'error');
            return [];
        }
    }

    async addExpense(expenseData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.EXPENSES)
                .insert([{
                    expense_date: expenseData.expenseDate,
                    expense_detail: expenseData.expenseDetail,
                    client_id: expenseData.clientId,
                    amount: parseFloat(expenseData.amount)
                }])
                .select();

            if (error) throw error;
            this.showToast('Expense added successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error adding expense:', error);
            this.showToast('Error adding expense', 'error');
            throw error;
        }
    }

    async updateExpense(id, expenseData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.EXPENSES)
                .update({
                    expense_date: expenseData.expenseDate,
                    expense_detail: expenseData.expenseDetail,
                    client_id: expenseData.clientId,
                    amount: parseFloat(expenseData.amount)
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            this.showToast('Expense updated successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error updating expense:', error);
            this.showToast('Error updating expense', 'error');
            throw error;
        }
    }

    async deleteExpense(id) {
        try {
            const { error } = await this.supabase
                .from(TABLES.EXPENSES)
                .delete()
                .eq('id', id);

            if (error) throw error;
            this.showToast('Expense deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting expense:', error);
            this.showToast('Error deleting expense', 'error');
            throw error;
        }
    }

    // Payment operations
    async getPayments() {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.PAYMENTS)
                .select(`
                    *,
                    clients (
                        client_name,
                        company_name,
                        contact_info,
                        service_name,
                        service_cost
                    )
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching payments:', error);
            this.showToast('Error fetching payments', 'error');
            return [];
        }
    }

    async addPayment(paymentData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.PAYMENTS)
                .insert([{
                    client_id: paymentData.clientId,
                    payment_status: paymentData.paymentStatus,
                    payment_date: paymentData.paymentDate || null,
                    pending_reason: paymentData.pendingReason || null
                }])
                .select();

            if (error) throw error;
            this.showToast('Payment record added successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error adding payment:', error);
            this.showToast('Error adding payment', 'error');
            throw error;
        }
    }

    async updatePayment(id, paymentData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.PAYMENTS)
                .update({
                    client_id: paymentData.clientId,
                    payment_status: paymentData.paymentStatus,
                    payment_date: paymentData.paymentDate || null,
                    pending_reason: paymentData.pendingReason || null
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            this.showToast('Payment updated successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error updating payment:', error);
            this.showToast('Error updating payment', 'error');
            throw error;
        }
    }

    async deletePayment(id) {
        try {
            const { error } = await this.supabase
                .from(TABLES.PAYMENTS)
                .delete()
                .eq('id', id);

            if (error) throw error;
            this.showToast('Payment deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting payment:', error);
            this.showToast('Error deleting payment', 'error');
            throw error;
        }
    }

    // Employee operations
    async getEmployees() {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.EMPLOYEES)
                .select(`
                    *,
                    clients (
                        client_name
                    )
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching employees:', error);
            this.showToast('Error fetching employees', 'error');
            return [];
        }
    }

    async addEmployee(employeeData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.EMPLOYEES)
                .insert([{
                    employee_name: employeeData.employeeName,
                    skills: employeeData.skills,
                    contact_info: employeeData.contactInfo,
                    client_work_handled: employeeData.clientWorkHandled
                }])
                .select();

            if (error) throw error;
            this.showToast('Employee added successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error adding employee:', error);
            this.showToast('Error adding employee', 'error');
            throw error;
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const { data, error } = await this.supabase
                .from(TABLES.EMPLOYEES)
                .update({
                    employee_name: employeeData.employeeName,
                    skills: employeeData.skills,
                    contact_info: employeeData.contactInfo,
                    client_work_handled: employeeData.clientWorkHandled
                })
                .eq('id', id)
                .select();

            if (error) throw error;
            this.showToast('Employee updated successfully', 'success');
            return data[0];
        } catch (error) {
            console.error('Error updating employee:', error);
            this.showToast('Error updating employee', 'error');
            throw error;
        }
    }

    async deleteEmployee(id) {
        try {
            const { error } = await this.supabase
                .from(TABLES.EMPLOYEES)
                .delete()
                .eq('id', id);

            if (error) throw error;
            this.showToast('Employee deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting employee:', error);
            this.showToast('Error deleting employee', 'error');
            throw error;
        }
    }

    // Dashboard statistics
    async getDashboardStats() {
        try {
            const [clients, expenses, payments] = await Promise.all([
                this.getClients(),
                this.getExpenses(),
                this.getPayments()
            ]);

            const totalIncome = payments
                .filter(p => p.payment_status === 'Paid')
                .reduce((sum, p) => sum + (p.clients?.service_cost || 0), 0);

            const totalExpenses = expenses
                .reduce((sum, e) => sum + (e.amount || 0), 0);

            const netProfit = totalIncome - totalExpenses;

            const activeClients = clients.length;

            // Project status counts (based on payment status)
            const currentProjects = payments.filter(p => p.payment_status === 'Pending').length;
            const pendingProjects = payments.filter(p => p.payment_status === 'Pending' && p.pending_reason).length;
            const completedProjects = payments.filter(p => p.payment_status === 'Paid').length;
            const cancelledProjects = 0; // You can add a cancelled status later

            return {
                totalIncome,
                totalExpenses,
                netProfit,
                activeClients,
                currentProjects,
                pendingProjects,
                completedProjects,
                cancelledProjects
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalIncome: 0,
                totalExpenses: 0,
                netProfit: 0,
                activeClients: 0,
                currentProjects: 0,
                pendingProjects: 0,
                completedProjects: 0,
                cancelledProjects: 0
            };
        }
    }

    // Utility method for showing toast notifications
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        // Set colors based on type
        switch (type) {
            case 'success':
                toast.className += ' bg-green-600 text-white';
                break;
            case 'error':
                toast.className += ' bg-red-600 text-white';
                break;
            case 'warning':
                toast.className += ' bg-yellow-600 text-white';
                break;
            default:
                toast.className += ' bg-blue-600 text-white';
        }

        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, TOAST_DURATION);
    }
}

// Initialize database manager
const db = new DatabaseManager();