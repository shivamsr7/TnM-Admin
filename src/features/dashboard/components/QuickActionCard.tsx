import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  icon: React.ElementType;
  path: string;
}

export default function QuickActionCard({
  title,
  icon: Icon,
  path,
}: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group flex items-center justify-between rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary group-hover:text-white">
          <Icon size={20} />
        </div>

        <span className="font-medium text-gray-800">
          {title}
        </span>
      </div>

      <ChevronRight
        size={18}
        className="text-gray-400 transition-transform group-hover:translate-x-1"
      />
    </button>
  );
}