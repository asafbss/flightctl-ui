import * as React from 'react';
import { deleteData, fetchData, patchData, postData, putData } from '../utils/apiCalls';
import { JSONPatch } from '@flightctl/ui-components/src/hooks/useAppContext';

export const useFetch = () => {
  const get = React.useCallback(
    async <R>(kind: string, abortSignal?: AbortSignal): Promise<R> => fetchData(kind, abortSignal),
    [],
  );

  const post = React.useCallback(async <R>(kind: string, obj: R): Promise<R> => postData(kind, obj), []);

  const put = React.useCallback(async <R>(kind: string, obj: R): Promise<R> => putData(kind, obj), []);

  const remove = React.useCallback(
    async <R>(kind: string, abortSignal?: AbortSignal): Promise<R> => deleteData(kind, abortSignal),
    [],
  );

  const patch = React.useCallback(
    async <R>(kind: string, obj: JSONPatch[], abortSignal?: AbortSignal): Promise<R> =>
      patchData(kind, obj, abortSignal),
    [],
  );

  return {
    get,
    post,
    put,
    remove,
    patch,
  };
};
