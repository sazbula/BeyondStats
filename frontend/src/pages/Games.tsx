import { motion } from "framer-motion";
import { HelpCircle, Clock, ShoppingCart } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { GameCard } from "@/components/games/GameCard";

const games = [
  {
    title: "Myth or Fact",
    description: "Test your knowledge about gender inequality with a series of true or false questions. Challenge common misconceptions.",
    icon: HelpCircle,
    path: "/games/myth-or-fact",
    color: "from-primary/20 to-primary/5",
  },
  {
    title: "Time Machine",
    description: "Travel through time and see how gender equality has evolved across decades. Witness the changes year by year.",
    icon: Clock,
    path: "/games/time-machine",
    color: "from-accent/40 to-accent/10",
  },
  {
    title: "Purchasing Power",
    description: "Experience the economic gap firsthand. Compare what men vs women can afford with the same jobs in different countries.",
    icon: ShoppingCart,
    path: "/games/purchasing-power",
    color: "from-secondary to-secondary/30",
  },
];

const Games = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Mini-Games
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn about gender inequality through interactive experiences. 
            These games are designed to help you understand complex data in an engaging way.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {games.map((game, index) => (
            <GameCard
              key={game.path}
              title={game.title}
              description={game.description}
              icon={game.icon}
              path={game.path}
              color={game.color}
              delay={0.1 + index * 0.15}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Games;
