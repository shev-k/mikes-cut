"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Plus, Edit, Trash2, Search } from "lucide-react"
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, type Product, type Category, type ProductFormData } from "@/app/shop/actions"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category_id: 0,
    price: 0,
    image_url: "",
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ])
    setProducts(productsData)
    setCategories(categoriesData)
    setLoading(false)
  }

  function openCreateDialog() {
    setEditingProduct(null)
    setFormData({
      name: "",
      category_id: categories[0]?.id || 0,
      price: 0,
      image_url: "",
      description: "",
    })
    setFormDialogOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      image_url: product.image_url || "",
      description: product.description || "",
    })
    setFormDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const result = editingProduct
      ? await updateProduct(editingProduct.id.toString(), formData)
      : await createProduct(formData)

    if (result.success) {
      toast({
        title: editingProduct ? "Product Updated" : "Product Created",
        description: `Successfully ${editingProduct ? "updated" : "created"} the product.`,
      })
      setFormDialogOpen(false)
      setEditingProduct(null)
      await loadData()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save product.",
        variant: "destructive",
      })
    }
  }

  function openDeleteDialog(product: Product) {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!productToDelete) return

    const result = await deleteProduct(productToDelete.id.toString())

    if (result.success) {
      toast({
        title: "Product Deleted",
        description: "Successfully deleted the product.",
      })
      setDeleteDialogOpen(false)
      setProductToDelete(null)
      await loadData()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete product.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Manage Products</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Manage Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Click to manage shop items</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-wider">MANAGE PRODUCTS</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add New Product Button */}
            <Button onClick={openCreateDialog} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              ADD NEW PRODUCT
            </Button>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Products List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Current Products ({products.filter((p) => {
                if (!searchQuery) return true
                const query = searchQuery.toLowerCase()
                return (
                  p.name.toLowerCase().includes(query) ||
                  p.categories?.name?.toLowerCase().includes(query) ||
                  p.description?.toLowerCase().includes(query)
                )
              }).length})</h3>
              
              {products.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No products yet. Add your first product!</p>
              ) : (
                <div className="grid gap-4">
                  {products.filter((product) => {
                    if (!searchQuery) return true
                    const query = searchQuery.toLowerCase()
                    return (
                      product.name.toLowerCase().includes(query) ||
                      product.categories?.name?.toLowerCase().includes(query) ||
                      product.description?.toLowerCase().includes(query)
                    )
                  }).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/20 transition-colors">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.categories?.name}</p>
                        <p className="text-sm">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Product Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={(open) => {
        setFormDialogOpen(open)
        if (!open) setEditingProduct(null)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="/path-to-image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormDialogOpen(false)
                  setEditingProduct(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{productToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
