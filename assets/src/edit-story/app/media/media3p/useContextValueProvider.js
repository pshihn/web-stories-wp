/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import useProviderContextValueProvider from './useProviderContextValueProvider';

// TODO(https://github.com/google/web-stories-wp/issues/2804):
// Use provider configuration json fragment.
const providers = ['unsplash'];

function useProviderSetContextValueProvider(reducerState, reducerActions) {
  const result = {};

  // The 'providers' list is a constant, and so hooks are still called in the
  // same order during a re-render as per rules-of-hooks.
  for (const provider of providers) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[provider] = useProviderContextValueProvider(
      provider,
      reducerState,
      reducerActions
    );
  }
  return result;
}

export default function useContextValueProvider(reducerState, reducerActions) {
  return {
    state: {
      selectedProvider: reducerState.selectedProvider,
    },
    actions: {
      setSelectedProvider: reducerActions.setSelectedProvider,
    },
    ...useProviderSetContextValueProvider(reducerState, reducerActions),
  };
}
