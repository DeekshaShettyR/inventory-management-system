"use client"

import React from "react"

import { useState } from 'react'
import type { Product } from '@/lib/types'
import { useInventory } from '@/lib/inventory-context'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shared-ui'
import { Plus } from 'lucide-react'

interface BorrowRecordsModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BorrowRecordsModal({ product, open, onOpenChange }: BorrowRecordsModalProps) {
  const { getProductRecords, addBorrowRecord } = useInventory()
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  
  const [studentName, setStudentName] = useState('')
  const [usn, setUsn] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [section, setSection] = useState('')
  const [takenDate, setTakenDate] = useState(getTodayDate())
  const [returnDate, setReturnDate] = useState('')
  const [recordType, setRecordType] = useState<'borrow' | 'purchase'>('borrow')
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState('')

  if (!product) return null

  const records = getProductRecords(product.id)

  const resetForm = () => {
    setStudentName('')
    setUsn('')
    setPhoneNumber('')
    setSection('')
    setTakenDate('')
    setReturnDate('')
    setRecordType('borrow')
    setQuantity('1')
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!studentName.trim() || !usn.trim() || !phoneNumber.trim() || !section.trim() || !takenDate) {
      setError('Please fill in all required fields')
      return
    }

    if (usn.trim().length !== 10) {
      setError('USN must be exactly 10 characters')
      return
    }

    if (phoneNumber.trim().length !== 10) {
      setError('Phone number must be exactly 10 digits')
      return
    }

    // Validate return date if provided
    if (returnDate && returnDate <= takenDate) {
      setError('Return date must be greater than taken date')
      return
    }

    const qty = parseInt(quantity)
    if (qty <= 0) {
      setError('Quantity must be at least 1')
      return
    }

    // Check stock availability
    if (recordType === 'borrow' && qty > product.availability) {
      setError(`Not enough available stock. Maximum: ${product.availability}`)
      return
    }

    if (recordType === 'purchase' && qty > product.masterCount) {
      setError(`Not enough stock. Maximum: ${product.masterCount}`)
      return
    }

    addBorrowRecord({
      productId: product.id,
      studentName: studentName.trim(),
      usn: usn.trim().toUpperCase(),
      phoneNumber: phoneNumber.trim(),
      section: section.trim().toUpperCase(),
      takenDate,
      returnDate: returnDate || '',
      type: recordType,
      quantity: qty
    })

    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Borrow / Purchase Database</DialogTitle>
          <DialogDescription>
            {product.name} - Available: {product.availability} / Master: {product.masterCount}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records">View Records</TabsTrigger>
            <TabsTrigger value="add">Add New Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="mt-4">
            {records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No records found for this product
              </div>
            ) : (
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>USN</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Taken</TableHead>
                      <TableHead>Return</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.usn}</TableCell>
                        <TableCell>{record.section}</TableCell>
                        <TableCell>
                          <Badge variant={record.type === 'borrow' ? 'secondary' : 'default'}>
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.quantity}</TableCell>
                        <TableCell>{record.takenDate}</TableCell>
                        <TableCell>{record.returnDate || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    placeholder="Enter student name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="usn">USN * (10 characters max)</Label>
                  <Input
                    id="usn"
                    placeholder="e.g., 1MS21CS001"
                    value={usn}
                    maxLength={10}
                    onChange={(e) => setUsn(e.target.value.slice(0, 10))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number * (10 digits)</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., 9876543210"
                    type="tel"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section">Section *</Label>
                  <Input
                    id="section"
                    placeholder="e.g., A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recordType">Type *</Label>
                  <Select value={recordType} onValueChange={(v) => setRecordType(v as 'borrow' | 'purchase')}>
                    <SelectTrigger id="recordType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="borrow">Borrow (decreases availability)</SelectItem>
                      <SelectItem value="purchase">Purchase (decreases master count)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={recordType === 'borrow' ? product.availability : product.masterCount}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takenDate">Taken Date *</Label>
                  <Input
                    id="takenDate"
                    type="date"
                    value={takenDate}
                    onChange={(e) => setTakenDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="returnDate">Return Date (optional)</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    min={takenDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be greater than taken date ({takenDate})
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
