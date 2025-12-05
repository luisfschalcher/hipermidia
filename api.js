const API_BASE = 'http://localhost:4000/mentorias';

export async function getMentorias() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Erro ao buscar mentorias: ' + res.status);
  return res.json();
}

export async function getMentoria(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Erro ao buscar mentoria: ' + res.status);
  return res.json();
}

export async function createMentoria(payload) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error('Erro create: ' + res.status + ' ' + errBody);
  }
  return res.json();
}

export async function updateMentoria(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro update: ' + res.status);
  return res.json();
}

export async function deleteMentoria(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro delete: ' + res.status);
  return true;
}