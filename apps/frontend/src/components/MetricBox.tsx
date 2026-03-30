interface MetricBoxProps {
  title: string;
  value: string | number;
}

export function MetricBox({ title, value }: MetricBoxProps) {
  return (
    <div className="flex h-[72px] w-full flex-col justify-center rounded-lg bg-[#232225]/80 px-5 border border-white/5 backdrop-blur-sm">
      <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
        {title}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
