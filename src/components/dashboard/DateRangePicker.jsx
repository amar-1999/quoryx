import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useFilterStore } from "@/stores/useFilterStore";

export function DateRangePicker() {
  const { dateRange, setDateRange } = useFilterStore();

  const handleSelect = (label) => {
    // Logic to calculate dates would go here
    setDateRange({ ...dateRange, label });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 border-dashed">
          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
          <span className="truncate">{dateRange?.label || "Select Date"}</span>
          <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel>Presets</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelect("Today")}>
          Today
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("Last 7 Days")}>
          Last 7 Days
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("Last 30 Days")}>
          Last 30 Days
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("Year to Date")}>
          Year to Date
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleSelect("Custom Range")}>
          Custom Range...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
