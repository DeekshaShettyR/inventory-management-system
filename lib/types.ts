// Product type definition
export interface Product {
  id: string
  name: string
  masterCount: number
  availability: number
  createdAt: Date
}

// Borrow/Purchase record type
export interface BorrowRecord {
  id: string
  productId: string
  studentName: string
  usn: string
  phoneNumber: string
  section: string
  takenDate: string
  returnDate: string
  type: 'borrow' | 'purchase'
  quantity: number
  createdAt: Date
}

// User type for authentication
export interface User {
  id: string
  username: string
  email: string
}

// Analytics data type
export interface MonthlyReport {
  month: string
  newlyPurchased: number
  defectiveRemoved: number
  openingStock: number
  closingStock: number
  utilizedItems: number
}
