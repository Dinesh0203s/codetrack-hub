import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RatingBucket {
  range: string;
  count: number;
}

interface RatingHistogramProps {
  title: string;
  description?: string;
  data: RatingBucket[];
  color: string;
  averageRating?: number;
  maxRating?: number;
  minRating?: number;
  totalUsers?: number;
}

export function RatingHistogram({
  title,
  description,
  data,
  color,
  averageRating,
  maxRating,
  minRating,
  totalUsers
}: RatingHistogramProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="flex flex-wrap gap-4 pt-2 text-sm">
          {totalUsers !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Total Users:</span>
              <span className="font-semibold">{totalUsers}</span>
            </div>
          )}
          {averageRating !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Avg Rating:</span>
              <span className="font-semibold">{averageRating.toFixed(0)}</span>
            </div>
          )}
          {maxRating !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Max:</span>
              <span className="font-semibold">{maxRating}</span>
            </div>
          )}
          {minRating !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Min:</span>
              <span className="font-semibold">{minRating}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={60}
              className="fill-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar 
              dataKey="count" 
              fill={color}
              radius={[4, 4, 0, 0]}
              name="Users"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
