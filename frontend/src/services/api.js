const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch('/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchProviders() {
  const res = await fetch(`${API_BASE}/providers`);
  if (!res.ok) throw new Error('Failed to fetch providers');
  return res.json();
}

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

export async function createSession(title = "New Product Session", provider = "ollama", model = "llama3") {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, provider, model })
  });
  if (!res.ok) throw new Error('Failed to create session');
  return res.json();
}

export async function fetchSessionDetail(sessionId) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch session detail');
  return res.json();
}

export async function deleteSession(sessionId) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete session');
  return true;
}

export async function sendChatMessage(sessionId, message, provider, model) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_id: sessionId,
      message,
      provider,
      model
    })
  });
  if (!res.ok) throw new Error('Failed to send chat message');
  return res.json();
}

export async function triggerShip30Skill(sessionId, topic) {
  const res = await fetch(`${API_BASE}/skills/ship30`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: sessionId, topic })
  });
  if (!res.ok) throw new Error('Failed to generate Ship 30 essay');
  return res.json();
}

export async function createArtifact(sessionId, prompt, artifactType, title) {
  const res = await fetch(`${API_BASE}/artifacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_id: sessionId,
      prompt,
      artifact_type: artifactType,
      title
    })
  });
  if (!res.ok) throw new Error('Failed to generate artifact');
  return res.json();
}

export async function fetchArtifact(artifactId) {
  const res = await fetch(`${API_BASE}/artifacts/${artifactId}`);
  if (!res.ok) throw new Error('Failed to fetch artifact');
  return res.json();
}
