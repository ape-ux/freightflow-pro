import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { CheckCircle, Users, Zap, Monitor } from "lucide-react";

export default function ApeGlobalLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                >
                  <path d="M16 2L4 8v16l12 6 12-6V8L16 2zm0 2.5L25 9l-9 4.5L7 9l9-4.5zM6 10.5l9 4.5v10.5l-9-4.5V10.5zm20 0v10.5l-9 4.5V15l9-4.5z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">ApeGlobal</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Contact
              </a>
            </nav>

            {/* Sign In Button */}
            <Button variant="outline" asChild className="rounded-full px-6">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Simplify Your Workflow.
                <br />
                <span className="text-blue-600">Boost Your Productivity.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Our intuitive web application streamlines your daily tasks, integrates
                seamless collaboration, and provides powerful insights to achieve your
                goals faster.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild className="rounded-md px-8 py-6 text-base">
                  <a href={getLoginUrl()}>Get Started for Free</a>
                </Button>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-500 max-w-xs">
                      apeglobal.io/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard Preview Content */}
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-4">
                    {/* Sidebar */}
                    <div className="w-48 bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">ApeGlobal</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                          <Monitor className="w-3 h-3" />
                          Dashboard
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 rounded text-xs">
                          <Users className="w-3 h-3" />
                          Team
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 rounded text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Tasks
                        </div>
                      </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 space-y-3">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Overview</div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-blue-50 rounded p-2">
                            <div className="text-lg font-bold text-blue-600">24</div>
                            <div className="text-xs text-gray-500">Active</div>
                          </div>
                          <div className="bg-green-50 rounded p-2">
                            <div className="text-lg font-bold text-green-600">156</div>
                            <div className="text-xs text-gray-500">Completed</div>
                          </div>
                          <div className="bg-purple-50 rounded p-2">
                            <div className="text-lg font-bold text-purple-600">12</div>
                            <div className="text-xs text-gray-500">Pending</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Performance</div>
                        <div className="flex items-end gap-1 h-16">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-blue-500 rounded-t"
                              style={{ height: `${h}%` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Effortless Task Management
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Create, assign, and track projects with our easy-to-use board.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Seamless Team Collaboration
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Connect with your team in real-time, share documents, and communicate instantly.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gain valuable insights from interactive reports and optimize your performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Trusted by Professionals</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">JD</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Jane Doe, Marketing Manager</div>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                      "ApeGlobal has completely transformed how we manage our campaigns. It's a game-changer for our team efficiency."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-600">JS</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">John Smith, Entrepreneur</div>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                      "The most intuitive and powerful tool I've used. It saves me hours every week, allowing me to focus on growth."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ApeGlobal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
