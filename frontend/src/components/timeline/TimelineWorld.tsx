import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Character from "./Character";
import TimelineEvent, { TimelineEventData } from "./TimelineEvent";
import ParallaxLayer from "./ParallaxLayer";
import YearMarker from "./YearMarker";

const TIMELINE_EVENTS: TimelineEventData[] = [
  {
    id: "rights-1848-seneca",
    year: 1848,
    title: "Seneca Falls Convention",
    description:
      "The first women’s rights convention organized by women. The Declaration of Sentiments demanded equality, including the controversial call for women’s suffrage, launching an organized rights movement.",
    type: "document",
    era: "past",
    position: 700,
    scale: 3,
  },
  {
    id: "vote-1893-nz",
    year: 1893,
    title: "Women gain the right to vote (New Zealand)",
    description:
      "New Zealand became the first self-governing country to grant women the right to vote in national elections, setting a global precedent for women’s political participation.",
    type: "ballot",
    era: "past",
    position: 1200,
    scale: 2,
  },
  {
    id: "vote-1895-sa",
    year: 1895,
    title: "Equal political rights (South Australia)",
    description:
      "South Australia granted women both the right to vote and to stand for Parliament, becoming the first electorate to offer full political equality.",
    type: "ballot",
    era: "past",
    position: 1400,
    scale: 2,
  },
  {
    id: "pay-1963-equalpay",
    year: 1963,
    title: "Equal Pay Act (United States)",
    description:
      "The Equal Pay Act prohibited wage discrimination based on sex, making economic equality a legal principle—even though pay gaps persisted.",
    type: "coins",
    era: "mid",
    position: 2900,
    scale: 2,
  },
  {
    id: "edu-1972-titleix",
    year: 1972,
    title: "Title IX (United States)",
    description:
      "Banned sex-based discrimination in federally funded education, dramatically expanding women’s access to universities, sports, and academic careers.",
    type: "document",
    era: "mid",
    position: 3250,
    scale: 3,
  },
  {
    id: "repro-1973-roe",
    year: 1973,
    title: "Roe v. Wade",
    description:
      "The U.S. Supreme Court recognized a constitutional right to abortion, framing reproductive choice as a matter of privacy and bodily autonomy.",
    type: "gavel",
    era: "mid",
    position: 3550,
    scale: 3,
  },
  {
    id: "leader-1980-iceland",
    year: 1980,
    title: "First democratically elected female president",
    description:
      "Vigdís Finnbogadóttir was elected president of Iceland, becoming the world’s first woman democratically elected as head of state and shifting global norms on women’s leadership.",
    type: "podium",
    era: "mid",
    position: 4000,
    scale: 2,
  },
  {
    id: "care-2000-iceland",
    year: 2000,
    title: "Equal parental leave for fathers (Iceland)",
    description:
      "Introduced “use it or lose it” parental leave for dads, normalizing men as caregivers and reducing the assumption that childcare is primarily women’s responsibility.",
    type: "care",
    era: "modern",
    position: 4500,
    scale: 2,
  },
  {
    id: "family-2008-korea",
    year: 2008,
    title: "South Korea abolishes head-of-family system",
    description:
      "Abolished a legal system that made men automatic household heads, ending enforced provider roles and enabling shared parental authority—an equality milestone for men, too.",
    type: "scales",
    era: "modern",
    position: 4900,
    scale: 2,
  },
  {
    id: "fgm-2011-un",
    year: 2011,
    title: "UN resolution against female genital mutilation",
    description:
      "The United Nations called for a global ban on FGM, recognizing it as a human rights violation and strengthening international prevention and protection efforts.",
    type: "shield",
    era: "modern",
    position: 5200,
    scale: 2,
  },
  {
    id: "custody-2013-germany",
    year: 2013,
    title: "Shared custody reforms (Germany)",
    description:
      "Family-law reforms promoted shared custody by default, strengthening fathers’ rights and legally recognizing equal parenthood—quiet but transformative.",
    type: "family",
    era: "modern",
    position: 5400,
    scale: 1,
  },
  {
    id: "metoo-2017-global",
    year: 2017,
    title: "#MeToo becomes global",
    description:
      "Exposed the scale of sexual harassment and assault worldwide, reshaping norms around accountability, workplace power, and public credibility of survivors.",
    type: "megaphone",
    era: "modern",
    position: 5800,
    scale: 3,
  },
  {
    id: "saudi-2018-driving",
    year: 2018,
    title: "Saudi Arabia lifts ban on women driving",
    description:
      "Women gained the right to drive, expanding freedom of movement and economic participation, and symbolizing broader shifts in women’s legal autonomy.",
    type: "steeringWheel",
    era: "modern",
    position: 6100,
    scale: 3,
  },
  {
    id: "spain-2018-strike",
    year: 2018,
    title: "Spain’s feminist strike",
    description:
      "Millions halted paid work, caregiving, and studying to highlight unpaid labor’s value, inspiring feminist mobilizations across Europe and Latin America.",
    type: "fist",
    era: "modern",
    position: 6400,
    scale: 2,
  },
  {
    id: "france-2018-harassment",
    year: 2018,
    title: "France criminalizes street harassment",
    description:
      "Introduced nationwide on-the-spot fines for street harassment (including catcalling), shifting responsibility from women’s avoidance to perpetrator accountability.",
    type: "document",
    era: "modern",
    position: 6700,
    scale: 2,
  },
  {
    id: "uae-2019-reforms",
    year: 2019,
    title: "UAE reforms guardianship-style laws",
    description:
      "Legal reforms expanded women’s independence in travel, employment, marriage, and legal status, reducing male-guardian control in everyday life.",
    type: "unlock",
    era: "modern",
    position: 7000,
    scale: 2,
  },
  {
    id: "afghan-2021-education",
    year: 2021,
    title: "Taliban ban girls’ education (Afghanistan)",
    description:
      "Girls were barred from secondary and higher education, making Afghanistan the only country to formally ban female education and reversing decades of progress.",
    type: "bookLock",
    era: "modern",
    position: 7300,
    scale: 3,
  },
  {
    id: "us-2022-abortion",
    year: 2022,
    title: "Abortion rights overturned (United States)",
    description:
      "Federal constitutional protection for abortion was removed, allowing states to ban or severely restrict access—one of the most significant modern rollbacks of reproductive rights.",
    type: "brokenGavel",
    era: "modern",
    position: 7600,
    scale: 3,
  },
  {
    id: "iran-2022-crackdown",
    year: 2022,
    title: "Crackdown on women’s autonomy (Iran)",
    description:
      "Following nationwide protests, authorities intensified enforcement of mandatory hijab laws and restrictions on women’s public behavior, highlighting state control over women’s bodies.",
    type: "shieldAlert",
    era: "modern",
    position: 7900,
    scale: 3,
  },

  // ----- Ongoing issues (display as “Ongoing” in UI) -----
  {
    id: "ongoing-unequal-inheritance",
    year: 0,
    title: "Ongoing: Unequal inheritance laws",
    description:
      "In some legal systems, women inherit less than male relatives by default, reinforcing structural economic dependence and long-term gender inequality.",
    type: "brokenCoins",
    era: "modern",
    position: 8350,
    scale: 2,
  },
  {
    id: "ongoing-bokoharam-education",
    year: 0,
    title: "Ongoing: Attacks on girls’ education (Nigeria)",
    description:
      "Militant groups such as Boko Haram have targeted girls’ schools through attacks and kidnappings, using education as a battleground to suppress women’s autonomy in conflict zones.",
    type: "warningBook",
    era: "modern",
    position: 8650,
    scale: 2,
  },
  {
    id: "ongoing-criminalised-miscarriage",
    year: 0,
    title: "Ongoing: Criminalisation of miscarriage",
    description:
      "In some countries, women have faced investigation or prosecution after miscarriages under restrictive abortion laws, blurring healthcare with criminal law and undermining bodily autonomy.",
    type: "brokenShield",
    era: "modern",
    position: 8950,
    scale: 2,
  },
  {
    id: "ongoing-child-marriage-loopholes",
    year: 0,
    title: "Ongoing: Child marriage laws with legal loopholes",
    description:
      "Despite minimum-age laws, legal exceptions still allow girls to be married under 18 with parental or judicial consent, harming education, health, and long-term autonomy.",
    type: "warningRing",
    era: "modern",
    position: 9250,
    scale: 2,
  },
];

