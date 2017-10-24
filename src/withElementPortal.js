import React from 'react';
import ElementPortal from './ElementPortal';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const withElementPortal = (Child) => {
  const Portal = ({ selector, resetStyle, mapNodeToProps, ...childProps }) => {
    const ChildWrapper = (props) => <Child {...childProps} {...props} />;
    return <ElementPortal
      selector={selector}
      component={ChildWrapper}
      mapNodeToProps={mapNodeToProps}
      resetStyle={resetStyle}
    />;
  };

  Portal.displayName = `WithElementPortal(${getDisplayName(Child)})`;

  return Portal;
};

export default withElementPortal;
