
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Mic, X, ChevronLeft, ChevronRight } from "lucide-react";

interface CookingBoxProps {
  steps: string[];
  totalCookTime: number;
  title?: string;
  onExit: () => void;
}

const CookingBox = React.memo(({ steps, totalCookTime, title = "Cooking Mode", onExit }: CookingBoxProps) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const totalTimeInSeconds = totalCookTime * 60;
  const progress = Math.min((seconds / totalTimeInSeconds) * 100, 100);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStepIndex(index);
  }, []);

  const currentStep = steps[currentStepIndex] || "No instructions available";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="bg-[#1a1f2e] border-orange-500 border-2 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center space-x-2">
            <span>🍳</span>
            <span>{title}</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onExit} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Timer Section */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-orange-400">
              {formatTime(seconds)}
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-4" />
              <p className="text-sm text-gray-400">
                Progress: {Math.round(progress)}% of estimated cook time ({totalCookTime} min)
              </p>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center space-x-3">
              <Button
                onClick={handlePlayPause}
                variant={isRunning ? "secondary" : "default"}
                className={isRunning ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
              >
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Pause" : "Start"}
              </Button>
              
              <Button onClick={handleReset} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Mic className="h-4 w-4 mr-2" />
                Voice Mode
              </Button>
            </div>
          </div>

          {/* Current Step Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Current Step</h3>
              <div className="text-sm text-gray-400">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>

            {/* Current Step Card */}
            <Card className="bg-[#2c2f3d] border-orange-500/50">
              <CardContent className="p-6">
                <p className="text-white text-xl leading-relaxed">
                  <span className="font-bold text-orange-400">Step {currentStepIndex + 1}:</span> {currentStep}
                </p>
              </CardContent>
            </Card>

            {/* Step Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Step
              </Button>
              
              <Button
                onClick={handleNextStep}
                disabled={currentStepIndex === steps.length - 1}
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* All Steps Overview */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">All Steps</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    index === currentStepIndex
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                      : index < currentStepIndex
                      ? 'bg-green-900/20 text-green-300'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <span className="font-medium">{index + 1}.</span> {step}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CookingBox.displayName = "CookingBox";

export default CookingBox;
