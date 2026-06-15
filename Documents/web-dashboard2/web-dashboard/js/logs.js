// logs.js
import { queryStringToObject } from './utils.js';

const params = queryStringToObject();
const jobId = params.id;

if (!jobId) {
  alert('No job ID provided.');
  window.location.href = 'index.html';
}

const logsUrl = `mock/logs-${jobId}.json`;
const lastUpdatedEl = document.getElementById('lastUpdated');
const loadingEl = document.getElementById('loading');
const logsContent = document.getElementById('logsContent');
const emptyLogs = document.getElementById('emptyLogs');
const stdoutEl = document.getElementById('stdout');
const stderrEl = document.getElementById('stderr');
const jobTitleEl = document.getElementById('jobTitle');
const backLink = document.getElementById('backLink');

// Set back link dynamically
let pipelineId = 'p1';
if (jobId.startsWith('auth-')) pipelineId = 'auth-service-prod';
else if (jobId.startsWith('pay-')) pipelineId = 'payment-gateway';
else if (jobId.startsWith('da-')) pipelineId = 'data-analyzer-core';
else if (jobId.startsWith('fe-')) pipelineId = 'frontend-web-app';
else if (jobId.startsWith('inv-')) pipelineId = 'inventory-svc';
else if (jobId.startsWith('not-')) pipelineId = 'notification-worker';
else if (jobId.startsWith('srch-')) pipelineId = 'search-indexer';
else if (jobId.startsWith('api-')) pipelineId = 'api-documentation';
else if (jobId.startsWith('cache-')) pipelineId = 'cache-manager';
else if (jobId.startsWith('prof-')) pipelineId = 'user-profile-svc';
else if (jobId === 'j1' || jobId === 'j2') pipelineId = 'p1';
else if (jobId === 'j3' || jobId === 'j4') pipelineId = 'p2';

backLink.href = `pipeline.html?id=${pipelineId}`;

const updateLastUpdated = () => {
  lastUpdatedEl.textContent = new Date().toLocaleTimeString();
};

const loadLogs = async () => {
  try {
    const res = await fetch(logsUrl);
    if (!res.ok) throw new Error('Logs not found');

    const data = await res.json();

    jobTitleEl.textContent = `Logs: ${jobId}`;

    stdoutEl.textContent = data.stdout || '(no output)';
    stderrEl.textContent = data.stderr || '(no errors)';

    if (!data.stdout && !data.stderr) {
      logsContent.classList.add('hidden');
      emptyLogs.classList.remove('hidden');
    } else {
      emptyLogs.classList.add('hidden');
      logsContent.classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error loading logs:', err);
    logsContent.innerHTML = `<p class="text-red-500">Failed to load logs.</p>`;
    logsContent.classList.remove('hidden');
  }
};

const init = async () => {
  loadingEl.classList.remove('hidden');
  logsContent.classList.add('hidden');
  emptyLogs.classList.add('hidden');
  await loadLogs();
  loadingEl.classList.add('hidden');
  updateLastUpdated();
};

// Auto-refresh
setInterval(init, 3000);
init();
