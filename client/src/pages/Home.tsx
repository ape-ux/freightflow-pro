import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Loader2, BarChart3, Truck, FileText, Settings } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin w-8 h-8" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
              <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
            </div>
            <Button asChild>
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Freight Quote & Dispatch Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your logistics operations with intelligent quoting, real-time dispatch management, and AI-driven carrier selection.
            </p>
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>Get Started</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Smart Quoting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate accurate freight quotes instantly with AI-powered pricing analysis and multi-carrier rate comparison.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Dispatch Board</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage shipments in real-time with live tracking, status updates, and automated notifications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gain insights into profitability, carrier performance, and lane optimization with comprehensive dashboards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="w-8 h-8 text-orange-600 mb-2" />
                <CardTitle>Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with external carriers, port APIs, and automation platforms for seamless operations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name || "User"}</span>
            <Button variant="outline" onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Welcome to FreightFlow Pro. Start by creating a quote or managing your shipments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Create Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate a new freight quote with AI-powered pricing and carrier recommendations.
              </CardDescription>
              <Button className="mt-4 w-full" variant="outline">
                New Quote
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Truck className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Dispatch Board</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View and manage all active shipments with real-time tracking and status updates.
              </CardDescription>
              <Button className="mt-4 w-full" variant="outline">
                View Dispatches
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Review profitability metrics, carrier performance, and lane analytics.
              </CardDescription>
              <Button className="mt-4 w-full" variant="outline">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
          <p className="text-blue-800 mb-4">
            FreightFlow Pro is your all-in-one platform for freight logistics. Here are the key features:
          </p>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Create and manage freight quotes with AI-powered pricing</li>
            <li>Dispatch shipments and track them in real-time</li>
            <li>Compare rates from multiple carriers</li>
            <li>Analyze profitability and performance metrics</li>
            <li>Integrate with external carrier APIs and systems</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
