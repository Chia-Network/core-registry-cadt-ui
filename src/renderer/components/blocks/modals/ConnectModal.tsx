import React, { useState } from 'react';
import { ConnectForm, Modal } from '@/components';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setHost } from '@/store/slices/app';
import { useGetHealthImmediateMutation } from '@/api/cadt/v1/system';
import { useUrlHash } from '@/hooks';

// @ts-ignore
import { BaseQueryResult, FetchBaseQueryError, SerializedError } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { RootState } from '@/store';

interface ConnectModalProps {
  onClose: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ onClose }: ConnectModalProps) => {
  const dispatch = useDispatch();
  const appStore = useSelector((state: RootState) => state.app);
  const [getHealth] = useGetHealthImmediateMutation();
  const [serverNotFound, setServerNotFound] = useState(false);
  const [, setActive] = useUrlHash('connect');

  const handleSubmit = async (apiHost: string, apiKey?: string) => {
    const response: BaseQueryResult | FetchBaseQueryError | SerializedError = await getHealth({ apiHost, apiKey });

    if (!response?.data) {
      setServerNotFound(true);
      return;
    }

    dispatch(setHost({ apiHost, apiKey }));
    setActive(false);
    setTimeout(() => window.location.reload(), 0);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header>
        <FormattedMessage id="connect-to-remote-server" />
      </Modal.Header>
      <Modal.Body>
        {appStore?.isCoreRegistryUiApp ? (
          <div>
            <p>
              <FormattedMessage id="cannot-connect-to-registry-api-with-current-settings" />.
            </p>
            <p>
              <FormattedMessage id="please-disconnect-to-edit-the-api-url-and-api-key" />.
            </p>
          </div>
        ) : (
          <ConnectForm
            onSubmit={handleSubmit}
            hasServerError={serverNotFound}
            onClearError={() => setServerNotFound(false)}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export { ConnectModal };
