import { Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

/**
 * Generic, reusable HTTP CRUD client built on top of axios.
 *
 * It is technology-agnostic: callers pass the absolute or relative URL plus the
 * payload, and the service performs the corresponding HTTP verb. A shared axios
 * instance is reused so connection pooling / default headers stay consistent.
 */
@Injectable()
export class HttpCrudService {
  private readonly logger = new Logger(HttpCrudService.name);
  private readonly client: AxiosInstance;

  /** Número máximo de intentos por petición (1 original + 2 reintentos). */
  private readonly maxAttempts = 3;
  /** Backoff base entre reintentos (ms); crece de forma exponencial. */
  private readonly retryDelayMs = 300;

  constructor() {
    this.client = axios.create({
      timeout: 10_000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /** POST — create one or many resources. */
  async create<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request(() => this.client.post<TResponse>(url, body, config));
  }

  /** GET — read a collection. */
  async findAll<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request(() => this.client.get<TResponse>(url, config));
  }

  /** GET — read a single resource. */
  async findOne<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request(() => this.client.get<TResponse>(url, config));
  }

  /** PUT/PATCH — update an existing resource. */
  async update<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request(() => this.client.patch<TResponse>(url, body, config));
  }

  /** DELETE — remove a resource. */
  async remove<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    return this.request(() => this.client.delete<TResponse>(url, config));
  }

  /**
   * Ejecuta la petición aplicando una política de reintentos (máximo
   * {@link maxAttempts} intentos) con backoff exponencial. Solo reintenta
   * errores transitorios (red/timeout o 5xx); los 4xx fallan de inmediato.
   */
  private async request<TResponse>(
    fn: () => Promise<AxiosResponse<TResponse>>,
  ): Promise<TResponse> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        const response = await fn();
        return response.data;
      } catch (error) {
        lastError = error;
        this.logError(error, attempt);

        if (attempt >= this.maxAttempts || !this.isRetryable(error)) {
          break;
        }

        await this.delay(this.retryDelayMs * attempt);
      }
    }

    throw lastError;
  }

  /** Indica si un error es transitorio y vale la pena reintentar. */
  private isRetryable(error: unknown): boolean {
    if (!axios.isAxiosError(error)) {
      return false;
    }
    const status = error.response?.status;
    // Sin respuesta => fallo de red/timeout (reintentable). Con respuesta,
    // solo reintentamos errores de servidor (5xx).
    return status === undefined || status >= 500;
  }

  private logError(error: unknown, attempt: number): void {
    const prefix = `[intento ${attempt}/${this.maxAttempts}]`;
    if (axios.isAxiosError(error)) {
      this.logger.error(
        `${prefix} HTTP request failed (${error.config?.method?.toUpperCase()} ${error.config?.url}): ` +
          `${error.response?.status ?? ''} ${error.message}`,
      );
    } else {
      this.logger.error(`${prefix} Unexpected HTTP error: ${String(error)}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