const TIMELINE_WIDTH = 8500;
const CHARACTER_X_POSITION = 200;

const TimelineWorld = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // smooth keyboard refs
  const keysHeldRef = useRef({ left: false, right: false });
  const rafRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // ✅ Background should NOT "re-randomize" every render:
  // Pre-generate shapes ONCE.
  const clouds = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      key: i,
      left: i * 400,
      bottom: Math.sin(i) * 20,
      width: 150 + Math.random() * 100,
      height: 80 + Math.random() * 40,
    }));
  }, []);

  const silhouettes = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      key: i,
      left: i * 250 + Math.random() * 100,
      width: 20 + Math.random() * 30,
      height: 40 + Math.random() * 60,
    }));
  }, []);

  // ✅ Era is kept in state; but (important) this is NOT the flicker culprit anymore.
  const [era, setEra] = useState<"past" | "early" | "mid" | "modern">("past");

  useEffect(() => {
    const progress = scrollProgress * TIMELINE_WIDTH;
    if (progress < 1800) setEra("past");
    else if (progress < 3300) setEra("early");
    else if (progress < 5200) setEra("mid");
    else setEra("modern");
  }, [scrollProgress]);

  // Wheel scroll (optional)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY || e.deltaX;
      const newProgress = Math.max(0, Math.min(1, scrollProgress + delta / TIMELINE_WIDTH));
      setScrollProgress(newProgress);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    },
    [scrollProgress]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ✅ Smooth keyboard (hold ←/→)
  useEffect(() => {
    const SPEED_PX_PER_SEC = 1400; // tweak: 900 slower, 1800 faster
    let lastTime = 0;

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTime = 0;
      setIsScrolling(false);
    };

    const tick = (t: number) => {
      if (!lastTime) lastTime = t;
      const dt = (t - lastTime) / 1000;
      lastTime = t;

      const dir = (keysHeldRef.current.right ? 1 : 0) - (keysHeldRef.current.left ? 1 : 0);

      if (dir === 0) {
        stop();
        return;
      }

      const deltaProgress = (dir * SPEED_PX_PER_SEC * dt) / TIMELINE_WIDTH;

      setScrollProgress((prev) => {
        const next = Math.max(0, Math.min(1, prev + deltaProgress));
        return next;
      });

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 120);

      rafRef.current = requestAnimationFrame(tick);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();

      if (e.key === "ArrowRight") keysHeldRef.current.right = true;
      if (e.key === "ArrowLeft") keysHeldRef.current.left = true;

      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") keysHeldRef.current.right = false;
      if (e.key === "ArrowLeft") keysHeldRef.current.left = false;
    };

    const onBlur = () => {
      keysHeldRef.current.left = false;
      keysHeldRef.current.right = false;
      stop();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false } as any);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // active event detection
  useEffect(() => {
    const characterWorldPosition = scrollProgress * TIMELINE_WIDTH + CHARACTER_X_POSITION;

    let nearestEvent: TimelineEventData | null = null;
    let nearestDistance = Infinity;

    TIMELINE_EVENTS.forEach((event) => {
      const distance = Math.abs(event.position - characterWorldPosition);
      if (distance < 100 && distance < nearestDistance) {
        nearestDistance = distance;
        nearestEvent = event;
      }
    });

    setActiveEventId(nearestEvent?.id || null);
  }, [scrollProgress]);

  const worldOffset = -scrollProgress * TIMELINE_WIDTH;

  return (
    <div
      ref={containerRef}
      className="timeline-world h-screen w-screen overflow-hidden cursor-grab active:cursor-grabbing"
      tabIndex={0}
    >
      {/* Era background transition */}
      <div
        className={`absolute inset-0 transition-colors duration-[2000ms] ${
          era === "past" ? "era-past" : era === "early" ? "era-early" : era === "mid" ? "era-mid" : "era-modern"
        }`}
      />

      {/* Parallax background layers */}
      <ParallaxLayer offset={worldOffset * 0.1} className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-40 left-0 w-full h-32 opacity-20">
          {clouds.map((c) => (
            <div
              key={c.key}
              className="absolute rounded-full bg-foreground/10"
              style={{
                left: `${c.left}px`,
                bottom: `${c.bottom}px`,
                width: `${c.width}px`,
                height: `${c.height}px`,
              }}
            />
          ))}
        </div>
      </ParallaxLayer>

      <ParallaxLayer offset={worldOffset * 0.4} className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-20 left-0">
          {silhouettes.map((s) => (
            <div
              key={s.key}
              className="absolute bg-foreground/5 rounded-t-lg"
              style={{
                left: `${s.left}px`,
                bottom: 0,
                width: `${s.width}px`,
                height: `${s.height}px`,
              }}
            />
          ))}
        </div>
      </ParallaxLayer>

      {/* Main timeline layer */}
      <div
        className="absolute bottom-0 left-0 h-full"
        style={{
          width: `${TIMELINE_WIDTH}px`,
          transform: `translateX(${worldOffset}px)`,
        }}
      >
        <div className="ground-layer absolute bottom-0 left-0 right-0 h-20" />
        <div className="timeline-track absolute bottom-16 left-0 right-0 h-1 rounded-full" />

       

        {TIMELINE_EVENTS.map((event) => (
          <TimelineEvent
            key={event.id}
            event={event}
            isActive={activeEventId === event.id}
            onClick={() => setActiveEventId(activeEventId === event.id ? null : event.id)}
          />
        ))}
      </div>

      {/* Character (fixed on screen) */}
      <div className="absolute z-20" style={{ left: `${CHARACTER_X_POSITION}px`, bottom: "80px" }}>
        <Character isWalking={isScrolling} era={era} />
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Walk Through Time</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Use ← → to explore the history of gender equality
          </p>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-4 left-8 right-8 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      
        
      </div>
    
  );
};

export default TimelineWorld;