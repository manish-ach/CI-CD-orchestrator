export function statusColor(status) {
  switch (status) {
    case 'passed':
      return 'bg-green-100 text-green-700';

    case 'failed':
      return 'bg-red-100 text-red-700';

    case 'running':
      return 'bg-yellow-100 text-yellow-700';

    default:
      return 'bg-gray-100 text-gray-700';
  }
}