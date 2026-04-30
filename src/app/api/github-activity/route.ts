export const dynamic = 'force-dynamic';

interface GitHubEventRaw {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: unknown[];
    size?: number;
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { merged: boolean };
  };
  created_at: string;
}

export async function GET() {
  const res = await fetch('https://api.github.com/users/aosmannn/events/public?per_page=15', {
    headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'adamosman-portfolio' },
    next: { revalidate: 300 },
  });
  const data: GitHubEventRaw[] = await res.json();

  // Normalize PushEvent commit counts using size (authoritative) then commits array length
  const normalized = data.map(event => {
    if (event.type === 'PushEvent') {
      const count = event.payload.size ?? event.payload.commits?.length ?? 0;
      return {
        ...event,
        payload: { ...event.payload, size: count, commits: Array(count).fill(null) },
      };
    }
    return event;
  });

  // Filter out PushEvents with 0 commits
  const filtered = normalized.filter(event => {
    if (event.type === 'PushEvent') {
      const count = event.payload.size ?? 0;
      return count > 0;
    }
    return true;
  });

  return Response.json(filtered);
}
