import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User, Settings, BarChart3, Users, TrendingUp, CheckSquare2, Clipboard, Activity, AlertCircle } from 'lucide-react';

/**
 * RootLayout Component
 * 
 * CONCEPT: Role-aware navigation system
 * 
 * This layout serves as the main wrapper for all authenticated pages.
 * It displays different navigation menus based on the user's role.
 * 
 * FEATURES:
 * - Dynamic sidebar based on user role
 * - User profile section with role switcher (for demo)
 * - Top navigation bar
 * - Responsive design
 */

const RootLayout = ({ children }) => {
  const { currentUser, switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const detailsRef = React.useRef(null);

  // Auto-navigate to dashboard when role changes
  React.useEffect(() => {
    const rolePathMap = {
      CEO: '/dashboards/ceo',
      Manager: '/dashboards/manager',
      Senior: '/dashboards/senior',
      Employee: '/dashboards/employee'
    };
    
    const newPath = rolePathMap[currentUser?.userRole];
    if (newPath && location.pathname !== newPath && !location.pathname.startsWith(newPath)) {
      navigate(newPath);
    }
  }, [currentUser?.userRole, navigate, location.pathname]);

  // Handle role switch with details closing
  const handleRoleSwitch = (roleKey) => {
    switchRole(roleKey);
    // Close the details element
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  // Define navigation items based on role
  const navigationConfig = {
    CEO: [
      { name: 'Dashboard', icon: BarChart3, path: '/dashboards/ceo' },
      { name: 'User Management', icon: Users, path: '/dashboards/ceo/users' },
      { name: 'Live Activity', icon: Activity, path: '/dashboards/ceo/activity' },
      { name: 'Analytics', icon: TrendingUp, path: '/dashboards/ceo/analytics' },
      { name: 'System Performance', icon: Settings, path: '/dashboards/ceo/performance' },
    ],
    Manager: [
      { name: 'Dashboard', icon: BarChart3, path: '/dashboards/manager' },
      { name: 'Team', icon: Users, path: '/dashboards/manager/team' },
      { name: 'Performance', icon: TrendingUp, path: '/dashboards/manager/performance' },
      { name: 'Tasks', icon: CheckSquare2, path: '/dashboards/manager/tasks' },
      { name: 'Reports', icon: Clipboard, path: '/dashboards/manager/reports' },
    ],
    Senior: [
      { name: 'Dashboard', icon: BarChart3, path: '/dashboards/senior' },
      { name: 'Projects', icon: Clipboard, path: '/dashboards/senior/projects' },
      { name: 'Team', icon: Users, path: '/dashboards/senior/team' },
      { name: 'Progress', icon: Activity, path: '/dashboards/senior/progress' },
      { name: 'Tasks', icon: CheckSquare2, path: '/dashboards/senior/tasks' },
    ],
    Employee: [
      { name: 'Dashboard', icon: BarChart3, path: '/dashboards/employee' },
      { name: 'My Tasks', icon: CheckSquare2, path: '/dashboards/employee/tasks' },
      { name: 'Work Sessions', icon: Activity, path: '/dashboards/employee/sessions' },
      { name: 'Progress', icon: TrendingUp, path: '/dashboards/employee/progress' },
      { name: 'Flags', icon: AlertCircle, path: '/dashboards/employee/flags' },
    ]
  };

  const navItems = navigationConfig[currentUser?.userRole] || navigationConfig.Employee;
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#0a0514] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-[#190e2d] border-r border-[#2a1b4d] flex flex-col transition-all duration-300 relative z-20`}>
        
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-[#2a1b4d]">
          <div className="w-8 h-8 bg-emerald-400 rounded flex items-center justify-center text-black font-bold text-sm">
            C
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-bold">
              Collab<span className="text-emerald-400">Tracker</span>
            </span>
          )}
        </div>

        {/* Role Indicator */}
        {isSidebarOpen && (
          <div className="px-4 py-3 bg-white/5 border-b border-[#2a1b4d]">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Current Role</p>
            <p className="text-sm font-semibold text-emerald-400">{currentUser?.userRole}</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-emerald-400/20 text-emerald-400 border-l-2 border-emerald-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-[#2a1b4d] p-3">
          {isSidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                <div className={`w-8 h-8 ${currentUser?.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {currentUser?.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{currentUser?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{currentUser?.role}</p>
                </div>
              </div>
              
              {/* Role Switcher for Demo */}
              <details ref={detailsRef} className="group">
                <summary className="cursor-pointer px-2 py-1.5 text-xs text-gray-400 hover:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Switch Role (Demo)
                </summary>
                <div className="mt-2 space-y-1 pl-2">
                  {['ceo', 'manager', 'senior', 'employee'].map((roleKey) => (
                    <button
                      key={roleKey}
                      onClick={() => handleRoleSwitch(roleKey)}
                      className="text-xs text-gray-400 hover:text-emerald-400 block w-full text-left px-2 py-1 rounded hover:bg-white/5 capitalize"
                    >
                      {roleKey}
                    </button>
                  ))}
                </div>
              </details>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-400 hover:text-red-400 rounded hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 ${currentUser?.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {currentUser?.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#190e2d] border-b border-[#2a1b4d] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {currentUser?.name}</h1>
            <p className="text-sm text-gray-400">{currentUser?.role} {currentUser?.department}</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(circle_at_10%_10%,#26124b_0%,#150a2e_40%,#0a0514_100%)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
