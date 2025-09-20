interface ResultCardProps {
  score: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
}

export default function ResultCard({
  score,
  feedback,
  strengths,
  improvements,
}: ResultCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-400/10";
    if (score >= 60) return "bg-yellow-400/10";
    return "bg-red-400/10";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Card */}
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(
            score
          )} mb-4`}
        >
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        </div>
        <h3 className="text-2xl font-semibold mb-2">Relevance Score</h3>
        <p className="text-muted-foreground">
          {score >= 80
            ? "Excellent match!"
            : score >= 60
            ? "Good match with room for improvement"
            : "Needs significant improvements"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-green-400">
            Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-muted-foreground">
                  {strength}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-yellow-400">
            Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-muted-foreground">
                  {improvement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-4">Detailed Feedback</h4>
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <p
              key={index}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
