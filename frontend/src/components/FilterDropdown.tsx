
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";

interface FilterOptions {
  diet: string[];
  course: string[];
  flavorProfile: string[];
  difficulty: string[];
  region: string[];
}

interface FilterDropdownProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const filterConfig = {
  diet: ['Vegetarian', 'Non-Vegetarian'],
  course: ['Main Course', 'Dessert', 'Snack', 'Starter', 'Breakfast'],
  flavorProfile: ['Sweet', 'Spicy', 'Bitter', 'Neutral', 'Mild & Creamy', 'Rich & Savory', 'Fresh & Light'],
  difficulty: ['Easy', 'Medium', 'Hard'],
  region: ['North India', 'South India', 'East India', 'West India', 'International', 'Modern', 'Southeast Asia', 'Europe']
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const handleFilterToggle = (category: keyof FilterOptions, value: string) => {
    const updatedFilters = { ...filters };
    const categoryFilters = updatedFilters[category];
    
    if (categoryFilters.includes(value)) {
      updatedFilters[category] = categoryFilters.filter(item => item !== value);
    } else {
      updatedFilters[category] = [...categoryFilters, value];
    }
    
    onFilterChange(updatedFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((total, categoryFilters) => total + categoryFilters.length, 0);
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-[#1e1e2f] border-gray-600 text-white hover:bg-[#2a2a3f] relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#1e1e2f] border-gray-600 text-white p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Filter Recipes</h3>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-8 px-2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {Object.entries(filterConfig).map(([category, options]) => (
            <div key={category} className="space-y-2">
              <Label className="text-sm font-medium text-gray-300 capitalize">
                {category === 'flavorProfile' ? 'Flavor Profile' : category}
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category}-${option}`}
                      checked={filters[category as keyof FilterOptions].includes(option)}
                      onCheckedChange={() => handleFilterToggle(category as keyof FilterOptions, option)}
                      className="border-gray-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Label
                      htmlFor={`${category}-${option}`}
                      className="text-sm text-gray-300 hover:text-white cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
