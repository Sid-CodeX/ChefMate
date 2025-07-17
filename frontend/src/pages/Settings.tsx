
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Type } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSoundEnabled = localStorage.getItem('chefmate_sound_enabled');
    const savedFontSize = localStorage.getItem('chefmate_font_size');
    
    if (savedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('chefmate_sound_enabled', JSON.stringify(enabled));
    
    toast({
      title: enabled ? "Sound enabled" : "Sound disabled",
      description: `Voice assistant is now ${enabled ? 'on' : 'off'}.`,
    });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('chefmate_font_size', size);
    
    // Apply font size to document root
    const root = document.documentElement;
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
    }
    
    toast({
      title: "Font size updated",
      description: `Text size set to ${size}.`,
    });
  };

  const resetSettings = () => {
    setSoundEnabled(true);
    setFontSize('medium');
    localStorage.removeItem('chefmate_sound_enabled');
    localStorage.removeItem('chefmate_font_size');
    document.documentElement.style.fontSize = '16px';
    
    toast({
      title: "Settings reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
      <p className="text-gray-300 mb-8">
        Manage your app preferences and account settings.
      </p>

      <div className="max-w-2xl space-y-6">
        {/* Audio Settings */}
        <Card className="bg-[#2c2c3d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              <span>Audio Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Voice Assistant</p>
                <p className="text-sm text-gray-400">
                  Enable text-to-speech for recipe instructions
                </p>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={handleSoundToggle}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-[#2c2c3d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Type className="h-5 w-5" />
              <span>Display Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Font Size</p>
                <p className="text-sm text-gray-400">
                  Adjust text size for better readability
                </p>
              </div>
              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-32 bg-[#1e1e2f] border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2c2c3d] border-gray-600">
                  <SelectItem value="small" className="text-white hover:bg-gray-700">Small</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="large" className="text-white hover:bg-gray-700">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-[#2c2c3d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-white font-medium mb-2">Reset Settings</p>
                <p className="text-sm text-gray-400 mb-4">
                  Restore all settings to their default values
                </p>
                <Button
                  onClick={resetSettings}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-[#2c2c3d] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">App Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Theme</span>
                <span className="text-white">Dark Mode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
