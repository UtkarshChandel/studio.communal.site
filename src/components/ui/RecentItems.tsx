interface RecentItem {
  id: string;
  name: string;
  onClick?: () => void;
}

interface RecentItemsProps {
  title?: string;
  items: RecentItem[];
  className?: string;
  activeId?: string | null;
  isLoading?: boolean;
}

export default function RecentItems({
  title = "Recents",
  items,
  className = "",
  activeId,
  isLoading = false,
}: RecentItemsProps) {
  return (
    <div className={`py-4 border-t border-gray-100 ${className}`}>
      <h3 className="px-4 text-xs font-geist font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>

      <div className="space-y-1">
        {isLoading && items.length === 0 && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </>
        )}
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`w-full text-left px-4 py-2 font-geist text-sm transition-colors truncate rounded-md cursor-pointer hover:cursor-pointer ${
                isActive
                  ? "text-gray-800 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={
                isActive
                  ? {
                      cursor: "pointer",
                      background:
                        "linear-gradient(90deg, rgba(67, 97, 238, 0.14) 0%, rgba(58, 12, 163, 0.14) 100%)",
                    }
                  : { cursor: "pointer" }
              }
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
