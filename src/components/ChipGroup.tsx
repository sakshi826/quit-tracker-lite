interface ChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

const ChipGroup = ({ label, options, selected, onToggle }: ChipGroupProps) => (
  <div className="space-y-2">
    <p className="label-text">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            className={isSelected ? "chip-selected" : "chip-unselected"}
          >
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export default ChipGroup;
