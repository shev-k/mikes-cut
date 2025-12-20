"use client"

import { useState, useEffect, Fragment } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getOrders, updateOrderStatus } from "@/app/dashboard/actions"
import { toast } from "sonner"
import { format } from "date-fns"
import { Loader2, Package, ChevronDown, ChevronUp, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    try {
      const data = await getOrders()
      setOrders(data || [])
    } catch (error) {
      console.error("Failed to fetch orders", error)
      toast.error("Failed to fetch orders")
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchOrders()
    }
  }, [open])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic update
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))

    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        toast.success("Order status updated")
        fetchOrders(false)
      } else {
        toast.error("Failed to update status")
        fetchOrders(false)
      }
    } catch (error) {
      toast.error("An error occurred")
      fetchOrders(false)
    }
  }

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shop Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View</div>
            <p className="text-xs text-muted-foreground">Manage customer orders</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw]! w-[70vw]! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Orders Management</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <Fragment key={order.id}>
                    <TableRow className="group">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrder(order.id)}
                        >
                          {expandedOrders[order.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.customer_name}</span>
                          <span className="text-xs text-muted-foreground">{order.customer_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-bold">
                        ${order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)} variant="outline">
                          {order.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                    {expandedOrders[order.id] && (
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={7}>
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Delivery Details</h4>
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">Phone:</span> {order.customer_phone}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  <span className="font-medium text-foreground">Address:</span><br />
                                  {order.customer_address}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  <span className="font-medium text-foreground">Payment Method:</span> {order.payment_method.replace(/_/g, ' ').toUpperCase()}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                  {order.order_items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3 text-sm">
                                      <div className="h-10 w-10 rounded bg-background border overflow-hidden shrink-0">
                                        <img 
                                          src={item.products?.image_url || '/placeholder.svg'} 
                                          alt={item.products?.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium">{item.products?.name || 'Unknown Product'}</p>
                                        <p className="text-muted-foreground">
                                          {item.quantity} x ${item.price_at_time.toFixed(2)}
                                        </p>
                                      </div>
                                      <div className="font-bold">
                                        ${(item.quantity * item.price_at_time).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}
