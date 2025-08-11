"use client"

import type React from "react"

import { useMemo, useState, useEffect, useRef } from "react"
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  BriefcaseBusiness,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Charts
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

type ProjectStatus = "Current" | "Pending" | "Completed" | "Cancelled"
type EmployeeStatus = "Active" | "On Leave" | "Contract" | "Terminated"

type Client = {
  id: number
  client_name: string
  company_name?: string
  contact_info?: string
  service_name?: string
  service_cost?: number
  added_date?: string // YYYY-MM-DD
  project_status?: ProjectStatus
  payment_status?: "Paid" | "Unpaid"
}

type Expense = {
  id: number
  expense_date: string // YYYY-MM-DD
  expense_detail: string
  amount: number
  expense_client_id?: number | null
}

type Employee = {
  id: number
  employee_name: string
  position: string
  department?: string
  salary?: number
  join_date?: string // YYYY-MM-DD
  status?: EmployeeStatus
  contact_info?: string
}

const statusColors: Record<ProjectStatus, string> = {
  Current: "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30",
  Pending: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30",
  Completed: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30",
  Cancelled: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30",
}

const pieColors = ["#8b5cf6", "#f59e0b", "#22c55e", "#ef4444"]

function formatCurrency(n: number) {
  return "₹" + (n || 0).toLocaleString()
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Page() {
  // Initial realistic sample data (session-only)
  const [clients, setClients] = useState<Client[]>([
    {
      id: 101,
      client_name: "Arjun Sharma",
      company_name: "Sharma Tech",
      contact_info: "arjun@example.com",
      service_name: "Web Development",
      service_cost: 180000,
      added_date: isoMonthsAgo(2, 5),
      project_status: "Current",
      payment_status: "Unpaid",
    },
    {
      id: 102,
      client_name: "Priya Verma",
      company_name: "Verma Designs",
      contact_info: "priya@example.com",
      service_name: "Branding",
      service_cost: 75000,
      added_date: isoMonthsAgo(5, 12),
      project_status: "Completed",
      payment_status: "Paid",
    },
    {
      id: 103,
      client_name: "Karan Mehta",
      company_name: "Mehta Foods",
      contact_info: "karan@example.com",
      service_name: "eCommerce Setup",
      service_cost: 220000,
      added_date: isoMonthsAgo(1, 15),
      project_status: "Pending",
      payment_status: "Unpaid",
    },
    {
      id: 104,
      client_name: "Anita Singh",
      company_name: "Singh Realty",
      contact_info: "anita@example.com",
      service_name: "SEO & Content",
      service_cost: 98000,
      added_date: isoMonthsAgo(3, 22),
      project_status: "Cancelled",
      payment_status: "Unpaid",
    },
    {
      id: 105,
      client_name: "Rahul Jain",
      company_name: "RJ Finserve",
      contact_info: "rahul@example.com",
      service_name: "Mobile App",
      service_cost: 310000,
      added_date: isoMonthsAgo(0, 3),
      project_status: "Current",
      payment_status: "Unpaid",
    },
  ])

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 201,
      expense_date: isoMonthsAgo(0, 2),
      expense_detail: "Cloud Hosting",
      amount: 12000,
      expense_client_id: 101,
    },
    {
      id: 202,
      expense_date: isoMonthsAgo(1, 18),
      expense_detail: "Design Tools Subscription",
      amount: 4200,
      expense_client_id: null,
    },
    {
      id: 203,
      expense_date: isoMonthsAgo(2, 12),
      expense_detail: "Domain Renewals",
      amount: 3200,
      expense_client_id: null,
    },
    {
      id: 204,
      expense_date: isoMonthsAgo(3, 9),
      expense_detail: "QA Devices",
      amount: 26500,
      expense_client_id: 105,
    },
    {
      id: 205,
      expense_date: isoMonthsAgo(5, 24),
      expense_detail: "Marketing Campaign",
      amount: 18500,
      expense_client_id: 103,
    },
  ])

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 301,
      employee_name: "Neha Gupta",
      position: "Frontend Engineer",
      department: "Development",
      salary: 780000,
      join_date: isoMonthsAgo(14, 1),
      status: "Active",
      contact_info: "neha.g@example.com",
    },
    {
      id: 302,
      employee_name: "Vikram Rao",
      position: "UI/UX Designer",
      department: "Design",
      salary: 690000,
      join_date: isoMonthsAgo(8, 13),
      status: "Active",
      contact_info: "vikram.r@example.com",
    },
    {
      id: 303,
      employee_name: "Aisha Khan",
      position: "Marketing Manager",
      department: "Marketing",
      salary: 720000,
      join_date: isoMonthsAgo(20, 7),
      status: "On Leave",
      contact_info: "aisha.k@example.com",
    },
    {
      id: 304,
      employee_name: "Rohan Patel",
      position: "Sales Executive",
      department: "Sales",
      salary: 540000,
      join_date: isoMonthsAgo(5, 5),
      status: "Contract",
      contact_info: "rohan.p@example.com",
    },
  ])

  const [activeTab, setActiveTab] = useState<"dashboard" | "clients" | "expenses" | "payments" | "employees">(
    "dashboard",
  )

  // Filters
  const [clientSearch, setClientSearch] = useState("")
  const [clientStatus, setClientStatus] = useState<ProjectStatus | "">("")
  const [expenseSearch, setExpenseSearch] = useState("")
  const [expenseFrom, setExpenseFrom] = useState("")
  const [expenseTo, setExpenseTo] = useState("")
  const [expenseClientId, setExpenseClientId] = useState<string>("")
  const [expenseMin, setExpenseMin] = useState<string>("")
  const [expenseMax, setExpenseMax] = useState<string>("")
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [employeeDept, setEmployeeDept] = useState<string>("")
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus | "">("")

  // Modals and editing
  const [openClientDialog, setOpenClientDialog] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Derived metrics
  const totalIncome = useMemo(() => clients.reduce((sum, c) => sum + (c.service_cost || 0), 0), [clients])
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + (e.amount || 0), 0), [expenses])
  const netProfit = totalIncome - totalExpenses

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    clients.forEach((c) => {
      const key = c.project_status || "Current"
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [clients])

  // Charts data
  const revenueExpenseSeries = useMemo(() => {
    // Last 6 months including current
    const points: { month: string; revenue: number; expenses: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const label = d.toLocaleString("en-IN", { month: "short" })
      const rev = clients
        .filter((c) => c.added_date && isSameMonth(c.added_date!, d))
        .reduce((s, c) => s + (c.service_cost || 0), 0)
      const exp = expenses
        .filter((e) => e.expense_date && isSameMonth(e.expense_date!, d))
        .reduce((s, e) => s + (e.amount || 0), 0)
      points.push({ month: label, revenue: rev, expenses: exp })
    }
    return points
  }, [clients, expenses])

  const statusPie = useMemo(() => {
    const data = (["Current", "Pending", "Completed", "Cancelled"] as ProjectStatus[]).map((s) => ({
      name: s,
      value: statusCounts[s] || 0,
    }))
    return data
  }, [statusCounts])

  // Filtered collections
  const filteredClients = useMemo(() => {
    const s = clientSearch.trim().toLowerCase()
    return clients.filter((c) => {
      const matchesText =
        !s ||
        [c.client_name, c.company_name, c.service_name, c.contact_info]
          .map((v) => (v || "").toLowerCase())
          .some((v) => v.includes(s))
      const matchesStatus = !clientStatus || c.project_status === clientStatus
      return matchesText && matchesStatus
    })
  }, [clients, clientSearch, clientStatus])

  const filteredExpenses = useMemo(() => {
    const s = expenseSearch.trim().toLowerCase()
    const from = expenseFrom ? new Date(expenseFrom) : null
    const to = expenseTo ? new Date(expenseTo) : null
    const min = expenseMin ? Number.parseFloat(expenseMin) : null
    const max = expenseMax ? Number.parseFloat(expenseMax) : null
    return expenses.filter((e) => {
      const matchesText = !s || (e.expense_detail || "").toLowerCase().includes(s)
      const d = e.expense_date ? new Date(e.expense_date) : null
      const afterFrom = !from || (d && d >= from)
      const beforeTo = !to || (d && d <= to)
      const byClient = !expenseClientId || String(e.expense_client_id || "") === expenseClientId
      const amt = e.amount || 0
      const aboveMin = min === null || amt >= min
      const belowMax = max === null || amt <= max
      return matchesText && afterFrom && beforeTo && byClient && aboveMin && belowMax
    })
  }, [expenses, expenseSearch, expenseFrom, expenseTo, expenseClientId, expenseMin, expenseMax])

  const filteredEmployees = useMemo(() => {
    const s = employeeSearch.trim().toLowerCase()
    return employees.filter((emp) => {
      const matchesText =
        !s ||
        [emp.employee_name, emp.position, emp.department, emp.contact_info]
          .map((v) => (v || "").toLowerCase())
          .some((v) => v.includes(s))
      const matchesDept = !employeeDept || emp.department === employeeDept
      const matchesStatus = !employeeStatus || emp.status === employeeStatus
      return matchesText && matchesDept && matchesStatus
    })
  }, [employees, employeeDept, employeeSearch, employeeStatus])

  // Summary for Expense aside
  const monthlyExpenseThisMonth = useMemo(() => {
    const d = new Date()
    return expenses
      .filter((e) => e.expense_date && isSameMonth(e.expense_date, d))
      .reduce((s, e) => s + (e.amount || 0), 0)
  }, [expenses])

  const lastMonthExpense = useMemo(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return expenses
      .filter((e) => e.expense_date && isSameMonth(e.expense_date, d))
      .reduce((s, e) => s + (e.amount || 0), 0)
  }, [expenses])

  const averageMonthlyExpense = useMemo(() => {
    // average over 12 months
    return Math.round(totalExpenses / 12)
  }, [totalExpenses])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "1") {
          e.preventDefault()
          setActiveTab("dashboard")
        } else if (e.key === "2") {
          e.preventDefault()
          setActiveTab("clients")
        } else if (e.key === "3") {
          e.preventDefault()
          setActiveTab("expenses")
        } else if (e.key.toLowerCase() === "n") {
          e.preventDefault()
          if (activeTab === "clients") openClient()
          else if (activeTab === "expenses") openExpense()
          else if (activeTab === "employees") openEmployee()
        } else if (e.key.toLowerCase() === "s") {
          e.preventDefault()
          handleExport()
        }
      }
      if (e.key === "Escape") {
        setOpenClientDialog(false)
        setOpenExpenseDialog(false)
        setOpenEmployeeDialog(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [activeTab])

  // Actions: Clients
  function openClient(c?: Client) {
    setEditingClient(c || null)
    setOpenClientDialog(true)
  }
  function saveClient(data: Omit<Client, "id">) {
    if (editingClient) {
      const updated = clients.map((c) => (c.id === editingClient.id ? { ...editingClient, ...data } : c))
      setClients(updated)
      toast({ description: "Client updated successfully." })
    } else {
      const newClient: Client = { id: Date.now(), ...data }
      setClients((prev) => [...prev, newClient])
      toast({ description: "Client added successfully." })
    }
    setOpenClientDialog(false)
    setEditingClient(null)
  }
  function deleteClient(id: number) {
    if (!confirm("Delete this client?")) return
    setClients((prev) => prev.filter((c) => c.id !== id))
    // Also detach from expenses
    setExpenses((prev) => prev.map((e) => (e.expense_client_id === id ? { ...e, expense_client_id: null } : e)))
    toast({ description: "Client deleted." })
  }

  // Actions: Expenses
  function openExpense(e?: Expense) {
    setEditingExpense(e || null)
    setOpenExpenseDialog(true)
  }
  function saveExpense(data: Omit<Expense, "id">) {
    if (editingExpense) {
      const updated = expenses.map((e) => (e.id === editingExpense.id ? { ...editingExpense, ...data } : e))
      setExpenses(updated)
      toast({ description: "Expense updated successfully." })
    } else {
      const newExpense: Expense = { id: Date.now(), ...data }
      setExpenses((prev) => [...prev, newExpense])
      toast({ description: "Expense added successfully." })
    }
    setOpenExpenseDialog(false)
    setEditingExpense(null)
  }
  function deleteExpenseById(id: number) {
    if (!confirm("Delete this expense?")) return
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    toast({ description: "Expense deleted." })
  }

  // Actions: Employees
  function openEmployee(emp?: Employee) {
    setEditingEmployee(emp || null)
    setOpenEmployeeDialog(true)
  }
  function saveEmployee(data: Omit<Employee, "id">) {
    if (editingEmployee) {
      const updated = employees.map((e) => (e.id === editingEmployee.id ? { ...editingEmployee, ...data } : e))
      setEmployees(updated)
      toast({ description: "Employee updated successfully." })
    } else {
      const newEmp: Employee = { id: Date.now(), ...data }
      setEmployees((prev) => [...prev, newEmp])
      toast({ description: "Employee added successfully." })
    }
    setOpenEmployeeDialog(false)
    setEditingEmployee(null)
  }
  function deleteEmployeeById(id: number) {
    if (!confirm("Delete this employee?")) return
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    toast({ description: "Employee deleted." })
  }

  // Import/Export (session-only)
  function handleExport() {
    const data = {
      clients,
      expenses,
      employees,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `businesshub-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ description: "Data exported." })
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result || "{}"))
        if (Array.isArray(json.clients)) setClients(json.clients)
        if (Array.isArray(json.expenses)) setExpenses(json.expenses)
        if (Array.isArray(json.employees)) setEmployees(json.employees)
        toast({ description: "Data imported." })
      } catch (err: any) {
        toast({ description: "Import failed. Invalid file.", variant: "destructive" })
      }
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
    reader.readAsText(file)
  }

  // Stats: Employees
  const totalEmployees = filteredEmployees.length
  const avgSalary = Math.round(
    filteredEmployees.reduce((s, e) => s + (e.salary || 0), 0) / Math.max(1, filteredEmployees.length),
  )
  const departmentCount = new Set(filteredEmployees.map((e) => e.department || "")).size
  const activeRate = Math.round(
    (filteredEmployees.filter((e) => e.status === "Active").length / Math.max(1, filteredEmployees.length)) * 100,
  )

  // Payments (derived)
  const payments = useMemo(() => {
    return clients.map((c) => {
      const status: "Paid" | "Unpaid" | "Cancelled" =
        c.project_status === "Completed"
          ? "Paid"
          : c.project_status === "Cancelled"
            ? "Cancelled"
            : ((c.payment_status || "Unpaid") as any)
      const dueDate = c.added_date ? addDays(c.added_date, 30) : todayISO()
      return {
        id: c.id,
        client: c.client_name,
        service: c.service_name || "N/A",
        amount: c.service_cost || 0,
        status,
        dueDate,
      }
    })
  }, [clients])

  function markPaymentPaid(clientId: number) {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              payment_status: "Paid",
              project_status: c.project_status === "Pending" ? "Current" : c.project_status,
            }
          : c,
      ),
    )
    toast({ description: "Payment marked as Paid." })
  }

  const pageTitle =
    activeTab === "dashboard"
      ? "Dashboard"
      : activeTab === "clients"
        ? "Client Management"
        : activeTab === "expenses"
          ? "Expense Management"
          : activeTab === "payments"
            ? "Payment Management"
            : "Employee Management"

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0b0b12_0%,#0f0f19_100%)] text-zinc-100">
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="border-zinc-800/60 bg-zinc-950/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40 sticky top-0 z-10 border-b lg:border-b-0 lg:border-r">
          <div className="px-5 py-5 border-b border-zinc-800/60">
            <div className="text-xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,#a78bfa_0%,#f472b6_100%)]">
                BusinessHub Pro
              </span>
            </div>
            <div className="text-[11px] uppercase tracking-wide text-zinc-400 mt-1">Professional Edition</div>
          </div>

          <nav className="p-3 space-y-1">
            <SidebarButton
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <SidebarButton
              icon={<Users size={18} />}
              label="Clients"
              active={activeTab === "clients"}
              onClick={() => setActiveTab("clients")}
            />
            <SidebarButton
              icon={<Receipt size={18} />}
              label="Expenses"
              active={activeTab === "expenses"}
              onClick={() => setActiveTab("expenses")}
            />
            <SidebarButton
              icon={<CreditCard size={18} />}
              label="Client Payments"
              active={activeTab === "payments"}
              onClick={() => setActiveTab("payments")}
            />
            <SidebarButton
              icon={<BriefcaseBusiness size={18} />}
              label="Employees"
              active={activeTab === "employees"}
              onClick={() => setActiveTab("employees")}
            />
          </nav>

          <div className="mt-auto hidden lg:block p-4 border-t border-zinc-800/60">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-200 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Active (No storage)
            </div>
            <div className="text-[10px] text-zinc-500 mt-2">No Backend • No Local Storage • Session-only</div>
          </div>
        </aside>

        {/* Main */}
        <main className="p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#fff_0%,#a1a1aa_100%)]">
                {pageTitle}
              </h1>
              <p className="text-sm text-zinc-400">
                Premium Business Management with Dark UI, Charts, and Session Data
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="secondary"
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                onClick={handleImportClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </header>

          {/* Sections */}
          {activeTab === "dashboard" && (
            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  title="Total Income"
                  value={formatCurrency(totalIncome)}
                  gradient="from-violet-400 to-emerald-400"
                />
                <MetricCard
                  title="Total Expenses"
                  value={formatCurrency(totalExpenses)}
                  gradient="from-rose-400 to-orange-400"
                />
                <MetricCard
                  title="Net Profit"
                  value={formatCurrency(netProfit)}
                  gradient="from-fuchsia-400 to-cyan-400"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <MiniStat title="Current Projects" value={String(statusCounts["Current"] || 0)} />
                <MiniStat title="Pending Projects" value={String(statusCounts["Pending"] || 0)} />
                <MiniStat title="Completed Projects" value={String(statusCounts["Completed"] || 0)} />
                <MiniStat title="Cancelled Projects" value={String(statusCounts["Cancelled"] || 0)} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-zinc-800/60 bg-zinc-950/40">
                  <CardHeader>
                    <CardTitle>Revenue vs Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[320px]">
                    <ChartContainer
                      className="h-full w-full"
                      config={{
                        revenue: { label: "Revenue", color: "hsl(262.1 83.3% 57.8%)" },
                        expenses: { label: "Expenses", color: "hsl(346.8 77.2% 49.8%)" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueExpenseSeries}>
                          <CartesianGrid stroke="hsl(240 4% 16%)" strokeDasharray="3 3" />
                          <XAxis dataKey="month" stroke="hsl(240 5% 64.9%)" />
                          <YAxis stroke="hsl(240 5% 64.9%)" />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(262.1 83.3% 57.8%)"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="hsl(346.8 77.2% 49.8%)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <ChartLegend content={<ChartLegendContent />} />
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800/60 bg-zinc-950/40">
                  <CardHeader>
                    <CardTitle>Project Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[320px]">
                    <ChartContainer
                      className="h-full w-full"
                      config={{
                        Current: { label: "Current", color: "#8b5cf6" },
                        Pending: { label: "Pending", color: "#f59e0b" },
                        Completed: { label: "Completed", color: "#22c55e" },
                        Cancelled: { label: "Cancelled", color: "#ef4444" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Tooltip content={<ChartTooltipContent />} />
                          <Pie
                            data={statusPie}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                          >
                            {statusPie.map((_, i) => (
                              <Cell key={i} fill={pieColors[i % pieColors.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {statusPie.map((s, i) => (
                          <span key={s.name} className="text-xs text-zinc-300 inline-flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-sm"
                              style={{ background: pieColors[i % pieColors.length] }}
                            />
                            {s.name}: {s.value}
                          </span>
                        ))}
                      </div>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {activeTab === "clients" && (
            <section className="space-y-6">
              <Card className="border-zinc-800/60 bg-zinc-950/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Client Management</CardTitle>
                  <Button
                    className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90"
                    onClick={() => openClient()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                    <Input
                      placeholder="Search clients by name/company..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="bg-zinc-900 border-zinc-800"
                    />
                    <Select value={clientStatus} onValueChange={(v: any) => setClientStatus(v)}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.length === 0 ? (
                      <EmptyState title="No clients found." subtitle="Add a client or adjust filters." />
                    ) : (
                      filteredClients.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 hover:shadow-lg hover:shadow-black/20 transition"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-base font-semibold">{c.client_name || "N/A"}</div>
                              <div className="text-sm text-zinc-400">{c.company_name || "—"}</div>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wide ${statusColors[c.project_status || "Current"]}`}
                            >
                              {c.project_status || "Current"}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="space-y-1">
                              <div className="text-zinc-500 text-[11px] uppercase">Contact</div>
                              <div>{c.contact_info || "—"}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-zinc-500 text-[11px] uppercase">Service</div>
                              <div>{c.service_name || "—"}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-zinc-500 text-[11px] uppercase">Cost</div>
                              <div className="font-medium text-violet-300">{formatCurrency(c.service_cost || 0)}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-zinc-500 text-[11px] uppercase">Date</div>
                              <div>{c.added_date ? formatDateSafe(c.added_date) : "—"}</div>
                            </div>
                          </div>

                          <div className="mt-3 flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              className="h-8 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                              onClick={() => openClient(c)}
                            >
                              <Edit3 className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="destructive" className="h-8" onClick={() => deleteClient(c.id)}>
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800/60 bg-zinc-950/40">
                <CardHeader>
                  <CardTitle>Client Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatPill label="Active Clients" value={String(clients.length)} />
                    <StatPill label="Total Revenue" value={formatCurrency(totalIncome)} />
                    <StatPill
                      label="Average Project Value"
                      value={clients.length ? formatCurrency(Math.round(totalIncome / clients.length)) : "₹0"}
                    />
                    <StatPill
                      label="Unpaid Invoices"
                      value={String(
                        clients.filter(
                          (c) => (c.payment_status || "Unpaid") === "Unpaid" && c.project_status !== "Cancelled",
                        ).length,
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === "expenses" && (
            <section className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <Card className="border-zinc-800/60 bg-zinc-950/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Expense Management</CardTitle>
                    <Button
                      className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90"
                      onClick={() => openExpense()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-6">
                      <Input
                        placeholder="Search by detail..."
                        value={expenseSearch}
                        onChange={(e) => setExpenseSearch(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 md:col-span-2"
                      />
                      <Input
                        type="date"
                        value={expenseFrom}
                        onChange={(e) => setExpenseFrom(e.target.value)}
                        className="bg-zinc-900 border-zinc-800"
                        aria-label="From date"
                      />
                      <Input
                        type="date"
                        value={expenseTo}
                        onChange={(e) => setExpenseTo(e.target.value)}
                        className="bg-zinc-900 border-zinc-800"
                        aria-label="To date"
                      />
                      <Select value={expenseClientId} onValueChange={(v) => setExpenseClientId(v)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-800">
                          <SelectValue placeholder="All clients" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                          <SelectItem value="">All clients</SelectItem>
                          {clients.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.client_name}
                              {c.company_name ? ` (${c.company_name})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={expenseMin}
                        onChange={(e) => setExpenseMin(e.target.value)}
                        className="bg-zinc-900 border-zinc-800"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={expenseMax}
                        onChange={(e) => setExpenseMax(e.target.value)}
                        className="bg-zinc-900 border-zinc-800"
                      />
                    </div>

                    <div className="mt-4 rounded-xl border border-zinc-800 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-zinc-950/60">
                          <TableRow>
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400">Detail</TableHead>
                            <TableHead className="text-zinc-400">Client</TableHead>
                            <TableHead className="text-zinc-400">Amount</TableHead>
                            <TableHead className="text-zinc-400">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredExpenses.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-zinc-500 py-10">
                                No expenses found. Add an expense or adjust filters.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredExpenses.map((e) => {
                              const client = clients.find((c) => c.id === e.expense_client_id)
                              return (
                                <TableRow key={e.id} className="hover:bg-zinc-900/40">
                                  <TableCell>{formatDateSafe(e.expense_date)}</TableCell>
                                  <TableCell className="font-medium">{e.expense_detail}</TableCell>
                                  <TableCell>{client ? client.client_name : "General"}</TableCell>
                                  <TableCell className="text-rose-300 font-semibold">
                                    {formatCurrency(e.amount)}
                                  </TableCell>
                                  <TableCell className="space-x-2">
                                    <Button
                                      variant="secondary"
                                      className="h-8 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                                      onClick={() => openExpense(e)}
                                    >
                                      <Edit3 className="h-3.5 w-3.5 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="h-8"
                                      onClick={() => deleteExpenseById(e.id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800/60 bg-zinc-950/40">
                  <CardHeader>
                    <CardTitle>Expense Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SummaryRow label="This Month" value={formatCurrency(monthlyExpenseThisMonth)} />
                    <SummaryRow label="Last Month" value={formatCurrency(lastMonthExpense)} />
                    <SummaryRow label="Average Monthly" value={formatCurrency(averageMonthlyExpense)} />
                    <div className="mt-6 h-[220px]">
                      <ChartContainer
                        className="h-full w-full"
                        config={{
                          amt: { label: "Amount", color: "hsl(262.1 83.3% 57.8%)" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={groupExpensesByMonth(expenses)}>
                            <CartesianGrid stroke="hsl(240 4% 16%)" strokeDasharray="3 3" />
                            <XAxis dataKey="month" stroke="hsl(240 5% 64.9%)" />
                            <YAxis stroke="hsl(240 5% 64.9%)" />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="amt" fill="hsl(262.1 83.3% 57.8%)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {activeTab === "payments" && (
            <section className="space-y-6">
              <Card className="border-zinc-800/60 bg-zinc-950/40">
                <CardHeader>
                  <CardTitle>Client Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-zinc-800 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-zinc-950/60">
                        <TableRow>
                          <TableHead className="text-zinc-400">Client</TableHead>
                          <TableHead className="text-zinc-400">Service</TableHead>
                          <TableHead className="text-zinc-400">Amount</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                          <TableHead className="text-zinc-400">Due Date</TableHead>
                          <TableHead className="text-zinc-400">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-zinc-500 py-10">
                              Payment data will be automatically generated from client information
                            </TableCell>
                          </TableRow>
                        ) : (
                          payments.map((p) => (
                            <TableRow key={p.id} className="hover:bg-zinc-900/40">
                              <TableCell>{p.client}</TableCell>
                              <TableCell>{p.service}</TableCell>
                              <TableCell className="font-semibold">{formatCurrency(p.amount)}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    p.status === "Paid"
                                      ? "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                                      : p.status === "Cancelled"
                                        ? "bg-rose-500/15 text-rose-200 border border-rose-500/30"
                                        : "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                                  }
                                  variant="secondary"
                                >
                                  {p.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDateSafe(p.dueDate)}</TableCell>
                              <TableCell className="space-x-2">
                                {p.status !== "Paid" && p.status !== "Cancelled" && (
                                  <Button
                                    size="sm"
                                    className="h-8 bg-emerald-600 hover:bg-emerald-500"
                                    onClick={() => markPaymentPaid(p.id)}
                                  >
                                    Mark Paid
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {activeTab === "employees" && (
            <section className="space-y-6">
              <Card className="border-zinc-800/60 bg-zinc-950/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Employee Management</CardTitle>
                  <Button
                    className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90"
                    onClick={() => openEmployee()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      placeholder="Search employees by name/position..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      className="bg-zinc-900 border-zinc-800"
                    />
                    <Select value={employeeDept} onValueChange={(v) => setEmployeeDept(v)}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="">All Departments</SelectItem>
                        {["Development", "Design", "Marketing", "Sales", "HR", "Finance"].map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={employeeStatus} onValueChange={(v: any) => setEmployeeStatus(v)}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="">All Statuses</SelectItem>
                        {["Active", "On Leave", "Contract", "Terminated"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEmployees.length === 0 ? (
                      <EmptyState title="No employees found." subtitle="Add an employee or adjust filters." />
                    ) : (
                      filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 hover:shadow-lg hover:shadow-black/20 transition relative"
                        >
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-base font-semibold">{emp.employee_name}</div>
                              <div className="text-sm text-zinc-400">{emp.position}</div>
                            </div>
                            <Badge variant="secondary" className="bg-zinc-900 border border-zinc-800 text-zinc-300">
                              {emp.status || "Active"}
                            </Badge>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <InfoItem label="Department" value={emp.department || "—"} />
                            <InfoItem label="Salary" value={emp.salary ? formatCurrency(emp.salary) : "—"} />
                            <InfoItem label="Join Date" value={emp.join_date ? formatDateSafe(emp.join_date) : "—"} />
                            <InfoItem label="Contact" value={emp.contact_info || "—"} />
                          </div>

                          <div className="mt-3 flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              className="h-8 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                              onClick={() => openEmployee(emp)}
                            >
                              <Edit3 className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="destructive" className="h-8" onClick={() => deleteEmployeeById(emp.id)}>
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800/60 bg-zinc-950/40">
                <CardHeader>
                  <CardTitle>Employee Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatPill label="Total Employees" value={String(totalEmployees)} />
                    <StatPill label="Average Salary" value={formatCurrency(avgSalary || 0)} />
                    <StatPill label="Departments" value={String(departmentCount)} />
                    <StatPill label="Active Rate" value={`${activeRate}%`} />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Dialogs */}
          <ClientDialog
            open={openClientDialog}
            onOpenChange={setOpenClientDialog}
            initial={editingClient}
            onSave={saveClient}
          />
          <ExpenseDialog
            open={openExpenseDialog}
            onOpenChange={setOpenExpenseDialog}
            initial={editingExpense}
            onSave={saveExpense}
            clients={clients}
          />
          <EmployeeDialog
            open={openEmployeeDialog}
            onOpenChange={setOpenEmployeeDialog}
            initial={editingEmployee}
            onSave={saveEmployee}
          />
        </main>
      </div>
    </div>
  )
}

/* ---------- Reusable Components ---------- */

function SidebarButton({
  icon = <LayoutDashboard size={18} />,
  label = "Button",
  active = false,
  onClick = () => {},
}: {
  icon?: React.ReactNode
  label?: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2.5 rounded-lg border transition flex items-center gap-3",
        active
          ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-violet-500/40 text-white"
          : "bg-transparent border-transparent hover:bg-violet-500/10 hover:border-violet-500/20",
      ].join(" ")}
    >
      <span className="text-zinc-200">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function MetricCard({
  title = "Metric",
  value = "—",
  gradient = "from-violet-400 to-emerald-400",
}: {
  title?: string
  value?: string
  gradient?: string
}) {
  return (
    <Card className="border-zinc-800/60 bg-zinc-950/40 overflow-hidden relative">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-50% to-transparent ${"via-white/30"}`}
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-zinc-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br ${gradient}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

function MiniStat({ title = "Title", value = "0" }: { title?: string; value?: string }) {
  return (
    <Card className="border-zinc-800/60 bg-zinc-950/40">
      <CardContent className="pt-4">
        <div className="text-sm text-zinc-400">{title}</div>
        <div className="text-2xl font-bold text-violet-300">{value}</div>
      </CardContent>
    </Card>
  )
}

function StatPill({ label = "Label", value = "—" }: { label?: string; value?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-1 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-emerald-400">
        {value}
      </div>
    </div>
  )
}

function EmptyState({
  title = "Nothing here",
  subtitle = "Try adding some data.",
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-10 text-center">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-zinc-400">{subtitle}</div>
    </div>
  )
}

function SummaryRow({ label = "Label", value = "—" }: { label?: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-3 last:border-b-0">
      <span className="text-zinc-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function InfoItem({ label = "Label", value = "—" }: { label?: string; value?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-zinc-500 text-[11px] uppercase">{label}</div>
      <div>{value}</div>
    </div>
  )
}

/* ---------- Dialogs ---------- */

function ClientDialog({
  open = false,
  onOpenChange = () => {},
  initial = null,
  onSave = () => {},
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  initial?: Client | null
  onSave?: (data: Omit<Client, "id">) => void
}) {
  const [form, setForm] = useState<Omit<Client, "id">>({
    client_name: "",
    company_name: "",
    contact_info: "",
    service_name: "",
    service_cost: 0,
    added_date: todayISO(),
    project_status: "Current",
    payment_status: "Unpaid",
  })

  useEffect(() => {
    if (initial) {
      setForm({
        client_name: initial.client_name || "",
        company_name: initial.company_name || "",
        contact_info: initial.contact_info || "",
        service_name: initial.service_name || "",
        service_cost: initial.service_cost || 0,
        added_date: initial.added_date || todayISO(),
        project_status: initial.project_status || "Current",
        payment_status: initial.payment_status || "Unpaid",
      })
    } else {
      setForm((f) => ({ ...f, added_date: todayISO(), project_status: "Current", payment_status: "Unpaid" }))
    }
  }, [initial, open])

  function submit() {
    if (!form.client_name) return
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Client Name *</Label>
              <Input
                value={form.client_name}
                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                placeholder="Enter client name"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <Label>Company Name</Label>
              <Input
                value={form.company_name || ""}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="Enter company name"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Contact Info</Label>
              <Input
                value={form.contact_info || ""}
                onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
                placeholder="Phone / Email"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <Label>Service Name</Label>
              <Input
                value={form.service_name || ""}
                onChange={(e) => setForm({ ...form, service_name: e.target.value })}
                placeholder="Web Development"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Service Cost</Label>
              <Input
                type="number"
                value={form.service_cost || 0}
                onChange={(e) => setForm({ ...form, service_cost: Number.parseFloat(e.target.value || "0") })}
                placeholder="1200.00"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <Label>Added Date</Label>
              <Input
                type="date"
                value={form.added_date || todayISO()}
                onChange={(e) => setForm({ ...form, added_date: e.target.value })}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Project Status</Label>
              <Select
                value={form.project_status}
                onValueChange={(v: ProjectStatus) => setForm({ ...form, project_status: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  {(["Current", "Pending", "Completed", "Cancelled"] as ProjectStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Payment Status</Label>
              <Select
                value={form.payment_status || "Unpaid"}
                onValueChange={(v: "Paid" | "Unpaid") => setForm({ ...form, payment_status: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <SelectItem value="Unpaid">Unpaid</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button
            variant="secondary"
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90" onClick={submit}>
            {initial ? "Update Client" : "Add Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ExpenseDialog({
  open = false,
  onOpenChange = () => {},
  initial = null,
  onSave = () => {},
  clients = [],
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  initial?: Expense | null
  onSave?: (data: Omit<Expense, "id">) => void
  clients?: Client[]
}) {
  const [form, setForm] = useState<Omit<Expense, "id">>({
    expense_date: todayISO(),
    expense_detail: "",
    amount: 0,
    expense_client_id: null,
  })

  useEffect(() => {
    if (initial) {
      setForm({
        expense_date: initial.expense_date || todayISO(),
        expense_detail: initial.expense_detail || "",
        amount: initial.amount || 0,
        expense_client_id: initial.expense_client_id ?? null,
      })
    } else {
      setForm({ expense_date: todayISO(), expense_detail: "", amount: 0, expense_client_id: null })
    }
  }, [initial, open])

  function submit() {
    if (!form.expense_date || !form.expense_detail || !form.amount) return
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Expense" : "Add New Expense"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Expense Date *</Label>
              <Input
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <Label>Amount *</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number.parseFloat(e.target.value || "0") })}
                placeholder="100.00"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Expense Detail *</Label>
            <Input
              value={form.expense_detail}
              onChange={(e) => setForm({ ...form, expense_detail: e.target.value })}
              placeholder="Domain renewal, Office supplies, etc."
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="grid gap-2">
            <Label>Linked Client</Label>
            <Select
              value={form.expense_client_id ? String(form.expense_client_id) : ""}
              onValueChange={(v) => setForm({ ...form, expense_client_id: v ? Number.parseInt(v) : null })}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Select client (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                <SelectItem value="">General</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.client_name}
                    {c.company_name ? ` (${c.company_name})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button
            variant="secondary"
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90" onClick={submit}>
            {initial ? "Update Expense" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EmployeeDialog({
  open = false,
  onOpenChange = () => {},
  initial = null,
  onSave = () => {},
}: {
  open?: boolean
  onOpenChange?: (v: boolean) => void
  initial?: Employee | null
  onSave?: (data: Omit<Employee, "id">) => void
}) {
  const [form, setForm] = useState<Omit<Employee, "id">>({
    employee_name: "",
    position: "",
    department: "Development",
    salary: 0,
    join_date: todayISO(),
    status: "Active",
    contact_info: "",
  })

  useEffect(() => {
    if (initial) {
      setForm({
        employee_name: initial.employee_name,
        position: initial.position,
        department: initial.department || "Development",
        salary: initial.salary || 0,
        join_date: initial.join_date || todayISO(),
        status: initial.status || "Active",
        contact_info: initial.contact_info || "",
      })
    } else {
      setForm({
        employee_name: "",
        position: "",
        department: "Development",
        salary: 0,
        join_date: todayISO(),
        status: "Active",
        contact_info: "",
      })
    }
  }, [initial, open])

  function submit() {
    if (!form.employee_name || !form.position) return
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Employee Name *</Label>
              <Input
                value={form.employee_name}
                onChange={(e) => setForm({ ...form, employee_name: e.target.value })}
                placeholder="Enter employee name"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <Label>Position *</Label>
              <Input
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="Enter position"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select
                value={form.department || "Development"}
                onValueChange={(v) => setForm({ ...form, department: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  {["Development", "Design", "Marketing", "Sales", "HR", "Finance"].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Salary</Label>
              <Input
                type="number"
                value={form.salary || 0}
                onChange={(e) => setForm({ ...form, salary: Number.parseFloat(e.target.value || "0") })}
                placeholder="50000.00"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Join Date</Label>
              <Input
                type="date"
                value={form.join_date || todayISO()}
                onChange={(e) => setForm({ ...form, join_date: e.target.value })}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status || "Active"}
                onValueChange={(v: EmployeeStatus) => setForm({ ...form, status: v })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  {(["Active", "On Leave", "Contract", "Terminated"] as EmployeeStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Contact Info</Label>
            <Input
              value={form.contact_info || ""}
              onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
              placeholder="Phone / Email"
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
        </div>
        <DialogFooter className="mt-3">
          <Button
            variant="secondary"
            className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="bg-gradient-to-br from-violet-500 to-fuchsia-500 hover:opacity-90" onClick={submit}>
            {initial ? "Update Employee" : "Add Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------- Utils ---------- */

function isoMonthsAgo(months: number, day: number) {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  d.setDate(Math.min(day, daysInMonth(d.getFullYear(), d.getMonth())))
  return d.toISOString().slice(0, 10)
}
function isSameMonth(iso: string, compare: Date) {
  const d = new Date(iso)
  return d.getMonth() === compare.getMonth() && d.getFullYear() === compare.getFullYear()
}
function addDays(iso: string, days: number) {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate()
}
function formatDateSafe(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString()
}
function groupExpensesByMonth(list: Expense[]) {
  // Return last 6 months with totals
  const out: { month: string; amt: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const label = d.toLocaleString("en-IN", { month: "short" })
    const total = list
      .filter((e) => e.expense_date && isSameMonth(e.expense_date, d))
      .reduce((s, e) => s + (e.amount || 0), 0)
    out.push({ month: label, amt: total })
  }
  return out
}
