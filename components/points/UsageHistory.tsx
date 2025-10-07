'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Image, Video, Code, Search, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface UsageLog {
  id: string;
  actionType: string;
  pointsUsed: number;
  createdAt: string;
}

interface UsageHistoryData {
  logs: UsageLog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  image_generation: <Image className="h-4 w-4 text-purple-500" />,
  video_generation: <Video className="h-4 w-4 text-red-500" />,
  ai_code_edit: <Code className="h-4 w-4 text-blue-500" />,
  search_perplexica: <Search className="h-4 w-4 text-green-500" />,
  rag_query: <FileText className="h-4 w-4 text-orange-500" />,
  nextjs_project_generation: <Code className="h-4 w-4 text-cyan-500" />
};

const ACTION_LABELS: Record<string, string> = {
  image_generation: 'Image Generation',
  video_generation: 'Video Generation',
  ai_code_edit: 'AI Code Edit',
  search_perplexica: 'Perplexica Search',
  rag_query: 'RAG Query',
  nextjs_project_generation: 'Next.js Project'
};

export function UsageHistory() {
  const [data, setData] = useState<UsageHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchUsageHistory = async (offset = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`/api/points/usage-logs?limit=20&offset=${offset}`);
      const result = await response.json();

      if (result.success) {
        if (append && data) {
          setData({
            ...result.data,
            logs: [...data.logs, ...result.data.logs]
          });
        } else {
          setData(result.data);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (data && data.pagination.hasMore) {
      fetchUsageHistory(data.logs.length, true);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchUsageHistory();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Usage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Usage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No usage history yet</p>
            <p className="text-sm">Start using AI features to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Usage History
        </CardTitle>
        <p className="text-sm text-gray-600">
          Total activities: {data.pagination.total}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {ACTION_ICONS[log.actionType] || <FileText className="h-4 w-4 text-gray-500" />}
                </div>
                <div>
                  <div className="font-medium">
                    {ACTION_LABELS[log.actionType] || log.actionType}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="font-mono">
                -{log.pointsUsed} pts
              </Badge>
            </div>
          ))}

          {data.pagination.hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

