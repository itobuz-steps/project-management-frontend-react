import { Card, Typography } from 'antd';

export function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gray-200 shadow-sm dark:border-slate-700">
      <div className="mb-4">
        <Typography.Title level={5} className="mb-0.5!">
          {title}
        </Typography.Title>
        {subtitle && (
          <Typography.Text type="secondary" className="text-xs">
            {subtitle}
          </Typography.Text>
        )}
      </div>
      {children}
    </Card>
  );
}