// pipeline.js
import { formatDuration, getStatusColor, queryStringToObject } from './utils.js';

const params = queryStringToObject();
const pipelineId = params.id;

if (!pipelineId) {
  alert('No pipeline ID provided.');
  window.location.href = 'index.html';
}

const pipelineUrl = `mock/pipeline-${pipelineId}.json`;
const lastUpdatedEl = document.getElementById('lastUpdated');
const loadingEl = document.getElementById('loading');
const jobsContainer = document.getElementById('jobsContainer');
const emptyJobs = document.getElementById('emptyJobs');
const pipelineNameEl = document.getElementById('pipelineName');
const pipelineBranchEl = document.getElementById('pipelineBranch');

const updateLastUpdated = () => {
  lastUpdatedEl.textContent = new Date().toLocaleTimeString();
};

const loadPipeline = async () => {
  try {
    const res = await fetch(pipelineUrl);
    if (!res.ok) throw new Error('Pipeline not found');

    const data = await res.json();
    pipelineNameEl.textContent = `Pipeline: ${data.id}`;
    pipelineBranchEl.textContent = data.branch || 'main';

    jobsContainer.innerHTML = '';
    if (!data.jobs || data.jobs.length === 0) {
      jobsContainer.classList.add('hidden');
      emptyJobs.classList.remove('hidden');
      return;
    }

    emptyJobs.classList.add('hidden');
    jobsContainer.classList.remove('hidden');
    data.jobs.forEach(job => {
      const jobCard = document.createElement('div');
      jobCard.className = 'group bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-400/60 transition duration-150 cursor-pointer shadow-sm flex items-center justify-between hover:bg-slate-50/50';
      
      const statusPillColor = getStatusColor(job.status);
      const statusText = job.status.toUpperCase();
      
      let statusIcon = '';
      const normStatus = (job.status || '').toLowerCase();
      if (normStatus === 'passed' || normStatus === 'success') {
        statusIcon = `
          <svg class="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        `;
      } else if (normStatus === 'running') {
        statusIcon = `
          <svg class="w-3.5 h-3.5 mr-1 text-amber-600 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        `;
      } else if (normStatus === 'failed' || normStatus === 'failure') {
        statusIcon = `
          <svg class="w-3.5 h-3.5 mr-1 text-rose-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        `;
      } else {
        statusIcon = `
          <svg class="w-3.5 h-3.5 mr-1 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        `;
      }

      jobCard.innerHTML = `
        <div class="flex flex-col space-y-1">
          <h3 class="text-sm font-bold text-slate-900 group-hover:text-black transition-colors truncate max-w-[200px]">${job.name}</h3>
          <span class="text-xs text-slate-400 font-medium">Duration: <span class="font-mono text-slate-500">${formatDuration(job.duration_sec)}</span></span>
        </div>
        <div class="flex items-center space-x-3 flex-shrink-0">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${statusPillColor}">
            ${statusIcon}
            <span>${statusText}</span>
          </span>
          <svg class="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      `;
      jobCard.addEventListener('click', () => {
        window.location.href = `logs.html?id=${job.id}`;
      });
      jobsContainer.appendChild(jobCard);
    });
  } catch (err) {
    console.error('Error loading pipeline:', err);
    jobsContainer.innerHTML = `<p class="text-red-500">Failed to load pipeline details.</p>`;
    jobsContainer.classList.remove('hidden');
  }
};

const init = async () => {
  loadingEl.classList.remove('hidden');
  jobsContainer.classList.add('hidden');
  emptyJobs.classList.add('hidden');
  await loadPipeline();
  loadingEl.classList.add('hidden');
  updateLastUpdated();
};

// Auto-refresh
setInterval(init, 3000);
init();
