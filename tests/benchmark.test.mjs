import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {validateWorkspace, renderWorkspace, build} from '../scripts/build.mjs';

test('performance benchmarks', async () => {
  const workspaceStr = await readFile(new URL('../workspace.json', import.meta.url), 'utf8');
  const workspace = JSON.parse(workspaceStr);

  const iterations = 10000;

  // Benchmark renderWorkspace (which includes validateWorkspace and escapeHtml)
  const startRender = performance.now();
  for (let i = 0; i < iterations; i++) {
    renderWorkspace(workspace);
  }
  const endRender = performance.now();
  const renderTime = endRender - startRender;
  const maxAllowedRenderTime = 500; // ms for 10000 iterations

  assert.ok(
    renderTime < maxAllowedRenderTime,
    `renderWorkspace is too slow. Took ${renderTime.toFixed(2)}ms (limit: ${maxAllowedRenderTime}ms)`
  );
  console.log(`renderWorkspace benchmark: ${renderTime.toFixed(2)}ms for ${iterations} iterations`);
});
