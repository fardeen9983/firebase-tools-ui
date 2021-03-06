/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createContext, useContext } from 'react';

import DatabaseApi from './api';

const ApiContext = createContext<DatabaseApi | null>(null);

export const ApiProvider = ApiContext.Provider;
export const useApi = () => {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error('You are missing a <ApiProvider>.');
  }
  return api;
};

// TODO: need a better strategy to handle missing API in RTDB-documentEditor
export const useOptionalApi = () => {
  return useContext(ApiContext);
};
