// lib/data.ts

export interface VideoItem {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  poster: string;
}

export interface MenuLink {
  id: string;
  title: string;
  targetId: string;
  image: string;
}

export const VIDEO_DATA: VideoItem[] = [
  {
    id: 1,
    title: "Neon City Nights",
    description: "Cruising through the illuminated downtown avenues.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-driving-in-a-city-at-night-1481-large.mp4",
    poster: "https://images.unsplash.com/photo-1555617781-692db237190d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Ocean Breeze",
    description: "Crystal clear waves crashing on the tropical shore.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    poster: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Cosmic Journey",
    description: "A breathtaking view of the galaxy and distant stars.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Forest Canopy",
    description: "Sunlight filtering through the dense woodland leaves.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
    poster: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Amusement Park",
    description: "Joy and vibrant colors at the local carnival.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-a-girl-blowing-a-bubble-gum-at-an-amusement-park-1226-large.mp4",
    poster: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Feline Grace",
    description: "A white cat relaxing peacefully among tall grasses.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-white-cat-lying-among-the-grasses-100-large.mp4",
    poster: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 7,
    title: "Into the Unknown",
    description: "Walking deeper into the mysterious, foggy woods.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-moving-forward-in-a-forest-1200-large.mp4",
    poster: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 8,
    title: "Companionship",
    description: "Two friends hiking together through the wilderness.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-two-people-walking-in-the-woods-1199-large.mp4",
    poster: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
  },
];

export const MENU_LINKS: MenuLink[] = [
  { id: "01", title: "SHOWCASE",  targetId: "showcase",  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000" },
  { id: "02", title: "DIRECTORS", targetId: "directors", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000" },
  { id: "03", title: "ARCHIVE",   targetId: "archive",   image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000" },
  { id: "04", title: "CONTACT",   targetId: "contact",   image: "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?q=80&w=2000" },
];
