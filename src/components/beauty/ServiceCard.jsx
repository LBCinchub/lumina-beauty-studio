import { motion } from "framer-motion";

export default function ServiceCard({ service, isSelected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 group ${
        isSelected
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-border hover:border-muted-foreground/30"
      }`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-2xl mb-1 block">{service.emoji}</span>
        <h3 className="text-lg font-display font-semibold text-white">
          {service.label}
        </h3>
        <p className="text-xs text-white/70 font-body mt-0.5">
          {service.description}
        </p>
      </div>
      {isSelected && (
        <motion.div
          layoutId="service-ring"
          className="absolute inset-0 border-2 border-primary rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}