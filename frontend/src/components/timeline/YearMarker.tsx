interface YearMarkerProps {
  year: number;
  position: number;
}

const YearMarker = ({ year, position }: YearMarkerProps) => {
  return (
    <div
      className="absolute bottom-16 flex flex-col items-center"
      style={{ left: `${position}px` }}
    >
      {/* Tick mark */}
      <div className="w-px h-4 bg-muted-foreground/30" />
      
      {/* Year label */}
      <span className="mt-1 text-xs text-muted-foreground/50 font-medium">
        {year}
      </span>
    </div>
  );
};

export default YearMarker;