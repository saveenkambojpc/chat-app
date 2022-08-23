import React from 'react';
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';

const ConditionalBadge = ({condition, children}) => {
  return condition ? (
    <Badge content={condition}>{children}</Badge>
  ) : (
    { children }
  );
};

const IconBtnControl = ({
  isVisible,
  iconName,
  tooltip,
  onClick,
  badgeContent,
  ...props
}) => {
  return (
    <div
      className="mb-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <ConditionalBadge condition={badgeContent}>
        <Whisper
          placement="top"
          delay={0}
          delayHide={0}
          trigger="hover"
          speaker={<Tooltip>{tooltip}</Tooltip>}
        >
          <IconButton
            {...props}
            onClick={onclick}
            circle
            size="xs"
            icon={<Icon icon={iconName}></Icon>}
          ></IconButton>
        </Whisper>
      </ConditionalBadge>
    </div>
  );
};

export default IconBtnControl;
