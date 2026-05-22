import { fetchPipelines } from './api.js';
import { statusColor } from './utils.js';

const container = document.getElementById('pipelines');

async function loadPipelines() {
  const pipelines = await fetchPipelines();

  container.innerHTML = pipelines.map(pipeline => `
    <a
      href="pipeline.html?id=${pipeline.id}"
      class="block bg-white p-4 rounded shadow hover:bg-gray-50"
    >
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-bold text-lg">
            ${pipeline.name}
          </h2>

          <p class="text-gray-500">
            ${pipeline.branch}
          </p>
        </div>

        <span class="
          px-3 py-1 rounded text-sm font-medium
          ${statusColor(pipeline.status)}
        ">
          ${pipeline.status}
        </span>
      </div>
    </a>
  `).join('');
}

loadPipelines();

setInterval(loadPipelines, 3000);