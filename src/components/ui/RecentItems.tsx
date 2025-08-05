interface RecentItem {
  id: string;
  name: string;
  onClick?: () => void;
}

interface RecentItemsProps {
  title?: string;
  items: RecentItem[];
  className?: string;
}

export default function RecentItems({
  title = "Recents",
  items,
  className = "",
}: RecentItemsProps) {
  return (
    <div className={`py-4 border-t border-gray-100 ${className}`}>
      <h3 className="px-4 text-xs font-geist font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>

      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full text-left px-4 py-2 font-geist text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors truncate"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
