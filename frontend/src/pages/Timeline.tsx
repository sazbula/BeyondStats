// src/pages/Timeline.tsx
import "../time-machine.css";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TimelineWorld from "@/components/timeline/TimelineWorld";

const Timeline = () => {
  return (
    <div className="time-machine min-h-screen relative">
      {/* Header (same style as other game pages) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50 flex items-center gap-4"
      >
        <Link to="/games">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </motion.div>

      <TimelineWorld />
    </div>
  );
};

export default Timeline;
