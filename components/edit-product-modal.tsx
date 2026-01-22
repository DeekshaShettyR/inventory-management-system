"use client"

import { useState } from 'react'
import type { Product } from '@/lib/types'
import { useInventory } from '@/lib/inventory-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shared-ui'
import { Plus, Minus, Trash2 } from 'lucide-react'

interface EditProductModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProductModal({ product, open, onOpenChange }: EditProductModalProps) {
  const { addPurchasedItems, markDefective, deleteProduct } = useInventory()
  
  const [purchaseQuantity, setPurchaseQuantity] = useState('')
  const [defectiveQuantity, setDefectiveQuantity] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!product) return null

  const handleAddPurchased = () => {
    const quantity = parseInt(purchaseQuantity)
    if (quantity > 0) {
      addPurchasedItems(product.id, quantity)
      setPurchaseQuantity('')
    }
  }

  const handleMarkDefective = () => {
    const quantity = parseInt(defectiveQuantity)
    if (quantity > 0 && quantity <= product.availability) {
      markDefective(product.id, quantity)
      setDefectiveQuantity('')
    }
  }

  const handleDelete = () => {
    deleteProduct(product.id)
    setShowDeleteConfirm(false)
    onOpenChange(false)
  }

  const handleClose = () => {
    setPurchaseQuantity('')
    setDefectiveQuantity('')
    setShowDeleteConfirm(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Manage {product.name} - Master: {product.masterCount}, Available: {product.availability}
          </DialogDescription>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to permanently delete <strong>{product.name}</strong>? 
              This action cannot be undone and will also remove all associated borrow/purchase records.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Permanently
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="purchase" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="purchase">Add Purchased</TabsTrigger>
                <TabsTrigger value="defective">Mark Defective</TabsTrigger>
              </TabsList>
              
              <TabsContent value="purchase" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseQty">Quantity to Add</Label>
                  <p className="text-xs text-muted-foreground">
                    Add newly purchased items to increase master count and availability
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="purchaseQty"
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      value={purchaseQuantity}
                      onChange={(e) => setPurchaseQuantity(e.target.value)}
                    />
                    <Button onClick={handleAddPurchased} disabled={!purchaseQuantity || parseInt(purchaseQuantity) <= 0}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="defective" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="defectiveQty">Defective Quantity</Label>
                  <p className="text-xs text-muted-foreground">
                    Mark items as defective to decrease availability (max: {product.availability})
                  </p>
                  <div className="flex gap-2">
                    <Input
                      id="defectiveQty"
                      type="number"
                      min="1"
                      max={product.availability}
                      placeholder="Enter quantity"
                      value={defectiveQuantity}
                      onChange={(e) => setDefectiveQuantity(e.target.value)}
                    />
                    <Button 
                      variant="secondary"
                      onClick={handleMarkDefective} 
                      disabled={!defectiveQuantity || parseInt(defectiveQuantity) <= 0 || parseInt(defectiveQuantity) > product.availability}
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Mark
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </Button>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
