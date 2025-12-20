"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Scissors, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import { getServicesList, createService, updateService, deleteService } from "@/app/dashboard/actions"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ServiceManagement() {
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: 30,
    description: ""
  })

  useEffect(() => {
    if (open) {
      loadServices()
    }
  }, [open])

  async function loadServices() {
    setLoading(true)
    const data = await getServicesList()
    setServices(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name: "",
      price: 0,
      duration: 30,
      description: ""
    })
    setEditingId(null)
  }

  function startEdit(service: any) {
    setFormData({
      name: service.name || "",
      price: service.price || 0,
      duration: service.duration || 30,
      description: service.description || ""
    })
    setEditingId(service.id)
    setIsCreating(false)
  }

  async function handleSave() {
    if (!formData.name) {
      toast.error("Name is required")
      return
    }

    if (isCreating) {
      console.log("Creating service with data:", formData)
      const res = await createService(formData)
      console.log("Create service result:", res)
      if (res.success) {
        toast.success("Service created")
        loadServices()
        resetForm()
      } else {
        console.error("Service creation failed:", res.error)
        toast.error(res.error || "Failed to create service")
      }
    } else if (editingId) {
      console.log("Updating service with data:", formData)
      const res = await updateService(editingId, formData)
      console.log("Update service result:", res)
      if (res.success) {
        toast.success("Service updated")
        loadServices()
        resetForm()
      } else {
        console.error("Service update failed:", res.error)
        toast.error(res.error || "Failed to update service")
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this service?")) {
      const res = await deleteService(id)
      if (res.success) {
        toast.success("Service deleted")
        loadServices()
      } else {
        toast.error(res.error || "Failed to delete service")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Services</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length || "..."}</div>
            <p className="text-xs text-muted-foreground">Pricing & Duration</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service Management</DialogTitle>
        </DialogHeader>

        {!isCreating && !editingId && (
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setIsCreating(true); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" /> Add New Service
            </Button>
          </div>
        )}

        {(isCreating || editingId) ? (
          <div className="space-y-4 border p-4 rounded-md bg-muted/20">
            <h3 className="font-semibold">{isCreating ? "Add New Service" : "Edit Service"}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input 
                  type="number" 
                  min="5"
                  step="5"
                  value={formData.duration} 
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => { resetForm(); setIsCreating(false); setEditingId(null); }}
              >
                Cancel
              </Button>
              <Button onClick={async () => { await handleSave(); setIsCreating(false); }}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell className="text-right">${service.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(service)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}
