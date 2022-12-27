import ApiClient, {
  ApiResponse,
  ErrorResInterface,
  Token,
} from 'api/base/ApiClient';
import BaseClient from 'api/base/BaseClient';
import { makePath } from 'utils/str';
import { AxiosRequestHeaders } from 'axios';
import Config from 'config';

const config = Config();

interface ClientType<T> {
  new (client: ApiClient): T;

  readonly prefix: string;
}

export interface ApiConfig {
  host?: string | null;
  prefix?: string | null;
  headers?: AxiosRequestHeaders;
  token?: Token;
}

export const apiResponse = (res: ApiResponse): any | ErrorResInterface => {
  if (res.isSuccess && res.res) {
    return res.res.data;
  }

  if (res.error) {
    return res.error;
  }
};

/**
 * @param {ApiConfig} apiConfig
 * @returns {ApiClient}
 */
export const api = (apiConfig?: ApiConfig): ApiClient => {
  if (apiConfig?.prefix) {
    if (!apiConfig?.host) {
      apiConfig.host = config.api.default.host as string;
    }

    try {
      const url = new URL(apiConfig.host);
      apiConfig.host =
        url.protocol +
        '//' +
        makePath(url.host + url.pathname, apiConfig.prefix);
    } catch (error) {
      const url = new URL(window.location.href);
      apiConfig.host =
        url.protocol +
        '//' +
        makePath(url.host + apiConfig.host, apiConfig.prefix);
    }
  }

  if (apiConfig?.host) {
    try {
      const url = new URL(apiConfig.host);
      apiConfig.host = url.protocol + '//' + url.host + url.pathname;
    } catch (error) {
      const url = new URL(window.location.href);
      apiConfig.host = url.protocol + '//' + url.host + apiConfig.host;
    }
  }

  const client = apiConfig?.host
    ? new ApiClient(apiConfig.host)
    : new ApiClient(config.api.default.host as string);

  if (apiConfig) {
    if (apiConfig.headers) {
      client.withHeader(apiConfig.headers);
    }
    if (apiConfig.token) {
      client.withToken(
        apiConfig.token.token as string,
        apiConfig.token.tokenType as string,
      );
    }
  }

  return client;
};

function makeClient<T extends BaseClient>(
  client: ClientType<T>,
  token?: Token | null,
): T {
  let withToken: Token | undefined;
  if (token) {
    withToken = {
      token: token.token,
      tokenType: token.tokenType || null,
    };
  }

  return new client(
    api({
      prefix: client.prefix,
      token: withToken,
    }),
  );
}

export default makeClient;