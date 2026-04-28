import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ToolCard = ({ title, description, icon: Icon, href, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={href}>
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1 cursor-pointer">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
            style={{ background: gradient || "var(--hero-gradient)" }}
          />
          <div
            className="mb-4 inline-flex items-center justify-center rounded-lg p-3"
            style={{ background: gradient || "var(--hero-gradient)" }}
          >
            <Icon className="h-6 w-6 text-card" strokeWidth={2} />
          </div>
          <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
