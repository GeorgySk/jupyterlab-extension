import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { TextField } from '../../components/TextField';

const useStyles = createUseStyles({
  control: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    padding: '4px 16px 0 16px'
  },
  where: {
    marginRight: '5pt'
  },
  logic: {
    display: 'flex',
    alignSelf: 'stretch'
  },
  key: {
    flex: 1,
    minWidth: 0
  },
  operator: {
    display: 'flex',
    alignSelf: 'stretch'
  },
  value: {
    marginRight: '4px',
    flex: 1,
    minWidth: 0
  },
  deleteButton: {
    fontSize: '13pt',
    cursor: 'pointer',
    opacity: 0.5,
    '&:hover': {
      opacity: 1
    }
  },
  deleteIcon: {
    fontSize: '13pt',
    cursor: 'pointer',
    opacity: 0.5,
    '&:hover': {
      opacity: 1
    }
  },
})

const operators = ["=", "≠", "<", ">", "≤", "≥"];

export interface MetadataFilter {
  logic: string;
  key: string;
  operator: string;
  value: string;
}

export interface MetadataFilterItemProps {
  filter: MetadataFilter;
  showBoolOperatorDropdown: boolean;
  onDelete: () => any;
  onChange: (updatedFilter: MetadataFilter) => any;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => any;
}

export const MetadataFilterItem: React.FC<MetadataFilterItemProps> = ({
  filter,
  showBoolOperatorDropdown,
  onDelete,
  onChange,
  onKeyPress
}) => {
  const classes = useStyles();

  const handleLogicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filter, logic: e.target.value });
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filter, key: e.target.value });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filter, operator: e.target.value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filter, value: e.target.value });
  };

  return (
    <div className={classes.control}>
      {showBoolOperatorDropdown ? (
        <div className={classes.where}>
          <div>Where</div>
        </div>
      ) : (
        <div className={classes.logic}>
          <select value={filter.logic} onChange={handleLogicChange}>
            <option value="And">And</option>
            <option value="Or">Or</option>
          </select>
        </div>
      )}
      <div className={classes.key}>
        <TextField
          placeholder="Key"
          value={filter.key}
          onChange={handleKeyChange}
          onKeyPress={onKeyPress}
        />
      </div>
      <div className={classes.operator}>
        <select value={filter.operator} onChange={handleOperatorChange}>
          {operators.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.value}>
        <TextField
          placeholder="Value"
          value={filter.value}
          onChange={handleValueChange}
          onKeyPress={onKeyPress}
        />
      </div>
      <div className={classes.deleteButton} onClick={onDelete}>
        <i className={`${classes.deleteIcon} material-icons`}>delete</i>
      </div>
    </div>
  );
};
