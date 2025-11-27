import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockQuotes } from "@/mocks/data";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  MapPin,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    declined: 'bg-red-100 text-red-700 border-red-200',
  };

  const variant = variants[status] || variants.draft;

  return (
    <Badge variant="outline" className={`${variant} text-xs font-medium capitalize`}>
      {status}
    </Badge>
  );
}

export default function QuotesList() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter quotes based on status and search
  const filteredQuotes = mockQuotes.filter(quote => {
    const matchesStatus = selectedStatus === 'all' || quote.status === selectedStatus;
    const matchesSearch =
      searchQuery === '' ||
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count quotes by status
  const statusCounts = {
    all: mockQuotes.length,
    draft: mockQuotes.filter(q => q.status === 'draft').length,
    pending: mockQuotes.filter(q => q.status === 'pending').length,
    accepted: mockQuotes.filter(q => q.status === 'accepted').length,
    expired: mockQuotes.filter(q => q.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground mt-1">
            Manage freight quotes and pricing
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Quote
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Tabs */}
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
          <TabsList>
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-1">{statusCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft <Badge variant="secondary" className="ml-1">{statusCounts.draft}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending <Badge variant="secondary" className="ml-1">{statusCounts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted <Badge variant="secondary" className="ml-1">{statusCounts.accepted}</Badge>
            </TabsTrigger>
            <TabsTrigger value="expired">
              Expired <Badge variant="secondary" className="ml-1">{statusCounts.expired}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes, customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredQuotes.length} {filteredQuotes.length === 1 ? 'Quote' : 'Quotes'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Container</TableHead>
                  <TableHead className="text-right">Total Rate</TableHead>
                  <TableHead className="text-center">Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8 opacity-50" />
                        <p>No quotes found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {quote.quoteNumber}
                      </TableCell>
                      <TableCell>{quote.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="truncate max-w-[100px]">
                            {quote.origin.city}, {quote.origin.state}
                          </span>
                          <ArrowRight className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[100px]">
                            {quote.destination.city}, {quote.destination.state}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {quote.serviceType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {quote.containerInfo.size}' {quote.containerInfo.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-orange-600">
                        ${quote.totalRate.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={
                            quote.marginPercent >= 20
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }
                        >
                          {quote.marginPercent}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={quote.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(quote.validUntil).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Quote</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Send to Customer</DropdownMenuItem>
                            {quote.status === 'accepted' && (
                              <DropdownMenuItem>Convert to Dispatch</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
