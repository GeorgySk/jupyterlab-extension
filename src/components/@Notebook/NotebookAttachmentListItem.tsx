import React, { useEffect, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { useStoreState } from 'pullstate';
import { NotebookDIDAttachment, FileStatus, ContainerStatus } from '../../types';
import { Spinning } from '../Spinning';
import { WithRequestAPIProps, withRequestAPI } from '../../utils/Actions';
import { UIStore } from '../../stores/UIStore';
import { computeContainerState } from '../../utils/Helpers';
import { ExtensionStore } from '../../stores/ExtensionStore';

const useStyles = createUseStyles({
  listItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #E0E0E0',
    padding: '8px 16px 8px 16px',
    fontSize: '9pt'
  },
  listItemIconContainer: {
    paddingRight: '8px'
  },
  listItemContent: {
    flex: 1
  },
  did: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  variableName: {
    color: '#808080'
  },
  statusIcon: {
    marginTop: '2px',
    fontSize: '9pt'
  },
  availableIcon: {
    extend: 'statusIcon',
    color: '#5a9216'
  },
  notAvailableIcon: {
    extend: 'statusIcon',
    color: '#dd2c00'
  },
  replicatingIcon: {
    extend: 'statusIcon',
    color: '#ffa000'
  },
  actionContainer: {},
  clearButton: {
    alignItems: 'center',
    padding: '4px',
    lineHeight: 0,
    cursor: 'pointer'
  },
  clearIcon: {
    color: '#dd2c0090',
    fontSize: '16px',
    lineHeight: '24px',
    '&:hover': {
      color: '#dd2c00'
    }
  }
});

export interface NotebookAttachmentListItemProps {
  attachment: NotebookDIDAttachment;
}

const _NotebookAttachmentListItem: React.FC<NotebookAttachmentListItemProps> = ({ attachment, ...props }) => {
  const classes = useStyles();
  const { actions } = props as WithRequestAPIProps;
  const { did } = attachment;

  const activeInstance = useStoreState(UIStore, s => s.activeInstance);
  const fileDetails = useStoreState(UIStore, s => s.fileDetails[did]);
  const containerDetails = useStoreState(UIStore, s => s.containerDetails[did]);

  useEffect(() => {
    if (attachment.type === 'file') {
      actions.getFileDIDDetails(activeInstance.name, did);
    } else {
      actions.getContainerDIDDetails(activeInstance.name, did);
    }
  }, []);

  const deleteAttachment = () => {
    ExtensionStore.update(s => {
      s.activeNotebookAttachment = s.activeNotebookAttachment.filter(a => a.did !== did);
    });
  };

  const containerState = useMemo(() => {
    return containerDetails ? computeContainerState(containerDetails) : undefined;
  }, [containerDetails]);

  return (
    <div className={classes.listItemContainer}>
      <div className={classes.listItemIconContainer}>
        {!fileDetails && !containerDetails && (
          <Spinning className={`${classes.statusIcon} material-icons`}>hourglass_top</Spinning>
        )}
        {!!fileDetails && <FileStatusIcon status={fileDetails.status} />}
        {!!containerState && <ContainerStatusIcon status={containerState} />}
      </div>
      <div className={classes.listItemContent}>
        <div className={classes.did}>{attachment.did}</div>
        <div className={classes.variableName}>{attachment.variableName}</div>
      </div>
      <div className={classes.actionContainer}>
        <div className={classes.clearButton} onClick={deleteAttachment}>
          <i className={`${classes.clearIcon} material-icons`}>clear</i>
        </div>
      </div>
    </div>
  );
};

const FileStatusIcon: React.FC<{ status: FileStatus }> = ({ status }) => {
  const classes = useStyles();

  switch (status) {
    case 'OK':
      return <i className={`${classes.availableIcon} material-icons`}>check_circle</i>;
    case 'REPLICATING':
      return <Spinning className={`${classes.replicatingIcon} material-icons`}>hourglass_top</Spinning>;
    default:
      return <i className={`${classes.notAvailableIcon} material-icons`}>cancel</i>;
  }
};

const ContainerStatusIcon: React.FC<{ status: ContainerStatus }> = ({ status }) => {
  const classes = useStyles();

  switch (status) {
    case 'AVAILABLE':
      return <i className={`${classes.availableIcon} material-icons`}>check_circle</i>;
    case 'REPLICATING':
      return <Spinning className={`${classes.replicatingIcon} material-icons`}>hourglass_top</Spinning>;
    default:
      return <i className={`${classes.notAvailableIcon} material-icons`}>cancel</i>;
  }
};

export const NotebookAttachmentListItem = withRequestAPI(_NotebookAttachmentListItem);