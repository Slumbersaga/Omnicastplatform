import { Button } from "@/components/ui/button";
import { getPlatformIcon } from "@/lib/platformIcons";
import { Platform } from "@/types";

interface PlatformCheckboxProps {
  platform: Platform;
  selected: boolean;
  onToggle: (selected: boolean) => void;
  onOpenSettings: () => void;
}

export function PlatformCheckbox({
  platform,
  selected,
  onToggle,
  onOpenSettings
}: PlatformCheckboxProps) {
  const platformIcon = getPlatformIcon(platform.platformName);
  
  return (
    <div 
      className={`relative border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 ${
        selected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300'
      }`}
    >
      <input 
        type="checkbox" 
        id={`platform-${platform.id}`} 
        className="sr-only" 
        checked={selected}
        onChange={(e) => onToggle(e.target.checked)}
        disabled={!platform.isConnected}
      />
      <label 
        htmlFor={`platform-${platform.id}`} 
        className={`cursor-pointer flex items-center ${!platform.isConnected ? 'opacity-50' : ''}`}
      >
        <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${platformIcon.bgColor}`}>
          {platformIcon.icon}
        </div>
        <div>
          <h3 className="font-medium capitalize">{platformIcon.name}</h3>
          {platform.isConnected ? (
            <div className="text-sm text-green-600">Connected</div>
          ) : (
            <div className="text-sm text-gray-500">Not connected</div>
          )}
        </div>
      </label>
      
      {selected && platform.isConnected && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <Button 
            variant="link" 
            size="sm"
            className="text-sm p-0 h-auto text-primary-600 hover:text-primary-700"
            onClick={onOpenSettings}
          >
            Customize settings
          </Button>
        </div>
      )}
    </div>
  );
}
