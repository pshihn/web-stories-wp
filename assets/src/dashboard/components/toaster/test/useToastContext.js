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
 * External dependencies
 */
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import ToastProvider from '../provider';
import useToastContext from '../useToastContext';
import { ALERT_SEVERITY } from '../../../constants';

const ACTIVE_TOAST = {
  message: 'active toast',
  severity: ALERT_SEVERITY.ERROR,
  errorId: 1234,
};

const INACTIVE_TOAST = {
  message: 'inactive toast',
  errorId: 4567,
  severity: ALERT_SEVERITY.ERROR,
};

describe('useToastContext', () => {
  it('should throw an error if used outside of Toast.Provider', () => {
    expect(() => {
      const {
        // eslint-disable-next-line no-unused-vars
        result: { current },
      } = renderHook(() => useToastContext());
    }).toThrow(
      Error('useToasterContext() must be used within a <Toast.Provider />')
    );
  });

  it('should not throw an error if used inside ToastProvider', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });
    expect(result.current.error).toBeUndefined();
  });

  it('should have default state initially set up', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });

    expect(result.current.state.activeToasts).toStrictEqual([]);
  });

  it('should add a new activeAlert when addToast is called and new toast has unique id', () => {
    const { result } = renderHook(() => useToastContext(), {
      wrapper: ToastProvider,
    });

    result.current.actions.addToast(ACTIVE_TOAST);

    expect(result.current.state.activeToasts).toStrictEqual([ACTIVE_TOAST]);
  });

  it('should not add a duplicate activeAlert when addToast is called with existing toast id', () => {
    const { result } = renderHook(
      () => useToastContext({ activeToasts: [ACTIVE_TOAST] }),
      {
        wrapper: ToastProvider,
      }
    );

    result.current.actions.addToast(ACTIVE_TOAST);

    expect(result.current.state.activeToasts).toStrictEqual([ACTIVE_TOAST]);
  });

  it('should move an activeAlert to an inactiveAlert when removeToast is called', () => {
    const { result } = renderHook(
      () =>
        useToastContext({
          activeToasts: [ACTIVE_TOAST, INACTIVE_TOAST],
          inactiveToasts: [],
          allToasts: [ACTIVE_TOAST, INACTIVE_TOAST],
        }),
      {
        wrapper: ToastProvider,
      }
    );

    act(() => {
      result.current.actions.removeToast(1);
    });
    expect(result.current.state.activeToasts).toStrictEqual([ACTIVE_TOAST]);
    expect(result.current.state.inactiveToasts).toStrictEqual([INACTIVE_TOAST]);
  });

  it('should reset allAlerts when resetToastHistory is called', () => {
    const { result } = renderHook(
      () =>
        useToastContext({
          activeToasts: [ACTIVE_TOAST],
          inactiveToasts: [INACTIVE_TOAST],
          allToasts: [ACTIVE_TOAST, INACTIVE_TOAST],
        }),
      {
        wrapper: ToastProvider,
      }
    );

    result.current.actions.resetToastHistory();

    expect(result.current.state.allToasts).toStrictEqual([]);
    expect(result.current.state.activeToasts).toStrictEqual([]);
    expect(result.current.state.inactiveToasts).toStrictEqual([]);
  });
});
