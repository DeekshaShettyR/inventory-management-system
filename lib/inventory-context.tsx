"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product, BorrowRecord, MonthlyReport } from './types'

// NOTE: Using localStorage for persistence - will replace with API calls later
// TODO: Add real database integration
// Performance concern: Large datasets might cause re-renders - consider pagination

interface InventoryContextType {
  products: Product[]
  borrowRecords: BorrowRecord[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredProducts: Product[]
  addProduct: (name: string, masterCount: number, availability: number) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addPurchasedItems: (id: string, quantity: number) => void
  markDefective: (id: string, quantity: number) => void
  addBorrowRecord: (record: Omit<BorrowRecord, 'id' | 'createdAt'>) => void
  getProductRecords: (productId: string) => BorrowRecord[]
  getMonthlyReport: () => MonthlyReport[]
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Initial mock data
const initialProducts: Product[] = [
  { id: '1', name: 'Arduino Uno', masterCount: 50, availability: 45, createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Raspberry Pi 4', masterCount: 30, availability: 25, createdAt: new Date('2024-01-15') },
  { id: '3', name: 'Breadboard', masterCount: 100, availability: 85, createdAt: new Date('2024-02-01') },
  { id: '4', name: 'LED Pack (100pcs)', masterCount: 20, availability: 18, createdAt: new Date('2024-02-10') },
  { id: '5', name: 'Multimeter', masterCount: 15, availability: 12, createdAt: new Date('2024-03-01') },
]

const initialBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    productId: '1',
    studentName: 'John Doe',
    usn: '1MS21CS001',
    phoneNumber: '9876543210',
    section: 'A',
    takenDate: '2024-03-01',
    returnDate: '2024-03-15',
    type: 'borrow',
    quantity: 2,
    createdAt: new Date('2024-03-01')
  },
  {
    id: '2',
    productId: '2',
    studentName: 'Jane Smith',
    usn: '1MS21CS002',
    phoneNumber: '9876543211',
    section: 'B',
    takenDate: '2024-03-05',
    returnDate: '',
    type: 'purchase',
    quantity: 1,
    createdAt: new Date('2024-03-05')
  },
]

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(initialBorrowRecords)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addProduct = useCallback((name: string, masterCount: number, availability: number) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      masterCount,
      availability: Math.min(availability, masterCount), // availability can't exceed master count
      createdAt: new Date()
    }
    setProducts(prev => [...prev, newProduct])
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product =>
      product.id === id ? { ...product, ...updates } : product
    ))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
    // Also remove related borrow records
    setBorrowRecords(prev => prev.filter(record => record.productId !== id))
  }, [])

  const addPurchasedItems = useCallback((id: string, quantity: number) => {
    setProducts(prev => prev.map(product =>
      product.id === id
        ? {
            ...product,
            masterCount: product.masterCount + quantity,
            availability: product.availability + quantity
          }
        : product
    ))
  }, [])

  const markDefective = useCallback((id: string, quantity: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id !== id) return product
      const newAvailability = Math.max(0, product.availability - quantity)
      return { ...product, availability: newAvailability }
    }))
  }, [])

  const addBorrowRecord = useCallback((record: Omit<BorrowRecord, 'id' | 'createdAt'>) => {
    const newRecord: BorrowRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
    
    setBorrowRecords(prev => [...prev, newRecord])
    
    // Update product counts based on type
    setProducts(prev => prev.map(product => {
      if (product.id !== record.productId) return product
      
      if (record.type === 'purchase') {
        // Purchase decreases master count
        return {
          ...product,
          masterCount: Math.max(0, product.masterCount - record.quantity),
          availability: Math.max(0, product.availability - record.quantity)
        }
      } else {
        // Borrow decreases availability only
        return {
          ...product,
          availability: Math.max(0, product.availability - record.quantity)
        }
      }
    }))
  }, [])

  const getProductRecords = useCallback((productId: string) => {
    return borrowRecords.filter(record => record.productId === productId)
  }, [borrowRecords])

  const getMonthlyReport = useCallback((): MonthlyReport[] => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June']
    
    return months.map((month, index) => {
      const monthRecords = borrowRecords.filter(record => {
        const recordMonth = new Date(record.createdAt).getMonth()
        return recordMonth === index
      })
      
      const borrowedItems = monthRecords
        .filter(r => r.type === 'borrow')
        .reduce((sum, r) => sum + r.quantity, 0)
      
      const purchasedByStudents = monthRecords
        .filter(r => r.type === 'purchase')
        .reduce((sum, r) => sum + r.quantity, 0)
      
      const totalMaster = products.reduce((sum, p) => sum + p.masterCount, 0)
      const totalAvailable = products.reduce((sum, p) => sum + p.availability, 0)
      
      return {
        month,
        newlyPurchased: Math.floor(Math.random() * 20) + 5, // Mock data for newly purchased by manager
        defectiveRemoved: Math.floor(Math.random() * 5),
        openingStock: totalMaster + borrowedItems + purchasedByStudents,
        closingStock: totalAvailable,
        utilizedItems: borrowedItems
      }
    })
  }, [borrowRecords, products])

  return (
    <InventoryContext.Provider value={{
      products,
      borrowRecords,
      searchQuery,
      setSearchQuery,
      filteredProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addPurchasedItems,
      markDefective,
      addBorrowRecord,
      getProductRecords,
      getMonthlyReport
    }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}
