return (

<div
key={template.id}
className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
onClick={() => onSelect(template)} >
{/_ Thumbnail _/}
<div className="mb-4">
<img
src={template.thumbnail}
alt={template.name}
className="w-full h-32 object-cover rounded-lg"
onError={(e) => {
e.target.src =
"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop";
}}
/>
</div>

      {/* Info */}
      <h3 className="font-semibold text-lg text-gray-800 mb-2">
        {template.name}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {template.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{template.parents?.length || 0} Sections</span>
        <span>
          {template.parents?.reduce(
            (total, parent) => total + (parent.rnds?.length || 0),
            0
          ) || 0}{" "}
          Elements
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Preview template:", template.id);
          }}
          className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
        >
          <FaEye size={12} />
          Preview
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLoad(template.id);
          }}
          className="flex-1 py-2 px-3 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
        >
          <FaDownload size={12} />
          Use This
        </button>
      </div>
    </div>

);
