import { useState } from "react";
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

const questions: Question[] = [
  {
    id: 1,
    statement: "Women globally earn on average 20% less than men for the same work.",
    isTrue: true,
    explanation: "The global gender pay gap stands at approximately 20%, meaning women earn 80 cents for every dollar men earn. This gap persists across industries and education levels.",
    source: "ILO Global Wage Report"
  },
  {
    id: 2,
    statement: "More women than men graduate from universities worldwide.",
    isTrue: true,
    explanation: "In most developed countries, women now outnumber men in higher education enrollment and graduation rates. However, they remain underrepresented in STEM fields.",
    source: "UNESCO"
  },
  {
    id: 3,
    statement: "Men and women have equal representation in parliament globally.",
    isTrue: false,
    explanation: "Women hold only about 26% of parliamentary seats worldwide. At the current rate of progress, gender parity in national legislatures won't be reached until 2063.",
    source: "UN Women"
  },
  {
    id: 4,
    statement: "The gender gap in life expectancy favors women in almost all countries.",
    isTrue: true,
    explanation: "Women live longer than men in virtually every country. On average, women live 4-5 years longer, though this gap varies by region and is influenced by biological and social factors.",
    source: "WHO"
  },
  {
    id: 5,
    statement: "Men are more likely to die by suicide than women globally.",
    isTrue: true,
    explanation: "Men die by suicide at nearly 3 times the rate of women globally. This is often linked to social stigma around mental health, economic pressures, and reluctance to seek help.",
    source: "WHO Mental Health"
  },
  {
    id: 6,
    statement: "Iceland has completely closed its gender gap.",
    isTrue: false,
    explanation: "While Iceland consistently ranks #1 in the Global Gender Gap Index, it has closed about 90% of its gender gap—not 100%. No country has achieved complete gender parity yet.",
    source: "World Economic Forum"
  },
  {
    id: 7,
    statement: "Women do twice as much unpaid care work as men globally.",
    isTrue: false,
    explanation: "Actually, women do THREE times as much unpaid care and domestic work as men. This 'invisible' labor significantly impacts their economic opportunities and career progression.",
    source: "ILO"
  },
  {
    id: 8,
    statement: "The gender gap in education has been mostly closed in developed countries.",
    isTrue: true,
    explanation: "In most developed nations, girls and boys have equal access to education, and women often outperform men academically. However, significant gaps remain in developing regions.",
    source: "UNESCO"
  },
];

export const MythOrFactGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === question.isTrue) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setGameComplete(false);
  };

  const isCorrect = selectedAnswer === question.isTrue;

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "";
    if (percentage >= 80) {
      message = "Excellent! You have a great understanding of gender inequality issues.";
    } else if (percentage >= 60) {
      message = "Good job! You know quite a bit, but there's always more to learn.";
    } else {
      message = "Thanks for playing! Gender inequality is complex—keep exploring to learn more.";
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
            <span className="text-4xl font-display font-bold text-primary">{score}/{questions.length}</span>
          </motion.div>
          
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Quiz Complete!
          </h2>
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
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6 bg-card border-border/50">
            <p className="text-lg font-medium text-foreground leading-relaxed">
              "{question.statement}"
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
                <Card className={`p-5 mb-6 border-l-4 ${
                  isCorrect 
                    ? "border-l-green-500 bg-green-500/5" 
                    : "border-l-red-500 bg-red-500/5"
                }`}>
                  <div className="flex items-start gap-3">
                    <Lightbulb className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      isCorrect ? "text-green-500" : "text-red-500"
                    }`} />
                    <div>
                      <p className={`font-medium mb-2 ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}>
                        {isCorrect ? "Correct!" : "Not quite right"}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                      {question.source && (
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          Source: {question.source}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="gap-2">
                    {currentQuestion < questions.length - 1 ? (
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