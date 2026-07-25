import SearchBar from "@/components/shared/SearchBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BannerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;
}

export default function BannerFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: BannerFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:max-w-sm">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search banners..."
        />
      </div>

      <div className="w-full md:w-56">
        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All
            </SelectItem>

            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}