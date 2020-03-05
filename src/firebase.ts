/**
 * Copyright 2020 Google LLC
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

import 'firebase/database';
import 'firebase/firestore';

import { _FirebaseApp } from '@firebase/app-types/private';
import { FirebaseAuthInternal } from '@firebase/auth-interop-types';
import { Component, ComponentType } from '@firebase/component';
import * as firebase from 'firebase/app';

import { DatabaseConfig, FirestoreConfig } from './store/config';

export function initDatabase(
  config: DatabaseConfig,
  namespace: string
): [firebase.database.Database, { cleanup: () => void }] {
  const databaseURL = `http://${config.hostAndPort}/?ns=${namespace}`;
  const app = firebase.initializeApp(
    { databaseURL },
    `Database Component: ${databaseURL} ${Math.random()}`
  );
  applyAdminAuth(app);
  return [app.database(), { cleanup: () => app.delete() }];
}

export function initFirestore(
  projectId: string,
  config: FirestoreConfig
): [firebase.firestore.Firestore, { cleanup: () => Promise<void> }] {
  const app = firebase.initializeApp(
    { projectId },
    `Firestore Component: ${Math.random()}`
  );
  applyAdminAuth(app);
  const firestore = app.firestore();
  firestore.settings({
    host: config.hostAndPort,
    ssl: false,
  });
  return [firestore, { cleanup: () => app.delete() }];
}

function applyAdminAuth(app: firebase.app.App): void {
  const accessToken = 'owner'; // Accepted as admin by emulators.
  const mockAuthComponent = new Component(
    'auth-internal',
    () =>
      ({
        getToken: async () => ({ accessToken: accessToken }),
        getUid: () => null,
        addAuthTokenListener: listener => {
          // Call listener once immediately with predefined
          // accessToken.
          listener(accessToken);
        },
        removeAuthTokenListener: () => {},
      } as FirebaseAuthInternal),
    'PRIVATE' as ComponentType
  );

  ((app as unknown) as _FirebaseApp)._addOrOverwriteComponent(
    mockAuthComponent
  );
}