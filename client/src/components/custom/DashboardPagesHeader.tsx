function DashboardPagesHeader({ title, subtitle }: DashboardPagesHeaderProps) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

export default DashboardPagesHeader;
