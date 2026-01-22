import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, BarChart3, Gamepad2, ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Explore the Map",
    description: "Visualize gender inequality across 150+ countries. Compare scores, see patterns, and discover insights.",
    icon: Globe,
    path: "/explore",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Country Insights",
    description: "Deep dive into any country's data. See economic, health, and education gaps with historical trends.",
    icon: BarChart3,
    path: "/country",
    color: "from-accent/40 to-accent/10",
  },
  {
    title: "Mini-Games",
    description: "Learn through play. Challenge your assumptions with interactive quizzes and simulations.",
    icon: Gamepad2,
    path: "/games",
    color: "from-secondary to-secondary/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function NavigationCards() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            Start Exploring
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose your path to understanding gender inequality data
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {cards.map((card) => (
            <motion.div key={card.path} variants={cardVariants}>
              <Link to={card.path} className="block h-full">
                <div className="nav-card h-full group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6`}>
                    <card.icon className="w-7 h-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
