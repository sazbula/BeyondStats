import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  statement: string;
  isTrue: boolean;
  explanation: string;
  source?: string;
}

const QUESTION_POOL: Question[] = [

  {
    id: 101,
    statement: "At least one country in the world has achieved full gender parity.",
    isTrue: false,
    explanation:
      "WEF reporting notes no country has fully achieved gender parity; top performers are still below 100%.",
    source: "World Economic Forum (Global Gender Gap reporting)",
  }, // :contentReference[oaicite:1]{index=1}

  {
    id: 102,
    statement: "A maternal death occurred almost every 10 minutes in 2023.",
    isTrue: false,
    explanation:
      "WHO reports A maternal death occurred almost every 2 minutes in 2023. Harmful gender norms and/or inequalities result in a low prioritization of the rights of women and girls.",
    source: "WHO Maternal Mortality Fact Sheet",
  }, // :contentReference[oaicite:2]{index=2}

  {
    id: 103,
    statement: "An estimated 100 million women and girls lack access to menstrual products and adequate facilities for menstrual hygiene.",
    isTrue: false,
    explanation:
      "The World Bank estimates around 500 million lack access to menstrual products and adequate menstrual hygiene management facilities.",
    source: "World Bank: Menstrual Health & Hygiene",
  }, // :contentReference[oaicite:3]{index=3}

  {
    id: 104,
    statement: "Globally, an estimated 5 million girls are married before age 18 each year.",
    isTrue: false,
    explanation:
      "UNICEF frequently cites an estimate of about 12 million girls married in childhood each year.",
    source: "UNICEF (Child Marriage)",
  }, // :contentReference[oaicite:4]{index=4}

  {
    id: 105,
    statement: "A woman or girl is killed by someone in her own family about every 11 minutes.",
    isTrue: true,
    explanation:
      "UNODC reported that in 2020, a woman or girl was killed by a family member roughly every 11 minutes globally.",
    source: "UNODC (2021)",
  }, // :contentReference[oaicite:5]{index=5}

  {
    id: 106,
    statement: "In England, 1 in 3 women have experienced domestic abuse since the age of 16.",
    isTrue: true,
    explanation:
      "Women’s Aid cites ONS data estimating 30.3% of women have experienced domestic abuse since age 16 in England and Wales.",
    source: "Women’s Aid (ONS cited)",
  }, // :contentReference[oaicite:6]{index=6}

  {
    id: 107,
    statement: "Domestic abuse reports in England drop when the national team wins.",
    isTrue: false,
    explanation:
      "UK Crown Prosecution Service communications cite figures such as +11% the next day (win or lose), +26% when England plays, +38% if England loses.",
    source: "CPS (England football & domestic abuse)",
  }, // :contentReference[oaicite:7]{index=7}

  {
    id: 108,
    statement: "About 500 million women live in countries with restrictive abortion laws.",
    isTrue: false,
    explanation:
      "Some global summaries estimate that over 1.2 billion women live under restrictive abortion legislation.",
    source: "Focus2030 (global SRHR overview)",
  }, // :contentReference[oaicite:8]{index=8}

  {
    id: 109,
    statement: "Men are nearly three times as likely as women to become dependent on alcohol and report frequent drug use.",
    isTrue: true,
    explanation:
      "Mental Health Foundation’s summary states men are nearly three times as likely as women to become dependent on alcohol and report frequent drug use.",
    source: "Mental Health Foundation (Men & women statistics)",
  }, // :contentReference[oaicite:9]{index=9}

  {
    id: 110,
    statement: "In the U.S., men receive about 60% longer prison sentences than women on average.",
    isTrue: true,
    explanation:
      "A University of Michigan analysis (Starr, 2012) reports men receive substantially longer sentences on average than women in federal cases, controlling for factors.",
    source: "Starr (2012), Univ. of Michigan (working paper)",
  }, // :contentReference[oaicite:10]{index=10}

  {
    id: 111,
    statement: "More than 1 in 6 men have experienced some form of contact sexual violence in their lifetimes (U.S.).",
    isTrue: true,
    explanation:
      "CDC’s overview states that more than 1 in 6 men have experienced contact sexual violence in their lifetime.",
    source: "CDC: Sexual Violence (About)",
  }, // :contentReference[oaicite:11]{index=11}

  {
    id: 112,
    statement: "In Great Britain, 70% of worker fatalities in 2024/25 were male workers.",
    isTrue: false,
    explanation:
      "HSE reports that in 2024/25, 118 (95%) of worker fatalities were male workers.",
    source: "HSE (Workplace injuries by gender)",
  }, // :contentReference[oaicite:12]{index=12}

  {
    id: 113,
    statement: "It is estimated that it will take another 50 years before the gender gap in the Middle East and North Africa is closed",
    isTrue: false,
    explanation:
      "WEF has communicated an estimate that it will take another 152 years before the gender gap in the Middle East and North Africa is closed.",
    source: "World Economic Forum (social post)",
  }, // :contentReference[oaicite:13]{index=13}
];

