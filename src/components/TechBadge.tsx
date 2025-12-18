export default function TechBadge({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-primary-300 rounded-full bg-primary-800 border border-border text-sm font-medium">
      <Icon className="w-4 h-4 text-primary-300" />
      {children}
    </div>
  );
}
