"use client"

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
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

// FIXME: Analytics calculation might be slow for large datasets
// TODO: Add real charting library (recharts/chart.js) instead of just tables
// Note: CSV export functionality added in v2.1
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
        className,
      )}
      {...props}
    />
  )
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export function AnalyticsPage() {
  const { products, borrowRecords, getMonthlyReport } = useInventory()

  const monthlyData = getMonthlyReport()

  const totalMasterCount = products.reduce((sum, p) => sum + p.masterCount, 0)
  const totalAvailability = products.reduce((sum, p) => sum + p.availability, 0)
  const totalBorrowed = borrowRecords
    .filter((r) => r.type === "borrow")
    .reduce((sum, r) => sum + r.quantity, 0)
  const totalPurchased = borrowRecords
    .filter((r) => r.type === "purchase")
    .reduce((sum, r) => sum + r.quantity, 0)
  const utilizationRate =
    totalMasterCount > 0
      ? Math.round(
          ((totalMasterCount - totalAvailability) / totalMasterCount) * 100
        )
      : 0

  const downloadMonthlyReport = (month: string) => {
    const monthData = monthlyData.find(m => m.month === month)
    if (!monthData) return

    const csvContent = [
      ['Monthly Analytics Report'],
      ['Month', month],
      [''],
      ['Summary'],
      ['Total Products', products.length],
      ['Opening Stock', monthData.openingStock],
      ['Closing Stock', monthData.closingStock],
      ['Newly Purchased', monthData.newlyPurchased],
      ['Defective Removed', monthData.defectiveRemoved],
      ['Utilized Items', monthData.utilizedItems],
      [''],
      ['Detailed Report'],
      ['Metric', 'Value'],
      ['Total Master Count', totalMasterCount],
      ['Total Availability', totalAvailability],
      ['Total Borrowed', totalBorrowed],
      ['Total Purchased', totalPurchased],
      ['Utilization Rate', `${utilizationRate}%`],
    ]
      .map(row => row.join(','))
      .join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent))
    element.setAttribute('download', `Analytics-${month}-${new Date().getFullYear()}.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const summaryCards = [
    {
      title : "Total Products",
      value: products.length,
      description: "Items in inventory",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Opening Stock",
      value: totalMasterCount,
      description: "Total master count",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Closing Stock",
      value: totalAvailability,
      description: "Currently available",
      icon: TrendingDown,
      color: "text-orange-600",
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate}%`,
      description: "Items in use",
      icon: BarChart3,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'oklch(24.571% 0.12604 288.685)' }}>Analytics</h1>
        <p className="text-muted-foreground">
          Monthly reports and inventory insights
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base" style={{ color: 'oklch(24.571% 0.12604 288.685)' }}>Transaction Summary</CardTitle>
            </div>
            <CardDescription>
              Total borrow and purchase activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Borrowed
                </p>
                <p className="text-3xl font-bold">{totalBorrowed}</p>
                <Badge variant="secondary">items</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Total Purchased
                </p>
                <p className="text-3xl font-bold">{totalPurchased}</p>
                <Badge>items sold</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Low Stock Alert</CardTitle>
            </div>
            <CardDescription>
              Products with less than 30% availability
            </CardDescription>
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
                  .slice(0, 3)
                  .map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate">{product.name}</span>
                      <Badge variant="destructive">
                        {product.availability}/{product.masterCount}
                      </Badge>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle style={{ color: 'oklch(24.571% 0.12604 288.685)' }}>Monthly Report</CardTitle>
              <CardDescription>
                Detailed breakdown of inventory changes by month
              </CardDescription>
            </div>
            {monthlyData.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadMonthlyReport(monthlyData[monthlyData.length - 1].month)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Newly Purchased</TableHead>
                  <TableHead className="text-right">Defective Removed</TableHead>
                  <TableHead className="text-right">Opening Stock</TableHead>
                  <TableHead className="text-right">Closing Stock</TableHead>
                  <TableHead className="text-right">Utilized Items</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600">+{row.newlyPurchased}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-red-600">-{row.defectiveRemoved}</span>
                    </TableCell>
                    <TableCell className="text-right">{row.openingStock}</TableCell>
                    <TableCell className="text-right">{row.closingStock}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{row.utilizedItems}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadMonthlyReport(row.month)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card style={{ border: '2px solid oklch(24.571% 0.12604 288.685)' }}>
        <CardHeader>
          <CardTitle style={{ color: 'oklch(24.571% 0.12604 288.685)' }}>Recent Transactions</CardTitle>
          <CardDescription>Latest borrow and purchase records</CardDescription>
        </CardHeader>
        <CardContent>
          {borrowRecords.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No transactions recorded yet
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrowRecords
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .slice(0, 5)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.studentName}
                        </TableCell>
                        <TableCell>{record.usn}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.type === "borrow" ? "secondary" : "default"
                            }
                          >
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {record.quantity}
                        </TableCell>
                        <TableCell>{record.takenDate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
