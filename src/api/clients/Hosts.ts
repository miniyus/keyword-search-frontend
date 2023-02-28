import BaseClient from 'api/base/BaseClient';
import { ErrorResInterface } from 'api/base/ApiClient';
import { Host } from 'api/interfaces/Hosts';
import { toCamel, toSnake } from 'snake-camel';
import { Page } from 'api/interfaces/Common';
import { Search } from 'api/interfaces/Search';

export interface GetListParam extends Page {
  page: number;
  pageSize: number;
}

export interface GetList {
  page: number;
  pageSize: number;
  totalCount: number;
  data: Host[];
}

export interface GetSubjects {
  page: number;
  pageSize: number;
  totalCount: number;
  data: { id: number; subject: string }[];
}

export interface GetSearch {
  page: number;
  pageSize: number;
  totalCount: number;
  data: Search[];
}

export interface GetSearchDescriptions {
  page: number;
  pageSize: number;
  totalCount: number;
  data: { id: number; description: string; shortUrl: string }[];
}

export interface CreateHost {
  host: string;
  path: string;
  description: string;
  publish: boolean;
  subject: string;
}

export interface UpdateHost extends CreateHost {
  host: string;
}

export interface PatchHost {
  host?: string;
  subject?: string;
  description?: string;
  path?: string;
  publish?: boolean;
}

class HostClient extends BaseClient {
  static readonly prefix: string = '/api/hosts';

  public create = async (
    params: CreateHost,
  ): Promise<Host | ErrorResInterface | null> => {
    const res = await this._client.post('/', toSnake(params));
    if (res.isSuccess) {
      const data = toCamel(res.res?.data) as any;
      return toCamel(data) as Host;
    }

    return res.error;
  };

  public find = async (
    id: number,
  ): Promise<Host | ErrorResInterface | null> => {
    const res = await this._client.get(`/${id}`);
    if (res.isSuccess) {
      return toCamel(res.res?.data) as Host;
    }

    return res.error;
  };

  public getSubjects = async (
    params: GetListParam,
  ): Promise<GetSubjects | ErrorResInterface | null> => {
    const result = await this._client.get('/subjects', toSnake(params));
    if (result.isSuccess) {
      const data = toCamel(result.res?.data) as any;
      return {
        page: data.page,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        data: data.data.map(toCamel) as { id: number; subject: string }[],
      };
    }

    return result.error;
  };

  public getList = async (
    params: GetListParam,
  ): Promise<GetList | ErrorResInterface | null> => {
    const result = await this._client.get('/', toSnake(params));
    if (result.isSuccess) {
      const data = toCamel(result.res?.data) as any;
      return {
        page: data.page,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        data: data.data.map(toCamel) as Host[],
      };
    }

    return result.error;
  };

  public getSearch = async (
    id: number,
    page: Page,
  ): Promise<GetSearch | ErrorResInterface | null> => {
    const res = await this._client.get(`/${id}/search`, toSnake(page));
    if (res.isSuccess) {
      const data = toCamel(res.res?.data) as any;
      return {
        page: data.page,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        data: data.data.map(toCamel) as Search[],
      };
    }

    return res.error;
  };

  public getSearchDescriptions = async (
    id: number,
    page: Page,
  ): Promise<GetSearchDescriptions | ErrorResInterface | null> => {
    const res = await this._client.get(
      `/${id}/search/descriptions`,
      toSnake(page),
    );
    if (res.isSuccess) {
      const data = toCamel(res.res?.data) as any;
      return {
        page: data.page,
        pageSize: data.pageSize,
        totalCount: data.totalCount,
        data: data.data.map(toCamel) as {
          id: number;
          description: string;
          shortUrl: string;
        }[],
      };
    }

    return res.error;
  };

  public update = async (
    id: number,
    params: UpdateHost,
  ): Promise<Host | ErrorResInterface | null> => {
    const res = await this._client.put(`/${id}`, toSnake(params));
    if (res.isSuccess) {
      return toCamel(res.res?.data) as Host;
    }
    return res.error;
  };

  public patch = async (id: number, params: PatchHost) => {
    const res = await this._client.patch(`/${id}`, toSnake(params));
    if (res.isSuccess) {
      return toCamel(res.res?.data) as Host;
    }
    return res.error;
  };

  public delete = async (
    id: number,
  ): Promise<boolean | ErrorResInterface | null> => {
    const res = await this._client.delete(`/${id}`);
    return res.isSuccess ? res.isSuccess : res.error;
  };
}

export default HostClient;