import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Users,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Database,
  Globe,
  PieChart,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

interface PreviewMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  colorClass: string;
}

const mockMetrics: Record<string, PreviewMetric[]> = {
  Overview: [
    { title: 'Total Leads Obtained', value: '1,482', change: '+28.4%', isPositive: true, colorClass: 'text-indigo-600 dark:text-indigo-400' },
    { title: 'Sales Qualified Leads', value: '412', change: '+12.5%', isPositive: true, colorClass: 'text-emerald-600 dark:text-emerald-400' },
    { title: 'Lead Conversion Rate', value: '27.8%', change: '+4.2%', isPositive: true, colorClass: 'text-amber-600 dark:text-amber-400' },
    { title: 'Avg Close Time', value: '6.4 Days', change: '-1.2 Days', isPositive: true, colorClass: 'text-rose-600 dark:text-rose-400' },
  ],
  Leads: [
    { title: 'Hot Leads (Immediate)', value: '38 Active', change: '8 New Today', isPositive: true, colorClass: 'text-red-500' },
    { title: 'Follow-ups Required', value: '14 Pending', change: '-3 from yesterday', isPositive: true, colorClass: 'text-indigo-500' },
    { title: 'Demo Requests Completed', value: '128 Total', change: '+18 this week', isPositive: true, colorClass: 'text-emerald-500' },
    { title: 'Dead Leads Archived', value: '94 Leads', change: 'Cleaned up', isPositive: true, colorClass: 'text-slate-400' },
  ],
  Analytics: [
    { title: 'Organic Search Share', value: '42.1%', change: '+6.8%', isPositive: true, colorClass: 'text-sky-500' },
    { title: 'Paid Campaigns Return', value: '4.8x ROI', change: '+0.4x', isPositive: true, colorClass: 'text-teal-500' },
    { title: 'Referral Close Rate', value: '35.4%', change: '+5.1%', isPositive: true, colorClass: 'text-fuchsia-500' },
    { title: 'Social Outlets Conversion', value: '18.9%', change: '-0.8%', isPositive: false, colorClass: 'text-pink-500' },
  ],
};

const mockGraphData: Record<string, { label: string; height: string; val: number }[]> = {
  Overview: [
    { label: 'Jan', height: 'h-16', val: 320 },
    { label: 'Feb', height: 'h-24', val: 480 },
    { label: 'Mar', height: 'h-28', val: 560 },
    { label: 'Apr', height: 'h-36', val: 720 },
    { label: 'May', height: 'h-48', val: 960 },
    { label: 'Jun', height: 'h-40', val: 820 },
    { label: 'Jul', height: 'h-52', val: 1040 },
  ],
  Leads: [
    { label: 'Mon', height: 'h-28', val: 12 },
    { label: 'Tue', height: 'h-36', val: 18 },
    { label: 'Wed', height: 'h-44', val: 22 },
    { label: 'Thu', height: 'h-32', val: 15 },
    { label: 'Fri', height: 'h-48', val: 26 },
    { label: 'Sat', height: 'h-16', val: 8 },
    { label: 'Sun', height: 'h-12', val: 5 },
  ],
  Analytics: [
    { label: 'Social', height: 'h-40', val: 40 },
    { label: 'Search', height: 'h-52', val: 80 },
    { label: 'Direct', height: 'h-24', val: 24 },
    { label: 'Referral', height: 'h-32', val: 32 },
    { label: 'Email', height: 'h-48', val: 48 },
    { label: 'Ads', height: 'h-36', val: 36 },
    { label: 'Other', height: 'h-16', val: 16 },
  ],
};

// Lifecycle steps data
interface LifecycleStep {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  metric: string;
}

