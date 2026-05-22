export async function fetchPipelines() {
  const response = await fetch('./mock/pipelines.json');

  return response.json();
}

export async function fetchPipeline(id) {
  const response = await fetch(`./mock/pipeline-${id}.json`);

  return response.json();
}

export async function fetchLogs(jobId) {
  const response = await fetch(`./mock/logs-${jobId}.json`);

  return response.json();
}