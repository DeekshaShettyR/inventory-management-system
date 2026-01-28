"use client";

import { createContext, useContext, useState, useCallback } from "react";

// NOTE: Using localStorage for persistence - will replace with API calls later
// TODO: Add real database integration
// Performance concern: Large datasets might cause re-renders - consider pagination

const InventoryContext = createContext();

// Initial mock data
const initialProducts = [
  { id: "1", name: "Arduino Uno", masterCount: 50, availability: 45, createdAt: new Date("2024-01-01") },
  { id: "2", name: "Raspberry Pi 4", masterCount: 30, availability: 25, createdAt: new Date("2024-01-15") },
  { id: "3", name: "Breadboard", masterCount: 100, availability: 85, createdAt: new Date("2024-02-01") },
  { id: "4", name: "LED Pack (100pcs)", masterCount: 20, availability: 18, createdAt: new Date("2024-02-10") },
  { id: "5", name: "Multimeter", masterCount: 15, availability: 12, createdAt: new Date("2024-03-01") },
];

const initialBorrowRecords = [
  {
    id: "1",
    productId: "1",
    studentName: "John Doe",
    usn: "1MS21CS001",
    phoneNumber: "9876543210",
    section: "A",
    takenDate: "2024-03-01",
    returnDate: "2024-03-15",
    type: "borrow",
    quantity: 2,
    createdAt: new Date("2024-03-01"),
  },
  {
    id: "2",
    productId: "2",
    studentName: "Jane Smith",
    usn: "1MS21CS002",
    phoneNumber: "9876543211",
    section: "B",
    takenDate: "2024-03-05",
    returnDate: "",
    type: "purchase",
    quantity: 1,
    createdAt: new Date("2024-03-05"),
  },
];

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [borrowRecords, setBorrowRecords] = useState(initialBorrowRecords);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = useCallback((name, masterCount, availability) => {
    const newProduct = {
      id: crypto.randomUUID(),
      name,
      masterCount,
      availability: Math.min(availability, masterCount), // availability can't exceed master count
      createdAt: new Date(),
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...updates } : product))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    // Also remove related borrow records
    setBorrowRecords((prev) => prev.filter((record) => record.productId !== id));
  }, []);

  const addPurchasedItems = useCallback((id, quantity) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              masterCount: product.masterCount + quantity,
              availability: product.availability + quantity,
            }
          : product
      )
    );
  }, []);

  const markDefective = useCallback((id, quantity) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== id) return product;
        const newAvailability = Math.max(0, product.availability - quantity);
        return { ...product, availability: newAvailability };
      })
    );
  }, []);

  const addBorrowRecord = useCallback((record) => {
    const newRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    setBorrowRecords((prev) => [...prev, newRecord]);

    // Update product counts based on type
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== record.productId) return product;

        if (record.type === "purchase") {
          // Purchase decreases master count
          return {
            ...product,
            masterCount: Math.max(0, product.masterCount - record.quantity),
            availability: Math.max(0, product.availability - record.quantity),
          };
        } else {
          // Borrow decreases availability only
          return {
            ...product,
            availability: Math.max(0, product.availability - record.quantity),
          };
        }
      })
    );
  }, []);

  const getProductRecords = useCallback((productId) => {
    return borrowRecords.filter((record) => record.productId === productId);
  }, [borrowRecords]);

  const getMonthlyReport = useCallback(() => {
    const months = ["January", "February", "March", "April", "May", "June"];

    return months.map((month, index) => {
      const monthRecords = borrowRecords.filter((record) => {
        const recordMonth = new Date(record.createdAt).getMonth();
        return recordMonth === index;
      });

      const borrowedItems = monthRecords
        .filter((r) => r.type === "borrow")
        .reduce((sum, r) => sum + r.quantity, 0);

      const purchasedByStudents = monthRecords
        .filter((r) => r.type === "purchase")
        .reduce((sum, r) => sum + r.quantity, 0);

      const totalMaster = products.reduce((sum, p) => sum + p.masterCount, 0);
      const totalAvailable = products.reduce((sum, p) => sum + p.availability, 0);

      return {
        month,
        newlyPurchased: Math.floor(Math.random() * 20) + 5, // Mock data for newly purchased by manager
        defectiveRemoved: Math.floor(Math.random() * 5),
        openingStock: totalMaster + borrowedItems + purchasedByStudents,
        closingStock: totalAvailable,
        utilizedItems: borrowedItems,
      };
    });
  }, [borrowRecords, products]);

  return (
    <InventoryContext.Provider
      value={{
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
        getMonthlyReport,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