// --- helpers ---
const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pickQuestions = (pool: Question[], count: number) => {
  const n = Math.min(count, pool.length);
  return shuffle(pool).slice(0, n);
};

export const MythOrFactGame = () => {
  const QUESTIONS_PER_GAME = 8; // ✅ choose how many per run

  // gameQuestions is the randomized subset used THIS run
  const [gameQuestions, setGameQuestions] = useState<Question[]>(
    () => pickQuestions(QUESTION_POOL, QUESTIONS_PER_GAME)
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const question = gameQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / gameQuestions.length) * 100;

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    setShowExplanation(true);

    if (answer === question.isTrue) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    // ✅ NEW: pick a fresh random set
    setGameQuestions(pickQuestions(QUESTION_POOL, QUESTIONS_PER_GAME));

    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameComplete(false);
  };

  const isCorrect = selectedAnswer === question?.isTrue;

  if (gameComplete) {
    const percentage = Math.round((score / gameQuestions.length) * 100);
    let message = "";
    if (percentage >= 80) {
      message = "Excellent! You have a great understanding of gender inequality issues.";
    } else if (percentage >= 60) {
      message = "Good job! You know quite a bit, but there's always more to learn.";
    } else {
      message = "Thanks for playing! Gender inequality is complex. Keep exploring to learn more.";
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center bg-card border-border/50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <span className="text-4xl font-display font-bold text-primary">
              {score}/{gameQuestions.length}
            </span>
          </motion.div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-6">{message}</p>

          <div className="mb-8">
            <div className="text-sm text-muted-foreground mb-2">Your Score</div>
            <Progress value={percentage} className="h-3" />
            <div className="text-sm text-muted-foreground mt-2">{percentage}% correct</div>
          </div>

          <Button onClick={handleRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQuestion + 1} of {gameQuestions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question?.id ?? currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6 bg-card border-border/50">
            <p className="text-lg font-medium text-foreground leading-relaxed">
              {question.statement}
            </p>
          </Card>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(true)}
              disabled={selectedAnswer !== null}
              className={`h-16 text-lg font-medium transition-all ${
                selectedAnswer !== null
                  ? question.isTrue
                    ? "border-green-500 bg-green-500/10 text-green-600"
                    : selectedAnswer === true
                    ? "border-red-500 bg-red-500/10 text-red-600"
                    : "opacity-50"
                  : "hover:border-primary hover:bg-primary/5"
              }`}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Fact
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(false)}
              disabled={selectedAnswer !== null}
              className={`h-16 text-lg font-medium transition-all ${
                selectedAnswer !== null
                  ? !question.isTrue
                    ? "border-green-500 bg-green-500/10 text-green-600"
                    : selectedAnswer === false
                    ? "border-red-500 bg-red-500/10 text-red-600"
                    : "opacity-50"
                  : "hover:border-primary hover:bg-primary/5"
              }`}
            >
              <XCircle className="w-5 h-5 mr-2" />
              Myth
            </Button>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`p-5 mb-6 border-l-4 ${
                    isCorrect ? "border-l-green-500 bg-green-500/5" : "border-l-red-500 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        isCorrect ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <div>
                      <p className={`font-medium mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "Correct!" : "Not quite right"}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{question.explanation}</p>
                      {question.source && (
                        <p className="text-xs text-muted-foreground/70 mt-2">Source: {question.source}</p>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="gap-2">
                    {currentQuestion < gameQuestions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      "See Results"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};