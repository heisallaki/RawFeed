export interface CategoryOption {
  value: string;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryOption[] = [
  { value: "government_politics", label: "Government & Politics", icon: "🏛️" },
  { value: "economy_business", label: "Economy & Business", icon: "💰" },
  { value: "technology_ai", label: "Technology & AI", icon: "💻" },
  { value: "science", label: "Science", icon: "🔬" },
  { value: "health", label: "Health", icon: "🩺" },
  { value: "security", label: "Security", icon: "🛡️" },
  { value: "climate_weather", label: "Climate & Weather", icon: "🌦️" },
  { value: "transportation", label: "Transportation", icon: "🚆" },
  { value: "emergencies_disasters", label: "Emergencies & Disasters", icon: "🚨" },
  { value: "public_figures", label: "Public Figures", icon: "🎤" },
  { value: "other", label: "Other", icon: "📰" },
];