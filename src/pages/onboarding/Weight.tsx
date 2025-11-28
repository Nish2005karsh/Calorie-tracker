import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";

const Results = () => {
  const navigate = useNavigate();

  // Mock data for the weight loss comparison chart
  const chartData = [
    { name: "Month 1", calAI: 100, traditional: 100 },
    { name: "", calAI: 95, traditional: 98 },
    { name: "", calAI: 88, traditional: 96 },
    { name: "", calAI: 82, traditional: 94 },
    { name: "Month 6", calAI: 80, traditional: 92 },
  ];

  const handleNext = () => {
    navigate("/onboarding/motivation");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/onboarding/results")}
          className="text-foreground hover:text-accent transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[30%] rounded-full bg-primary transition-all duration-300" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-3 text-center text-4xl font-bold">
          Cal AI creates long-term results
        </h1>

        {/* Chart Section */}
        <div className="mb-8 rounded-2xl bg-muted/30 p-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Your Weight</p>
            <div className="flex items-baseline gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive"></div>
                <span className="text-sm font-medium">Cal AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground/40"></div>
                <span className="text-sm font-medium text-muted-foreground">Traditional Diet</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCalAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF8C42" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis
                  hide={true}
                  domain={[75, 105]}
                />
                <Area
                  type="monotone"
                  dataKey="calAI"
                  stroke="#EF4444"
                  strokeWidth={3}
                  fill="url(#colorCalAI)"
                  dot={{ fill: '#EF4444', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="traditional"
                  stroke="#9CA3AF"
                  strokeWidth={3}
                  dot={{ fill: '#9CA3AF', r: 4 }}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Text */}
          <div className="mt-6 rounded-xl bg-background/60 p-4 text-center">
            <p className="text-sm font-medium leading-relaxed">
              <span className="font-bold text-foreground">80%</span> of Cal AI users maintain their weight loss even{" "}
              <span className="font-bold text-foreground">6 months</span> later
            </p>
          </div>
        </div>

        <Button
          onClick={handleNext}
          className="h-14 w-full rounded-xl bg-primary text-lg font-semibold hover:bg-primary/90"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Results;