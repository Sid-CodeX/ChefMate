
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

const ProgressBar = ({ currentXP, nextLevelXP, level }: ProgressBarProps) => {
  const progressPercentage = (currentXP / nextLevelXP) * 100;
  const xpNeeded = nextLevelXP - currentXP;

  return (
    <Card className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <span className="text-2xl">🏆</span>
            <span>Level {level} Chef</span>
          </span>
          <span className="text-sm text-gray-600">
            {xpNeeded} XP to Level {level + 1}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{currentXP} XP</span>
            <span>{nextLevelXP} XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressBar;
