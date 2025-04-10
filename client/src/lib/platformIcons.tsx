// Import social media icons
import { FaYoutube, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

interface PlatformIconInfo {
  name: string;
  icon: JSX.Element;
  bgColor: string;
  color: string;
  progressColor: string;
}

const PLATFORM_ICONS: Record<string, PlatformIconInfo> = {
  youtube: {
    name: "YouTube",
    icon: <FaYoutube className="w-full h-full text-red-600" />,
    bgColor: "bg-red-100",
    color: "text-red-600",
    progressColor: "bg-red-600"
  },
  facebook: {
    name: "Facebook",
    icon: <FaFacebook className="w-full h-full text-blue-600" />,
    bgColor: "bg-blue-100",
    color: "text-blue-600",
    progressColor: "bg-blue-600"
  },
  twitter: {
    name: "Twitter",
    icon: <FaTwitter className="w-full h-full text-blue-400" />,
    bgColor: "bg-blue-100",
    color: "text-blue-400",
    progressColor: "bg-blue-400"
  },
  instagram: {
    name: "Instagram",
    icon: <FaInstagram className="w-full h-full text-pink-600" />,
    bgColor: "bg-pink-100",
    color: "text-pink-600",
    progressColor: "bg-pink-600"
  },
  "1": {
    name: "YouTube",
    icon: <FaYoutube className="w-full h-full text-red-600" />,
    bgColor: "bg-red-100",
    color: "text-red-600",
    progressColor: "bg-red-600"
  },
  "2": {
    name: "Facebook",
    icon: <FaFacebook className="w-full h-full text-blue-600" />,
    bgColor: "bg-blue-100",
    color: "text-blue-600",
    progressColor: "bg-blue-600"
  },
  "3": {
    name: "Twitter",
    icon: <FaTwitter className="w-full h-full text-blue-400" />,
    bgColor: "bg-blue-100",
    color: "text-blue-400",
    progressColor: "bg-blue-400"
  },
  "4": {
    name: "Instagram",
    icon: <FaInstagram className="w-full h-full text-pink-600" />,
    bgColor: "bg-pink-100",
    color: "text-pink-600",
    progressColor: "bg-pink-600"
  }
};

// Default fallback icon
const DEFAULT_ICON: PlatformIconInfo = {
  name: "Platform",
  icon: <div className="w-full h-full rounded-full bg-gray-300" />,
  bgColor: "bg-gray-100",
  color: "text-gray-600",
  progressColor: "bg-gray-600"
};

export function getPlatformIcon(platformKey: string): PlatformIconInfo {
  return PLATFORM_ICONS[platformKey.toLowerCase()] || DEFAULT_ICON;
}