const lifecycleSteps: LifecycleStep[] = [
  {
    title: 'Lead Capture & Ingestion',
    subtitle: 'Step 1',
    icon: <Database className="h-5 w-5" />,
    description: 'Leads flow in automatically from web forms, campaigns, and integrations. Our API handles verification, clean-up, and formatting instantly.',
    metric: 'Instant Ingestion Time',
  },
  {
    title: 'Smart Allocation',
    subtitle: 'Step 2',
    icon: <Globe className="h-5 w-5" />,
    description: 'Intelligent distribution routes leads based on agent availability, historical conversion success, and industry criteria.',
    metric: '99.8% Perfect Routing',
  },
  {
    title: 'Pipeline Management & Follow-up',
    subtitle: 'Step 3',
    icon: <Target className="h-5 w-5" />,
    description: 'Sales agents filter and prioritize prospects using robust search, customizable stages, and instant notes editing.',
    metric: '40% Increase in Follow-up Speed',
  },
  {
    title: 'Analytics & Performance Review',
    subtitle: 'Step 4',
    icon: <PieChart className="h-5 w-5" />,
    description: 'Admins monitor agent output, lead-to-opportunity ratios, and pipeline velocity charts via clean, single-glance dashboard reviews.',
    metric: '100% Data Integrity',
  },
];

