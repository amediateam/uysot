import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";
import merge from "lodash.merge";

type ConfigFnResult = Record<string, unknown> | void;

interface HttpInitOptions {
  config?: CreateAxiosDefaults;
  configFn?: (
    config: InternalAxiosRequestConfig,
  ) => ConfigFnResult | Promise<ConfigFnResult>;
}

class HttpClient {
  private instance?: AxiosInstance;

  private defaults: CreateAxiosDefaults = {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  get http() {
    return this.instance != null ? this.instance : this.init();
  }

  get request() {
    return this.http;
  }

  init({ config, configFn }: HttpInitOptions = {}) {
    const instance = axios.create(merge(this.defaults, config));

    instance.interceptors.request.use(
      async (requestConfig) => {
        if (configFn) {
          const result = await configFn(requestConfig);
          return result instanceof Promise
            ? result.then((resolved) => Promise.resolve(merge(requestConfig, resolved)))
            : merge(requestConfig, result || {});
        }
        return requestConfig;
      },
      (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        return HttpClient.handleError(response);
      },
    );

    this.instance = instance;
    return instance;
  }

  // Отклоняет промис объектом response, а не AxiosError; без ответа сервера это undefined.
  static handleError(response?: AxiosResponse) {
    const { status } = response || {};
    switch (status) {
      case 500:
        break;
      case 403:
        break;
      case 401:
        break;
      case 429:
        break;
      default:
        return Promise.reject(response);
    }
    return Promise.reject(response);
  }
}

export const http = new HttpClient();
