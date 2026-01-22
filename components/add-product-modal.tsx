"use client"

import React from "react"

import { useState } from 'react'
import { useInventory } from '@/lib/inventory-context'
import { useToast } from '@/hooks/use-toast'
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
} from '@/components/shared-ui'
import { Plus } from 'lucide-react'

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const { addProduct } = useInventory()
  const { toast } = useToast()
  
  const [name, setName] = useState('')
  const [masterCount, setMasterCount] = useState('')
  const [availability, setAvailability] = useState('')
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setMasterCount('')
    setAvailability('')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name.trim()) {
      setError('Please enter a product name')
      return
    }

    const master = parseInt(masterCount)
    const available = parseInt(availability)

    if (isNaN(master) || master <= 0) {
      setError('Master count must be a positive number')
      return
    }

    if (isNaN(available) || available < 0) {
      setError('Availability must be a non-negative number')
      return
    }

    if (available > master) {
      setError('Availability cannot exceed master count')
      return
    }

    addProduct(name.trim(), master, available)
    toast({
      title: 'Product Added',
      description: `${name.trim()} has been added to inventory successfully.`,
    })
    resetForm()
    onOpenChange(false)
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleSetAvailabilityToMasterCount = () => {
    if (masterCount && !isNaN(parseInt(masterCount)) && parseInt(masterCount) > 0) {
      setAvailability(masterCount)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details of the new product to add to inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="e.g., Arduino Uno"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="masterCount">Master Count</Label>
            <p className="text-xs text-muted-foreground">
              Total quantity owned (includes all items, even those currently borrowed)
            </p>
            <Input
              id="masterCount"
              type="number"
              min="1"
              placeholder="e.g., 50"
              value={masterCount}
              onChange={(e) => setMasterCount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="availability">Availability</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSetAvailabilityToMasterCount}
                className="text-xs h-auto px-2 py-1"
              >
                Same as Master Count
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Usable quantity currently in stock (cannot exceed master count)
            </p>
            <Input
              id="availability"
              type="number"
              min="0"
              max={masterCount || undefined}
              placeholder="e.g., 45"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
