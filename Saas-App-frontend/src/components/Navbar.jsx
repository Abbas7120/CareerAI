import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

const btn =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
const ghost = `${btn} bg-blue-400 text-white hover:bg-accent hover:text-accent-foreground h-9 px-3 `;
const hero = `${btn} bg-blue-400 text-primary-foreground font-semibold shadow-lg hover:opacity-90 h-9 px-3`;

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <nav className="sticky top-0 z-50 border-b border-border glass">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className=" rounded-lg p-1.5">
            <Sparkles className="h-5 w-5 text-card bg-white" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            CareerAI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isDashboard ? (
            <Link to="/" className={ghost}>
              Home
            </Link>
          ) : (
            <>
              <Link to="/dashboard" className={hero}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
