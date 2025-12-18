import { Card, CardContent } from "./ui/card";

export function StackCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="bg-primary-200 dark:bg-primary-100 border-border hover:border-primary/50 transition-colors group">
      <CardContent className="pt-6">
        <div className="mb-4 p-2 w-fit rounded-lg bg-primary/10 text-primary-900 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <h3 className="font-bold text-primary-900 text-lg mb-2">{title}</h3>
        <p className="text-sm text-primary-500  line-clamp-2">{desc}</p>
      </CardContent>
    </Card>
  );
}
