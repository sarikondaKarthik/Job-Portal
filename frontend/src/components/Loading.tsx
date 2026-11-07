type LoadingProps = {
  label?: string;
};

export default function Loading({ label = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-600">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
