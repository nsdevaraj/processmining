import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Overview", path: "/overview" },
  { title: "Process Flow", path: "/process-flow" },
  // { title: "Conformance", path: "/conformance" },
  { title: "Lead Time", path: "/lead-time" },
  { title: "Root Causes", path: "/root-causes" },
  // { title: "Case Replay", path: "/case-replay" },
];

export function Navbar() {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-process-primary">
                ProcessMiner
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "text-process-primary border-b-2 border-process-primary"
                          : "text-foreground hover:text-process-primary"
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="flex overflow-x-auto space-x-4 px-4 py-2 whitespace-nowrap">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium
                ${
                  isActive
                    ? "text-process-primary border-b-2 border-process-primary"
                    : "text-foreground hover:text-process-primary"
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
