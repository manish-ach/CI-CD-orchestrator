import { fetchPipeline } from './api.js';
import { statusColor } from './utils.js';

const container = document.getElementById('jobs');

const params = new URLSearchParams(window.location.search);

const pipelineId = params.get('id');

async function loadPipeline() {
  const pipeline = await fetchPipeline(pipelineId);

  container.innerHTML = pipeline.jobs.map(job => `
    <a
      href="job.html?job=${job.id}"
      class="block bg-white p-4 rounded shadow"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-bold">
            ${job.name}
          </h2>

          <p class="text-gray-500">
            ${job.duration_sec}s
          </p>
        </div>

        <span class="
          px-3 py-1 rounded text-sm
          ${statusColor(job.status)}
        ">
          ${job.status}
        </span>
      </div>
    </a>
  `).join('');
}

loadPipeline();