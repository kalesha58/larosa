export const formatCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN')}`;
};

export const formatMoney = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (startedAt: string, finishedAt: string): string => {
  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();
  const diffMs = end - start;
  if (diffMs <= 0) return '0s';
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return `${diffSecs}s`;
  const diffMins = Math.floor(diffSecs / 60);
  return `${diffMins}m ${diffSecs % 60}s`;
};

export const formatDateRange = (start: string | Date, end: string | Date): string => {
  const s = new Date(start);
  const e = new Date(end);
  const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${s.toLocaleDateString('en-US', opt)} – ${e.toLocaleDateString('en-US', opt)}`;
};

export const bookingSourceLabel = (source: string): string => {
  if (source === 'airbnb') return 'Airbnb';
  if (source === 'website') return 'Website';
  return 'Manual';
};

export const getGreeting = (): string => {
  const hrs = new Date().getHours();
  if (hrs < 12) return 'Good morning';
  if (hrs < 17) return 'Good afternoon';
  return 'Good evening';
};

export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'yesterday';
  return `${diffDays}d ago`;
};

export const amenityOptions: string[] = [
  'Wifi',
  'Air Conditioning',
  'Room Service',
  'Private swimming pool',
  'Expansive landscaped gardens',
  'Lake views',
  'Secluded estate setting',
  'Kitchen',
  'Smart TV',
  'Free Parking',
  'Gym',
  'Chef on Demand',
  'Lounge Area',
];
