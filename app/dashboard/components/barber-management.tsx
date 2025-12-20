"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import { getBarbersList, createBarber, updateBarber, deleteBarber } from "@/app/dashboard/actions"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BarberManagement() {
  const [open, setOpen] = useState(false)
  const [barbers, setBarbers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    image_url: "",
    commission_rate: 50
  })

  useEffect(() => {
    if (open) {
      loadBarbers()
    }
  }, [open])

  async function loadBarbers() {
    setLoading(true)
    const data = await getBarbersList()
    setBarbers(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name: "",
      title: "",
      bio: "",
      image_url: "",
      commission_rate: 50
    })
    setEditingId(null)
  }

  function startEdit(barber: any) {
    setFormData({
      name: barber.name || "",
      title: barber.title || "",
      bio: barber.bio || "",
      image_url: barber.image_url || "",
      commission_rate: barber.commission_rate || 50
    })
    setEditingId(barber.id)
    setIsCreating(false)
  }

  async function handleSave() {
    if (!formData.name) {
      toast.error("Name is required")
      return
    }

    if (isCreating) {
      const res = await createBarber(formData)
      if (res.success) {
        toast.success("Barber created")
        loadBarbers()
        resetForm()
      } else {
        toast.error(res.error || "Failed to create barber")
      }
    } else if (editingId) {
      const res = await updateBarber(editingId, formData)
      if (res.success) {
        toast.success("Barber updated")
        loadBarbers()
        resetForm()
      } else {
        toast.error(res.error || "Failed to update barber")
      }
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this barber? This cannot be undone.")) {
      const res = await deleteBarber(id)
      if (res.success) {
        toast.success("Barber deleted")
        loadBarbers()
      } else {
        toast.error(res.error || "Failed to delete barber")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manage Barbers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{barbers.length || "..."}</div>
            <p className="text-xs text-muted-foreground">Staff & Commissions</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Barber Management</DialogTitle>
        </DialogHeader>

        {!isCreating && !editingId && (
          <div className="flex justify-end mb-4">
            <Button onClick={() => { setIsCreating(true); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" /> Add New Barber
            </Button>
          </div>
        )}

        {(isCreating || editingId) ? (
          <div className="space-y-4 border p-4 rounded-md bg-muted/20">
            <h3 className="font-semibold">{isCreating ? "Add New Barber" : "Edit Barber"}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Commission Rate (%)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  max="100"
                  value={formData.commission_rate} 
                  onChange={(e) => setFormData({...formData, commission_rate: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  value={formData.image_url} 
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})} 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Bio</Label>
                <Textarea 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
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
                <TableHead>Title</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barbers.map((barber) => (
                <TableRow key={barber.id}>
                  <TableCell className="font-medium">{barber.name}</TableCell>
                  <TableCell>{barber.title}</TableCell>
                  <TableCell>{barber.commission_rate}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(barber)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(barber.id)}>
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
