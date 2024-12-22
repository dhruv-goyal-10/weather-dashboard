import { useState, useEffect, useRef } from "react";
import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchLocation } from "@/utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface SearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export function SearchComponent({ onLocationSelect }: SearchProps) {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [results, setResults] = useState<
    { lat: number; lon: number; display_name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom debounce implementation
  const debounce = (callback: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      setIsOpen(true);
      setIsLoading(true);
      setSelectedLocation(null);
      try {
        const searchResults = await searchLocation(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Error searching for location:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  // Create debounced search function
  const debouncedSearch = useRef(debounce(performSearch, 200)).current;

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for a location..."
          value={selectedLocation !== null ? selectedLocation : query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 bg-white border-[#e5e7eb] focus:border-blue-500 transition-colors"
          ref={inputRef}
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <X
          className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
          onClick={() => {
            setQuery("");
            setSelectedLocation(null);
            inputRef.current?.focus();
          }}
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50"
          >
            {isLoading && (
              <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
            )}
            {!isLoading && results.length === 0 && query && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No results found...
              </div>
            )}
            {!isLoading && results.length > 0 && (
              <ul className="max-h-60 overflow-auto">
                {results.map((result, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onLocationSelect(result.lat, result.lon);
                      setResults([]);
                      setQuery("");
                      setIsOpen(false);
                      setSelectedLocation(result.display_name);
                    }}
                    className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {result.display_name}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
