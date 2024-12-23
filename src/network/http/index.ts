class HttpService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        method: string,
        endpoint: string,
        body?: any,
        headers: Record<string, string> = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }
            return (await response.json()) as T;
        } catch (error) {
            console.error(`Error during ${method} request to ${url}:`, error);
            throw error;
        }
    }

    async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
        return this.request<T>('GET', endpoint, undefined, headers);
    }

    async post<T>(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.request<T>('POST', endpoint, body, headers);
    }

    async put<T>(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.request<T>('PUT', endpoint, body, headers);
    }

    async patch<T>(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.request<T>('PATCH', endpoint, body, headers);
    }

    async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
        return this.request<T>('DELETE', endpoint, undefined, headers);
    }
}

export default HttpService;
