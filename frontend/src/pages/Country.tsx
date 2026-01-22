import { motion } from "framer-motion";
import { DollarSign, GraduationCap, Heart, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/country/StatCard";
import { InsightCard } from "@/components/country/InsightCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockInsights = [
  "Women earn approximately 22% less than men in comparable positions",
  "Education gap has nearly closed over the past two decades",
  "Healthcare access remains relatively equal between genders",
  "Female labor force participation has increased by 15% since 2000",
  "Male suicide rate correlates with higher unemployment periods",
];

const countries = [
  { id: "na", name: "North America", flag: "🌎" },
  { id: "eu", name: "Europe", flag: "🌍" },
  { id: "as", name: "Asia", flag: "🌏" },
  { id: "af", name: "Africa", flag: "🌍" },
  { id: "sa", name: "South America", flag: "🌎" },
  { id: "oc", name: "Oceania", flag: "🌏" },
];

const Country = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              🌍 Europe
            </h1>
            <p className="text-muted-foreground">
              Deep dive into gender equality metrics and trends
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select defaultValue="eu">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select defaultValue="2023">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2022, 2021, 2020, 2019].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            label="Overall Score"
            value="82"
            subValue="/100"
            icon={Users}
            trend="up"
            delay={0.1}
          />
          <StatCard
            label="Economic Gap"
            value="72%"
            icon={DollarSign}
            trend="up"
            delay={0.2}
          />
          <StatCard
            label="Education Gap"
            value="95%"
            icon={GraduationCap}
            trend="up"
            delay={0.3}
          />
          <StatCard
            label="Health Gap"
            value="89%"
            icon={Heart}
            trend="stable"
            delay={0.4}
          />
        </motion.div>

        {/* Detailed Sections */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Gender Gaps Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="stat-card"
            >
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Gender Gaps Breakdown
              </h2>
              
              <div className="space-y-6">
                {[
                  { label: "Income Equality", value: 78, description: "Women earn 78¢ for every $1 men earn" },
                  { label: "Labor Participation", value: 72, description: "72% of women vs 85% of men in workforce" },
                  { label: "Education Attainment", value: 95, description: "Near parity in educational outcomes" },
                  { label: "Political Representation", value: 42, description: "42% of parliamentary seats held by women" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className="h-full accent-gradient rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Historical Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="stat-card"
            >
              <h2 className="text-xl font-display font-semibold text-foreground mb-6">
                Change Over Time
              </h2>
              
              <div className="flex items-end justify-between h-40 gap-2">
                {[
                  { year: 2019, score: 68 },
                  { year: 2020, score: 72 },
                  { year: 2021, score: 75 },
                  { year: 2022, score: 79 },
                  { year: 2023, score: 82 },
                ].map((data, index) => (
                  <div key={data.year} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${data.score}%` }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="w-full accent-gradient rounded-t-lg min-h-[20px]"
                    />
                    <span className="text-xs text-muted-foreground">{data.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-1">
            <InsightCard insights={mockInsights} delay={0.4} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Country;
