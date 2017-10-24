import React from 'react';
import ElementPortal from './ElementPortal';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const withElementPortal = (portalProps) => (component) => {
  const WithElementPortal = (props) => (
    <ElementPortal
      {...portalProps}
      component={(mappedProps) => (
        React.createElement(component, {...props, ...mappedProps})
      )}
    />
  );

  WithElementPortal.displayName = `WithElementPortal(${getDisplayName(component)})`;
  return WithElementPortal;
};

export default withElementPortal;
