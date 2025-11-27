"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";
import {
  MapPin,
  Camera,
  TreePine,
  Mountain,
  Waves,
  Users,
  Navigation,
  Zap,
  X,
  Palmtree,
  Castle,
} from "lucide-react";

interface Destination {
  id: string;
  name: string;
  country: string;
  type:
    | "wildlife"
    | "waterfall"
    | "hill_station"
    | "cultural"
    | "pilgrimage"
    | "beach"
    | "historical";
  // position not used (we use coordinates), but kept for compatibility
  position: { top: string; left: string };
  coordinates: { lat: number; lng: number };
  description: string;
  highlights: string[];
  bestTime: string;
  difficulty: "easy" | "moderate" | "challenging";
}

const worldDestinations: Destination[] = [
  // Americas
  {
    id: "yellowstone",
    name: "Yellowstone National Park",
    country: "USA",
    type: "wildlife",
    position: { top: "25%", left: "18%" },
    coordinates: { lat: 44.428, lng: -110.5885 },
    description: "First national park with geysers and diverse wildlife",
    highlights: ["Old Faithful Geyser", "Grizzly Bears", "Hot Springs"],
    bestTime: "April to May, September to November",
    difficulty: "moderate",
  },
  {
    id: "machu-picchu",
    name: "Machu Picchu",
    country: "Peru",
    type: "historical",
    position: { top: "65%", left: "24%" },
    coordinates: { lat: -13.1631, lng: -72.545 },
    description: "Ancient Incan citadel in the Andes mountains",
    highlights: ["Inca Ruins", "Mountain Views", "Archaeological Wonder"],
    bestTime: "April to October",
    difficulty: "challenging",
  },
  {
    id: "iguazu",
    name: "Iguazu Falls",
    country: "Brazil/Argentina",
    type: "waterfall",
    position: { top: "70%", left: "30%" },
    coordinates: { lat: -25.6953, lng: -54.4367 },
    description: "Massive waterfall system on Brazil-Argentina border",
    highlights: ["275 Waterfalls", "Rainforest", "Devil's Throat"],
    bestTime: "December to March",
    difficulty: "easy",
  },
  {
    id: "cancun",
    name: "Cancún Beaches",
    country: "Mexico",
    type: "beach",
    position: { top: "42%", left: "20%" },
    coordinates: { lat: 21.1619, lng: -86.8515 },
    description: "Pristine Caribbean beaches and coral reefs",
    highlights: ["White Sand", "Coral Reefs", "Mayan Ruins Nearby"],
    bestTime: "December to April",
    difficulty: "easy",
  },

  // Europe
  {
    id: "alps",
    name: "Swiss Alps",
    country: "Switzerland",
    type: "hill_station",
    position: { top: "28%", left: "48%" },
    coordinates: { lat: 46.8182, lng: 8.2275 },
    description: "Iconic mountain range with world-class skiing",
    highlights: ["Matterhorn", "Skiing", "Alpine Villages"],
    bestTime: "December to March, June to September",
    difficulty: "moderate",
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    type: "beach",
    position: { top: "38%", left: "52%" },
    coordinates: { lat: 36.3932, lng: 25.4615 },
    description: "Stunning volcanic island with white-washed buildings",
    highlights: ["Sunset Views", "Blue Domes", "Volcanic Beaches"],
    bestTime: "April to November",
    difficulty: "easy",
  },
  {
    id: "colosseum",
    name: "Colosseum",
    country: "Italy",
    type: "historical",
    position: { top: "32%", left: "49%" },
    coordinates: { lat: 41.8902, lng: 12.4922 },
    description: "Ancient Roman amphitheater and architectural marvel",
    highlights: ["Roman History", "Architecture", "Gladiator Arena"],
    bestTime: "April to May, September to October",
    difficulty: "easy",
  },
  {
    id: "plitvice",
    name: "Plitvice Lakes",
    country: "Croatia",
    type: "waterfall",
    position: { top: "30%", left: "50%" },
    coordinates: { lat: 44.8654, lng: 15.582 },
    description: "Cascading lakes with turquoise waters",
    highlights: ["16 Lakes", "Wooden Walkways", "Waterfalls"],
    bestTime: "May to September",
    difficulty: "moderate",
  },

  // Asia
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    country: "India",
    type: "historical",
    position: { top: "38%", left: "68%" },
    coordinates: { lat: 27.1751, lng: 78.0421 },
    description: "Iconic white marble mausoleum and wonder of the world",
    highlights: ["Mughal Architecture", "Love Monument", "Marble Inlay"],
    bestTime: "October to March",
    difficulty: "easy",
  },
  {
    id: "mount-fuji",
    name: "Mount Fuji",
    country: "Japan",
    type: "hill_station",
    position: { top: "32%", left: "82%" },
    coordinates: { lat: 35.3606, lng: 138.7274 },
    description: "Sacred volcano and highest peak in Japan",
    highlights: ["Climbing", "Cherry Blossoms", "Five Lakes"],
    bestTime: "July to September",
    difficulty: "challenging",
  },
  {
    id: "halong-bay",
    name: "Ha Long Bay",
    country: "Vietnam",
    type: "beach",
    position: { top: "40%", left: "75%" },
    coordinates: { lat: 20.9101, lng: 107.1839 },
    description: "Emerald waters with thousands of limestone islands",
    highlights: ["Limestone Karsts", "Boat Tours", "Caves"],
    bestTime: "October to April",
    difficulty: "easy",
  },
  {
    id: "angkor-wat",
    name: "Angkor Wat",
    country: "Cambodia",
    type: "historical",
    position: { top: "44%", left: "74%" },
    coordinates: { lat: 13.4125, lng: 103.867 },
    description: "Largest religious monument in the world",
    highlights: ["Khmer Architecture", "Temple Complex", "Sunrise Views"],
    bestTime: "November to March",
    difficulty: "moderate",
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    type: "beach",
    position: { top: "48%", left: "67%" },
    coordinates: { lat: 3.2028, lng: 73.2207 },
    description: "Tropical paradise with crystal-clear waters",
    highlights: ["Overwater Bungalows", "Coral Reefs", "Diving"],
    bestTime: "November to April",
    difficulty: "easy",
  },
  {
    id: "bali",
    name: "Bali Rice Terraces",
    country: "Indonesia",
    type: "cultural",
    position: { top: "52%", left: "78%" },
    coordinates: { lat: -8.4095, lng: 115.1889 },
    description: "Stunning rice paddies and Hindu culture",
    highlights: ["Tegallalang Terraces", "Temples", "Traditional Dance"],
    bestTime: "April to October",
    difficulty: "easy",
  },
  {
    id: "varanasi",
    name: "Varanasi",
    country: "India",
    type: "pilgrimage",
    position: { top: "40%", left: "69%" },
    coordinates: { lat: 25.3176, lng: 82.9739 },
    description: "Holiest city in Hinduism on Ganges River",
    highlights: ["Ganges Ghats", "Spiritual Rituals", "Ancient Temples"],
    bestTime: "October to March",
    difficulty: "moderate",
  },

  // Africa
  {
    id: "serengeti",
    name: "Serengeti National Park",
    country: "Tanzania",
    type: "wildlife",
    position: { top: "52%", left: "54%" },
    coordinates: { lat: -2.3333, lng: 34.8333 },
    description: "Epic wildlife migration and African safari",
    highlights: ["Great Migration", "Big Five", "Savanna"],
    bestTime: "June to October",
    difficulty: "moderate",
  },
  {
    id: "victoria-falls",
    name: "Victoria Falls",
    country: "Zimbabwe/Zambia",
    type: "waterfall",
    position: { top: "62%", left: "52%" },
    coordinates: { lat: -17.9243, lng: 25.8572 },
    description: "Largest waterfall in the world by flow rate",
    highlights: ["Devil's Pool", "108m High", "Rainbow Views"],
    bestTime: "February to May",
    difficulty: "moderate",
  },
  {
    id: "pyramids",
    name: "Pyramids of Giza",
    country: "Egypt",
    type: "historical",
    position: { top: "35%", left: "52%" },
    coordinates: { lat: 29.9792, lng: 31.1342 },
    description: "Ancient Egyptian pyramids and the Sphinx",
    highlights: ["Great Pyramid", "Sphinx", "Ancient Wonder"],
    bestTime: "October to April",
    difficulty: "easy",
  },

  // Oceania
  {
    id: "great-barrier-reef",
    name: "Great Barrier Reef",
    country: "Australia",
    type: "beach",
    position: { top: "65%", left: "84%" },
    coordinates: { lat: -18.2871, lng: 147.6992 },
    description: "World's largest coral reef system",
    highlights: ["Coral Reefs", "Diving", "Marine Life"],
    bestTime: "June to October",
    difficulty: "moderate",
  },
  {
    id: "milford-sound",
    name: "Milford Sound",
    country: "New Zealand",
    type: "hill_station",
    position: { top: "75%", left: "92%" },
    coordinates: { lat: -44.6719, lng: 167.926 },
    description: "Fjord with dramatic cliffs and waterfalls",
    highlights: ["Fjords", "Rainforests", "Waterfalls"],
    bestTime: "December to February",
    difficulty: "moderate",
  },
];

