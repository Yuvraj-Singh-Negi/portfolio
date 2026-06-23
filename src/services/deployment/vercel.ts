interface VercelDeploymentConfig {
  token: string;
  teamId?: string;
}

interface VercelFile {
  file: string;
  data: string;
}

interface VercelCreateDeploymentPayload {
  name: string;
  project: string;
  files: VercelFile[];
  framework: string;
  gitSource?: undefined;
}

interface VercelDeploymentResponse {
  id: string;
  url: string;
  name: string;
  status: string;
  readyState: string;
  createdAt: number;
  buildingAt?: number;
  readyAt?: number;
  error?: {
    code: string;
    message: string;
  };
}

export class VercelClient {
  private config: VercelDeploymentConfig;
  private baseUrl = "https://api.vercel.com";

  constructor(config: VercelDeploymentConfig) {
    this.config = config;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.token}`,
      "Content-Type": "application/json",
    };
  }

  private get baseParams(): string {
    const params = new URLSearchParams();
    if (this.config.teamId) {
      params.set("teamId", this.config.teamId);
    }
    return params.toString();
  }

  async createDeployment(
    name: string,
    files: Record<string, string>
  ): Promise<VercelDeploymentResponse> {
    const vercelFiles: VercelFile[] = Object.entries(files).map(
      ([path, content]) => ({
        file: path,
        data: Buffer.from(content).toString("base64"),
      })
    );

    const payload: VercelCreateDeploymentPayload = {
      name: name.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40) || "app",
      project: name.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40) || "app",
      files: vercelFiles,
      framework: "nextjs",
    };

    const res = await fetch(
      `${this.baseUrl}/v13/deployments?${this.baseParams}`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Vercel API error (${res.status}): ${error}`);
    }

    return res.json();
  }

  async getDeployment(deploymentId: string): Promise<VercelDeploymentResponse> {
    const res = await fetch(
      `${this.baseUrl}/v13/deployments/${deploymentId}?${this.baseParams}`,
      { headers: this.headers }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Vercel API error (${res.status}): ${error}`);
    }

    return res.json();
  }

  async getDeploymentLogs(
    deploymentId: string,
    limit: number = 100
  ): Promise<string[]> {
    const res = await fetch(
      `${this.baseUrl}/v13/deployments/${deploymentId}/events?${this.baseParams}&limit=${limit}`,
      { headers: this.headers }
    );

    if (!res.ok) return [];

    const events = await res.json();
    return (Array.isArray(events) ? events : [])
      .filter((e: any) => e.text)
      .map((e: any) => `[${e.created ? new Date(e.created).toISOString() : ""}] ${e.text}`);
  }
}

export function createVercelClient(): VercelClient {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    throw new Error(
      "VERCEL_API_TOKEN not configured in environment variables"
    );
  }
  return new VercelClient({
    token,
    teamId: process.env.VERCEL_TEAM_ID,
  });
}
