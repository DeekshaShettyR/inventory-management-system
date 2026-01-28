"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useInventory } from "@/lib/inventory-context"
import {
  BarChart3,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  Download,
} from "lucide-react"

/* -------------------- Badge -------------------- */

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

/* -------------------- Card -------------------- */

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pt-0", className)}
      {...props}
    />
  )
}

/* -------------------- Table -------------------- */

function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-2 py-2", className)}
      {...props}
    />
  )
}

/* -------------------- Button -------------------- */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

/* -------------------- Analytics Page -------------------- */

export function AnalyticsPage() {
  const { products, borrowRecords, getMonthlyReport } = useInventory()

  const monthlyData = getMonthlyReport()

  const totalMasterCount = products.reduce(
    (s, p) => s + p.masterCount,
    0,
  )
  const totalAvailability = products.reduce(
    (s, p) => s + p.availability,
    0,
  )

  const totalBorrowed = borrowRecords
    .filter((r) => r.type === "borrow")
    .reduce((s, r) => s + r.quantity, 0)

  const totalPurchased = borrowRecords
    .filter((r) => r.type === "purchase")
    .reduce((s, r) => s + r.quantity, 0)

  const utilizationRate = totalMasterCount
    ? Math.round(
        ((totalMasterCount - totalAvailability) / totalMasterCount) * 100,
      )
    : 0

  const downloadMonthlyReport = (month) => {
    const m = monthlyData.find((x) => x.month === month)
    if (!m) return

    const csv = [
      ["Month", month],
      ["Opening Stock", m.openingStock],
      ["Closing Stock", m.closingStock],
      ["Purchased", m.newlyPurchased],
      ["Defective", m.defectiveRemoved],
    ]
      .map((r) => r.join(","))
      .join("\n")

    const a = document.createElement("a")
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    a.download = `Analytics-${month}.csv`
    a.click()
  }

  const downloadAllMonthsReport = () => {
    if (monthlyData.length === 0) return

    const csv = [
      ["Month", "Opening Stock", "Closing Stock", "Purchased", "Defective"],
      ...monthlyData.map((m) => [
        m.month,
        m.openingStock,
        m.closingStock,
        m.newlyPurchased,
        m.defectiveRemoved,
      ]),
    ]
      .map((r) => r.join(","))
      .join("\n")

    const a = document.createElement("a")
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    a.download = `Analytics-All-Months.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>{products.length}</CardContent>
        </Card>

        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>{utilizationRate}%</CardContent>
        </Card>

        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Opening Stock
            </CardTitle>
          </CardHeader>
          <CardContent>{totalMasterCount}</CardContent>
        </Card>

        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Closing Stock
            </CardTitle>
          </CardHeader>
          <CardContent>{totalAvailability}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'oklch(24.571% 0.12604 288.685)' }}>
              <ShoppingCart className="h-4 w-4" />
              Transaction Summary
            </CardTitle>
            <CardDescription>Total borrow and purchase activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Borrowed
                </p>
                <p className="text-3xl font-bold">{totalBorrowed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Purchased
                </p>
                <p className="text-3xl font-bold">{totalPurchased}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'oklch(24.571% 0.12604 288.685)' }}>
              <AlertTriangle className="h-4 w-4" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products with less than 30% availability</CardDescription>
          </CardHeader>
          <CardContent>
            {products.filter(
              (p) => p.masterCount > 0 && p.availability / p.masterCount < 0.3
            ).length === 0 ? (
              <p className="text-sm text-muted-foreground">No low stock items</p>
            ) : (
              <ul className="space-y-2">
                {products
                  .filter(
                    (p) =>
                      p.masterCount > 0 && p.availability / p.masterCount < 0.3
                  )
                  .map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{product.name}</span>
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                        {product.availability}/{product.masterCount}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
        <CardHeader className="flex items-center justify-between border">
          <CardTitle>Monthly Report</CardTitle>
          {monthlyData.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAllMonthsReport}
            >
              <Download className="h-4 w-4" />
              Download All
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Opening</TableHead>
                <TableHead className="text-right">Closing</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((m) => (
                <TableRow key={m.month}>
                  <TableCell>{m.month}</TableCell>
                  <TableCell className="text-right">
                    {m.openingStock}
                  </TableCell>
                  <TableCell className="text-right">
                    {m.closingStock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadMonthlyReport(m.month)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