const typeConfig: Record<
  Destination["type"],
  {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    color: string;
    label: string;
  }
> = {
  wildlife: { icon: TreePine, color: "bg-green-500", label: "Wildlife" },
  waterfall: { icon: Waves, color: "bg-blue-500", label: "Waterfall" },
  hill_station: { icon: Mountain, color: "bg-purple-500", label: "Hill Station" },
  cultural: { icon: Users, color: "bg-orange-500", label: "Cultural" },
  pilgrimage: { icon: Camera, color: "bg-red-500", label: "Pilgrimage" },
  beach: { icon: Palmtree, color: "bg-cyan-500", label: "Beach" },
  historical: { icon: Castle, color: "bg-amber-600", label: "Historical" },
};

const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 400;

export default function InteractiveWorldMap() {
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { theme } = useTheme(); // not strictly needed now, but kept if you want to extend later

  // Hydration-safe dotted map: generate only on client
  const [svgMap, setSvgMap] = useState<string | null>(null);

  const map = useMemo(() => new DottedMap({ height: 100, grid: "diagonal" }), []);

  useEffect(() => {
    const svg = map.getSVG({
      radius: 0.22,
      color: "#FFFFFF40", // looks good on dark background
      shape: "circle",
      backgroundColor: "#020617", // slate-950 style dark
    });
    setSvgMap(svg);
  }, [map]);

  const filteredDestinations = worldDestinations.filter(
    (dest) => activeFilter === "all" || dest.type === activeFilter
  );

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (WORLD_WIDTH / 360);
    const y = (90 - lat) * (WORLD_HEIGHT / 180);
    return { x, y };
  };

  const getMarkerStyle = (lat: number, lng: number): React.CSSProperties => {
    const { x, y } = projectPoint(lat, lng);
    return {
      left: `${(x / WORLD_WIDTH) * 100}%`,
      top: `${(y / WORLD_HEIGHT) * 100}%`,
    };
  };

  return (
    <div className="relative bg-black min-h-screen pb-10">
      <h1 className="text-5xl font-bold text-center py-8 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        Explore the World
      </h1>

      {/* Map Container */}
      <div className="relative h-[700px] mx-4 rounded-3xl overflow-hidden shadow-2xl bg-black">
        {/* Always have dark background */}
        <div className="absolute inset-0 bg-black" />

        {/* Only render img when SVG is ready → avoids src="" error */}
        {svgMap && (
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            alt="world map"
            draggable={false}
          />
        )}

        {/* Destination markers */}
        {filteredDestinations.map((destination) => {
          const config = typeConfig[destination.type];
          const IconComponent = config.icon;

          return (
            <motion.div
              key={destination.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={getMarkerStyle(
                destination.coordinates.lat,
                destination.coordinates.lng
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.3 }}
              onClick={() => setSelectedDestination(destination)}
            >
              <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-70" />
              <div
                className={`relative w-10 h-10 ${config.color} rounded-full border-4 border-white/20 shadow-xl flex items-center justify-center`}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>

              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md p-4 rounded-xl border border-orange-500/40 shadow-lg transition">
                <p className="text-white font-bold text-sm">
                  {destination.name}
                </p>
                <p className="text-orange-400 text-xs">
                  {destination.country}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {config.label}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-6 right-6 space-y-3 z-30">
          <button className="w-12 h-12 bg-gray-900/80 border border-orange-500/40 rounded-xl shadow-xl flex items-center justify-center hover:scale-110 transition">
            <Navigation className="text-orange-400 w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-gray-900/80 border border-orange-500/40 rounded-xl shadow-xl flex items-center justify-center hover:scale-110 transition">
            <Zap className="text-orange-400 w-6 h-6" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-gray-900/90 border border-orange-500/30 p-5 rounded-2xl shadow-xl backdrop-blur-md">
          <h4 className="text-white font-bold flex items-center gap-2 mb-3 text-sm">
            <MapPin className="text-orange-400 w-4 h-4" />
            Destination Types
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(typeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-gray-300 text-xs">{config.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Detail Modal */}
        {selectedDestination && (
          <>
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setSelectedDestination(null)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute z-50 top-1/2 left-1/2 bg-gray-900 border border-orange-500/40 rounded-3xl shadow-2xl p-8 max-w-lg w-[90%] -translate-x-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedDestination.name}
                  </h2>
                  <p className="text-orange-400 font-semibold">
                    {selectedDestination.country}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {typeConfig[selectedDestination.type].label}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDestination(null)}
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <p className="text-gray-300 mt-5">
                {selectedDestination.description}
              </p>

              <h4 className="text-white font-bold mt-6 flex items-center gap-2">
                <Camera className="text-orange-400 w-4 h-4" />
                Highlights
              </h4>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedDestination.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-full text-xs"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-800/40 p-4 rounded-2xl mt-6">
                <div>
                  <p className="text-orange-400 text-sm font-semibold">
                    Best Time
                  </p>
                  <p className="text-gray-300 text-sm">
                    {selectedDestination.bestTime}
                  </p>
                </div>
                <div>
                  <p className="text-orange-400 text-sm font-semibold">
                    Difficulty
                  </p>
                  <p
                    className={`font-bold text-sm ${
                      selectedDestination.difficulty === "easy"
                        ? "text-green-400"
                        : selectedDestination.difficulty === "moderate"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedDestination.difficulty}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl shadow-xl font-bold hover:scale-105 transition">
                  Plan Trip
                </button>
                <button className="px-6 py-3 border border-orange-500 text-orange-400 rounded-xl hover:bg-orange-500/10 font-bold hover:scale-105 transition">
                  Learn More
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Filter Controls */}
      <div className="mx-4 mt-6 bg-gray-900/80 border border-orange-500/30 p-5 rounded-2xl flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-5 py-3 rounded-xl font-bold text-sm transition ${
            activeFilter === "all"
              ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          All Destinations ({worldDestinations.length})
        </button>
        {Object.entries(typeConfig).map(([type, config]) => {
          const IconComponent = config.icon;
          const count = worldDestinations.filter(
            (d) => d.type === type
          ).length;
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
                activeFilter === type
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <IconComponent size={16} />
              <span>{config.label}</span>
              <span className="text-xs opacity-75">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
