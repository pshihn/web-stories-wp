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
import {
  createContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

export const ToasterContext = createContext(null);

const AUTO_REMOVE_TOAST_TIME_INTERVAL = 10000;

const ToastProvider = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState([]);
  const [inactiveToasts, setInactiveToasts] = useState([]);
  const [allToasts, setAllToasts] = useState([]);

  const resetToastHistory = useCallback(() => {
    setAllToasts([]);
  }, [setAllToasts]);

  const removeToast = useCallback(
    (index = 0) => {
      const activeToastsCopy = JSON.parse(JSON.stringify(activeToasts));
      const newlyInactiveToast = activeToastsCopy.splice(index, 1);
      setActiveToasts(activeToastsCopy);
      setInactiveToasts([
        ...new Set([...inactiveToasts, ...newlyInactiveToast]),
      ]);
    },
    [activeToasts, inactiveToasts]
  );

  const addToast = useCallback(
    ({ message, severity, errorId }) => {
      const newToast =
        allToasts.length === 0
          ? true
          : allToasts.reduce((_, toast) => {
              return toast?.errorId !== errorId;
            }, []);

      if (newToast) {
        setActiveToasts([
          ...new Set([...activeToasts, { message, severity, errorId }]),
        ]);
        setAllToasts([
          ...new Set([...allToasts, { message, severity, errorId }]),
        ]);
      }
    },
    [allToasts, activeToasts]
  );

  useEffect(() => {
    let deleteToastInterval;
    if (activeToasts.length > 0) {
      deleteToastInterval = setInterval(
        removeToast,
        AUTO_REMOVE_TOAST_TIME_INTERVAL
      );
    }

    return () => deleteToastInterval && clearInterval(deleteToastInterval);
  }, [activeToasts.length, inactiveToasts.length, removeToast]);

  useEffect(() => {
    return () => {
      resetToastHistory();
    };
  }, [resetToastHistory]);

  const value = useMemo(
    () => ({
      state: { allToasts, activeToasts, inactiveToasts },
      actions: { removeToast, addToast, resetToastHistory },
    }),
    [
      allToasts,
      activeToasts,
      inactiveToasts,
      removeToast,
      addToast,
      resetToastHistory,
    ]
  );

  return (
    <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node,
};

export default ToastProvider;
