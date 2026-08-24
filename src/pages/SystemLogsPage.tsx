import { useState, useEffect } from 'react';

type SystemLog = {
  id: number;
  action: string;
  description: string;
  created_at: string;
};

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/system-logs', { cache: 'no-store' });
        if (!res.ok) throw new Error('Gagal mengambil data log');
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat log aktivitas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-on-background tracking-tight">System Logs</h2>
          <p className="text-lg text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
            Pantau rekam jejak aktivitas penting yang terjadi di sistem.
          </p>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {isLoading ? (
          <div className="text-gray-500 py-4 font-medium">Memuat data...</div>
        ) : error ? (
          <div className="text-red-500 py-4 font-medium">{error}</div>
        ) : logs.length === 0 ? (
          <div className="text-gray-500 py-4">Belum ada catatan aktivitas</div>
        ) : (
          <div className="flex flex-col gap-4">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div>
                  <h4 className="font-bold text-gray-900">{log.action}</h4>
                  <p className="text-sm text-gray-500 mt-1">{log.description}</p>
                </div>
                <span className="text-sm text-gray-500 mt-2 sm:mt-0 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