export const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Leads' | 'Analytics'>('Overview');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Decorative Shifting Ambient Background Glow Blobs */}
      <div className="absolute left-[15%] top-[10%] -z-10 h-[350px] w-[350px] rounded-full ambient-glow-1 animate-pulse-slow pointer-events-none" />
      <div className="absolute right-[10%] top-[30%] -z-10 h-[400px] w-[400px] rounded-full ambient-glow-2 animate-float pointer-events-none" />
      <div className="absolute left-[5%] bottom-[15%] -z-10 h-[380px] w-[380px] rounded-full ambient-glow-2 animate-float-delayed pointer-events-none" />

      {/* Modern Header / Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 px-4 py-3 backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-950/70 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <span className="hidden truncate text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-white dark:to-slate-300 sm:inline sm:text-xl">
              SmartLeads
            </span>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-transparent p-2.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-4 md:flex">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-transparent p-2.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button id="home-dashboard-btn" variant="primary" size="sm" className="rounded-xl border-none bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold shadow-lg shadow-indigo-500/20 sm:size-auto sm:px-4 sm:py-2">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button id="home-login-btn" variant="ghost" size="sm" className="rounded-xl font-semibold dark:text-slate-300">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button id="home-register-btn" variant="primary" size="sm" className="rounded-xl border-none bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold shadow-md shadow-indigo-500/10">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              aria-label="Close navigation menu"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute inset-x-4 top-20 z-50 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:inset-x-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Menu</p>
                <button
                  type="button"
                  className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-900"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <span>Toggle theme</span>
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button id="home-mobile-dashboard-btn" variant="primary" className="w-full justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold shadow-lg shadow-indigo-500/20">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button id="home-mobile-login-btn" variant="ghost" className="w-full justify-center rounded-xl font-semibold dark:text-slate-300">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button id="home-mobile-register-btn" variant="primary" className="w-full justify-center rounded-xl border-none bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold shadow-md shadow-indigo-500/10">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 text-center lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-4xl space-y-8">
          
        

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white leading-tight">
            Convert Pipeline Prospects to{' '}
            <span className="relative inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-violet-400">
              Loyal Customers
              <span className="absolute bottom-1 left-0 h-1.5 w-full bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full" />
            </span>{' '}
            with Intelligence
          </h1>

          {/* Subtext */}
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Stop losing leads in messy spreadsheets. SmartLeads brings speed, transparency, role-based controls, and real-time conversion monitoring into one elegant dashboard.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button id="home-hero-dashboard-btn" size="lg" className="rounded-xl px-8 shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 active:scale-95 transition-all duration-200">
                  Access Your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button id="home-hero-register-btn" size="lg" className="rounded-xl px-8 shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 active:scale-95 transition-all duration-200">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button id="home-hero-login-btn" size="lg" variant="outline" className="rounded-xl px-8 border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 2. Interactive Live Dashboard Preview Card Widget */}
        <div className="mt-16 sm:mt-20 lg:mt-24 max-w-5xl mx-auto animate-slide-up">
          <div className="glass-card overflow-hidden rounded-3xl border border-slate-200/60 shadow-2xl dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 p-1.5 md:p-3">
            
            {/* Top Toolbar mimic */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200/50 px-4 py-3.5 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-4 text-xs font-semibold tracking-wider text-slate-400 uppercase hidden sm:inline">
                  Interactive Live Preview
                </span>
              </div>
              
              {/* Tabs */}
              <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900 border dark:border-slate-800">
                {(['Overview', 'Leads', 'Analytics'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-white text-indigo-600 shadow dark:bg-slate-800 dark:text-white'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Content Area */}
            <div className="bg-slate-50/30 p-4 md:p-6 dark:bg-slate-950/20 min-h-[300px]">
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {mockMetrics[activeTab].map((metric) => (
                  <div
                    key={metric.title}
                    className="glass-card rounded-2xl p-4 text-left border border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 shadow-sm hover:scale-[1.02] transition-transform duration-300"
                  >
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide truncate">{metric.title}</p>
                    <div className="mt-2 flex items-baseline justify-between gap-1">
                      <span className={`text-xl md:text-2xl font-extrabold ${metric.colorClass}`}>
                        {metric.value}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphical Trend and Live Mimic Rows */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Chart */}
                <div className="glass-card md:col-span-2 rounded-2xl p-5 text-left border border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800/60">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Weekly Performance</h4>
                      <p className="text-xs text-slate-400">Fluctuation breakdown indicators</p>
                    </div>
                    <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 text-xs font-bold text-indigo-500">
                      Real-time Feed
                    </span>
                  </div>
                  
                  {/* CSS Drawn Animating Chart */}
                  <div className="mt-8 flex h-40 items-end justify-between gap-3 px-2">
                    {mockGraphData[activeTab].map((bar) => (
                      <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="relative w-full rounded-t bg-gradient-to-t from-indigo-500 to-violet-500/80 group-hover:from-indigo-600 group-hover:to-violet-600 transition-all duration-500 shadow-sm shadow-indigo-500/10" style={{ height: `${parseInt(bar.height.split('-')[1]) * 2.5}px` }}>
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-900 dark:bg-white text-[9px] font-extrabold text-white dark:text-slate-900 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {bar.val}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar Recent Event Log Mimic */}
                <div className="glass-card rounded-2xl p-5 text-left border border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Recent Activities</h4>
                    <p className="text-xs text-slate-400">Dynamic system notifications</p>
                  </div>
                  <div className="mt-4 flex-1 space-y-3.5">
                    {[
                      { text: 'New Lead: Sarah Jenkins', sub: 'Status: Contacted', time: '2m ago', color: 'bg-indigo-500' },
                      { text: 'User Assigned: Lead #412', sub: 'Assigned to Agent Max', time: '14m ago', color: 'bg-emerald-500' },
                      { text: 'CSV Generated & Downloaded', sub: 'Exported by Administrator', time: '1h ago', color: 'bg-amber-500' },
                    ].map((act, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs">
                        <span className={`mt-1 h-2 w-2 rounded-full ${act.color} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{act.text}</p>
                          <p className="text-[10px] text-slate-400">{act.sub}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Feature Grid Section */}
      <section className="border-t border-slate-200/50 bg-slate-100/40 py-20 dark:border-slate-800/40 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for Speed, Crafted for Clarity
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Every detail is meticulously planned to guarantee your team focuses on selling rather than navigating complicated administrative screens.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Users className="h-6 w-6 text-indigo-500" />,
                title: 'Granular Lead Control',
                desc: 'Instantly view, edit, search, and delete leads. Use beautiful sliders and modals that adapt instantly to input data changes.',
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
                title: 'Instant CSV Data Exports',
                desc: 'Generate perfect spreadsheets with one single click. Streamline data transfers into reporting suites with high-performance exports.',
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-violet-500" />,
                title: 'Role-Based Access Guard',
                desc: 'Keep private resources safe. Restrict critical views like user management and database controls strictly to verified administrators.',
              },
              {
                icon: <Target className="h-6 w-6 text-amber-500" />,
                title: 'Multi-Condition Filtering',
                desc: 'Refine leads by Status, Lead Source, and Agent Assignment seamlessly using debounced searches that preserve backend bandwidth.',
              },
              {
                icon: <Globe className="h-6 w-6 text-sky-500" />,
                title: 'Polished Dual Themes',
                desc: 'Toggle between a beautiful dark mode and a crisp clean light layout without page flashing, preserving state effortlessly.',
              },
              {
                icon: <Sparkles className="h-6 w-6 text-purple-500" />,
                title: 'Interactive Visualizations',
                desc: 'Enjoy subtle micro-animations, premium glassmorphism, responsive menus, and glowing interactive steps that react to cursor hovers.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card glass-card-interactive rounded-2xl p-6 text-left border border-slate-200/40 dark:border-slate-800/40 bg-white/60 dark:bg-slate-900/40 shadow-sm"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800/50 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{feature.title}</h3>
                <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Lead Flow Visualizer Process Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Interactive Lead Lifecycle Process
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Click on each step below to inspect how lead pipelines transition and how SmartLeads automates the sales journey.
          </p>
        </div>

        {/* Steps Horizontal Bar */}
        <div className="relative mx-auto max-w-4xl">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-800/60 rounded -z-10" />
          
          {/* Animated pulsing connector trail */}
          <div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded -z-10 transition-all duration-500"
            style={{ width: `${(activeStep / (lifecycleSteps.length - 1)) * 100}%` }}
          />

          <div className="flex justify-between items-center">
            {lifecycleSteps.map((step, index) => {
              const isActive = index === activeStep;
              const isPassed = index < activeStep;
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-300 shadow-md ${
                      isActive
                        ? 'scale-110 bg-indigo-500 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : isPassed
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className={`mt-3 text-xs font-bold transition-colors hidden sm:block ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}>
                    {step.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Selected Panel (Click to Morph card) */}
        <div className="mt-10 mx-auto max-w-2xl animate-fade-in">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 text-left shadow-lg">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
              Interactive Stage Breakdown
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
              {lifecycleSteps[activeStep].title}
            </h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {lifecycleSteps[activeStep].description}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-slate-200/50 pt-4 dark:border-slate-800/60">
              <span className="text-xs text-slate-400 font-semibold">Key Metric:</span>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {lifecycleSteps[activeStep].metric}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative overflow-hidden border-t border-slate-200/60 dark:border-slate-800/40 bg-white dark:bg-slate-950 py-20 text-center">
        {/* Shifting radial ambient block */}
        <div className="absolute left-[35%] top-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[90px] animate-pulse-slow" />

        <div className="mx-auto max-w-4xl px-6 space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Supercharge Your Sales Pipeline?
          </h2>
          <p className="mx-auto max-w-xl text-slate-500 dark:text-slate-400">
            Sign up now to experience role management, custom filters, automated statistics metrics, and premium exports first-hand.
          </p>
          <div className="flex justify-center pt-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button id="home-footer-dashboard-btn" size="lg" className="rounded-xl px-10 shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 active:scale-95 transition-all">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register">
                  <Button id="home-footer-register-btn" size="lg" className="rounded-xl px-10 shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-violet-600 hover:scale-105 active:scale-95 transition-all">
                    Register Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button id="home-footer-login-btn" size="lg" variant="outline" className="rounded-xl px-10 border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="border-t border-slate-200/50 bg-slate-50/50 py-8 dark:border-slate-800/40 dark:bg-slate-950/70 text-center">
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SmartLeads Dashboard. Powered by MERN + TypeScript. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
};
