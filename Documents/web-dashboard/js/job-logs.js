import { fetchLogs } from './api.js';

const logsElement = document.getElementById('logs');

const params = new URLSearchParams(window.location.search);

const jobId = params.get('job');

async function loadLogs() {
  const logs = await fetchLogs(jobId);

  logsElement.textContent =
    logs.stdout + '\n' + logs.stderr;
}

loadLogs();