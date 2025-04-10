import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getPlatformIcon } from "@/lib/platformIcons";
import { useQuery } from "@tanstack/react-query";
import { type Platform } from "@/types";

interface PlatformSettingsProps {
  platformId: string;
  initialSettings: any;
  onSave: (settings: any) => void;
  onCancel: () => void;
}

export default function PlatformSettings({
  platformId,
  initialSettings,
  onSave,
  onCancel,
}: PlatformSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  
  const { data: platforms } = useQuery({
    queryKey: ['/api/platforms'],
  });
  
  const platform = platforms?.find((p: Platform) => p.id.toString() === platformId);
  const platformName = platform?.platformName || "";
  
  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const renderYoutubeSettings = () => (
    <>
      <div className="mb-4">
        <Label htmlFor="playlist">Playlist</Label>
        <Select 
          value={settings.playlist || ""}
          onValueChange={(value) => handleChange("playlist", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select playlist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="productDemos">Product Demos</SelectItem>
            <SelectItem value="tutorials">Tutorials</SelectItem>
            <SelectItem value="companyUpdates">Company Updates</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <Label>Age Restriction</Label>
        <RadioGroup 
          value={settings.ageRestriction || "no"}
          onValueChange={(value) => handleChange("ageRestriction", value)}
          className="mt-2 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="age-no" />
            <Label htmlFor="age-no">No age restriction</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="age-yes" />
            <Label htmlFor="age-yes">Age restricted</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="category">Video Category</Label>
        <Select 
          value={settings.category || "education"}
          onValueChange={(value) => handleChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
  
  const renderFacebookSettings = () => (
    <>
      <div className="mb-4">
        <Label htmlFor="postAs">Post As</Label>
        <Select 
          value={settings.postAs || "profile"}
          onValueChange={(value) => handleChange("postAs", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select posting account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profile">Personal Profile</SelectItem>
            <SelectItem value="page">Company Page</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="audience">Audience</Label>
        <Select 
          value={settings.audience || "public"}
          onValueChange={(value) => handleChange("audience", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="friends">Friends</SelectItem>
            <SelectItem value="onlyMe">Only Me</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
  
  const renderTwitterSettings = () => (
    <>
      <div className="mb-4">
        <Label htmlFor="tweetText">Tweet Text</Label>
        <Textarea 
          id="tweetText"
          placeholder="Add text to accompany your video..."
          rows={3}
          value={settings.tweetText || ""}
          onChange={(e) => handleChange("tweetText", e.target.value)}
        />
        <div className="mt-1 text-sm text-gray-500">
          {280 - (settings.tweetText?.length || 0)} characters remaining
        </div>
      </div>
    </>
  );
  
  const renderInstagramSettings = () => (
    <>
      <div className="mb-4">
        <Label htmlFor="caption">Caption</Label>
        <Textarea 
          id="caption"
          placeholder="Write a caption for your Instagram post..."
          rows={3}
          value={settings.caption || ""}
          onChange={(e) => handleChange("caption", e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <Label className="block mb-2">Also Share To</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="share-feed"
              checked={settings.shareToFeed}
              onCheckedChange={(checked) => handleChange("shareToFeed", checked)}
            />
            <Label htmlFor="share-feed">Instagram Feed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="share-stories"
              checked={settings.shareToStories}
              onCheckedChange={(checked) => handleChange("shareToStories", checked)}
            />
            <Label htmlFor="share-stories">Instagram Stories</Label>
          </div>
        </div>
      </div>
    </>
  );
  
  const renderPlatformSpecificSettings = () => {
    switch (platformName) {
      case 'youtube':
        return renderYoutubeSettings();
      case 'facebook':
        return renderFacebookSettings();
      case 'twitter':
        return renderTwitterSettings();
      case 'instagram':
        return renderInstagramSettings();
      default:
        return (
          <p className="text-gray-500">No specific settings available for this platform.</p>
        );
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {platformName} Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderPlatformSpecificSettings()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(settings)}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
