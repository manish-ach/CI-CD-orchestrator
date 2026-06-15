// utils.js
export const formatDuration = (seconds) => {
  return `${seconds}s`;
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  
  if (isNaN(diffMs)) return isoString;
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffSecs < 0) {
    return 'Just now'; // If system times drift slightly
  }
  
  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} mins ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffHours < 48) {
    return 'Yesterday';
  } else {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
};

export const getStatusColor = (status) => {
  const normStatus = (status || '').toLowerCase();
  switch (normStatus) {
    case 'passed':
    case 'success':
      return 'text-emerald-700 bg-emerald-50 border border-emerald-200/60';
    case 'failed':
    case 'failure':
      return 'text-rose-700 bg-rose-50 border border-rose-200/60';
    case 'running':
      return 'text-amber-700 bg-amber-50 border border-amber-200/60';
    case 'pending':
    default:
      return 'text-slate-600 bg-slate-50 border border-slate-200/60';
  }
};

export const queryStringToObject = () => {
  const params = new URLSearchParams(window.location.search);
  const obj = {};
  for (const [key, value] of params) {
    obj[key] = value;
  }
  return obj;
};
