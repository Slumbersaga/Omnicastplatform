export const PLATFORM_NAMES: Record<string, string> = {
  youtube: "YouTube",
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram"
};

export const PLATFORM_IDS: Record<string, number> = {
  youtube: 1,
  facebook: 2,
  twitter: 3,
  instagram: 4
};

export const VIDEO_FORMATS = [
  '.mp4',
  '.mov',
  '.avi',
  '.wmv',
  '.flv',
  '.mkv'
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
