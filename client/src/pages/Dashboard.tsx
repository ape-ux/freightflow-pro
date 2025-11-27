import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDispatches, mockQuotes } from "@/mocks/data";
import {
  BarChart3,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Package,
  Plus,
  Timer,
  Truck,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'up' | 'down';
  icon: React.ElementType;
  iconColor: string;
}

function KPICard({ title, value, change, changeType, icon: Icon, iconColor }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`rounded-lg p-2 ${iconColor}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {changeType === 'up' ? (
            <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}>
            {change}%
          </span>
          <span className="ml-1">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Status Badge Component
interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    expired: 'bg-red-100 text-red-700 border-red-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    in_transit: 'bg-blue-100 text-blue-700 border-blue-200',
    at_pickup: 'bg-orange-100 text-orange-700 border-orange-200',
    delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dispatched: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const variant = variants[status] || variants.pending;

  return (
    <Badge variant="outline" className={`${variant} text-xs font-medium`}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

export default function Dashboard() {
  // Calculate KPI data from mock data
  const activeShipments = mockDispatches.filter(
    d => ['dispatched', 'at_pickup', 'in_transit', 'at_delivery'].includes(d.status)
  ).length;

  const pendingQuotes = mockQuotes.filter(q => q.status === 'pending').length;

  const monthlyRevenue = mockDispatches.reduce((sum, d) => sum + d.totalRevenue, 0);

  const avgTransitTime = 2.3; // Example calculation

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to FreightFlow Pro. Here's what's happening today.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Shipments"
          value={activeShipments}
          change={12.5}
          changeType="up"
          icon={Package}
          iconColor="bg-indigo-500"
        />
        <KPICard
          title="Pending Quotes"
          value={pendingQuotes}
          change={8.2}
          changeType="up"
          icon={FileText}
          iconColor="bg-emerald-500"
        />
        <KPICard
          title="Monthly Revenue"
          value={`$${(monthlyRevenue / 1000).toFixed(1)}k`}
          change={15.3}
          changeType="up"
          icon={DollarSign}
          iconColor="bg-orange-500"
        />
        <KPICard
          title="Avg. Transit Time"
          value={`${avgTransitTime} days`}
          change={5.1}
          changeType="down"
          icon={Timer}
          iconColor="bg-amber-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 hover:border-orange-500 hover:bg-orange-50"
          >
            <div className="rounded-full bg-orange-100 p-3">
              <Plus className="h-5 w-5 text-orange-600" />
            </div>
            <span className="font-semibold">New Quote</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 hover:border-blue-500 hover:bg-blue-50"
          >
            <div className="rounded-full bg-blue-100 p-3">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-semibold">Create Dispatch</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 hover:border-emerald-500 hover:bg-emerald-50"
          >
            <div className="rounded-full bg-emerald-100 p-3">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="font-semibold">Track Shipment</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 hover:border-purple-500 hover:bg-purple-50"
          >
            <div className="rounded-full bg-purple-100 p-3">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-semibold">View Reports</span>
          </Button>
        </div>
      </div>

      {/* Active Shipments and Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shipments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Active Shipments</CardTitle>
              <Badge variant="secondary">{activeShipments}</Badge>
            </div>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockDispatches
              .filter(d => ['in_transit', 'at_pickup', 'dispatched'].includes(d.status))
              .slice(0, 3)
              .map((dispatch) => (
                <div
                  key={dispatch.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{dispatch.containerNumber}</span>
                      <StatusBadge status={dispatch.status} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">
                        {dispatch.origin.city}, {dispatch.origin.state} → {dispatch.destination.city}, {dispatch.destination.state}
                      </span>
                    </div>
                    {dispatch.eta && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>ETA: {new Date(dispatch.eta).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {activeShipments === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No active shipments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quotes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Quotes</CardTitle>
              <CardDescription>Latest quote requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockQuotes.slice(0, 4).map((quote) => (
              <div
                key={quote.id}
                className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{quote.quoteNumber}</span>
                    <StatusBadge status={quote.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {quote.customerName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">
                      {quote.origin.city}, {quote.origin.state} → {quote.destination.city}, {quote.destination.state}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-orange-600">
                    ${quote.totalRate.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
