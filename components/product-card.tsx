"use client"

import type { Product } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Button, Badge } from '@/components/shared-ui'
import { Package, Edit, Database } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onOpenRecords: (product: Product) => void
}

export function ProductCard({ product, onEdit, onOpenRecords }: ProductCardProps) {
  const availabilityPercentage = product.masterCount > 0 
    ? Math.round((product.availability / product.masterCount) * 100) 
    : 0

  const getAvailabilityColor = () => {
    if (availabilityPercentage >= 70) return 'bg-green-500'
    if (availabilityPercentage >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="flex flex-col" style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
          </div>
          <Badge variant="outline" className="shrink-0">
            {availabilityPercentage}% available
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Master Count</p>
            <p className="text-2xl font-semibold">{product.masterCount}</p>
            <p className="text-xs text-muted-foreground">Total quantity owned</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Availability</p>
            <p className="text-2xl font-semibold">{product.availability}</p>
            <p className="text-xs text-muted-foreground">Usable quantity</p>
          </div>
        </div>
        
        {/* Availability Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Stock Level</span>
            <span>{product.availability} / {product.masterCount}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getAvailabilityColor()}`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2 pt-4">
        <Button 
          variant="outline" 
          className="flex-1 bg-transparent"
          onClick={() => onEdit(product)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => onOpenRecords(product)}
        >
          <Database className="w-4 h-4 mr-2" />
          Records
        </Button>
      </CardFooter>
    </Card>
  )
}
