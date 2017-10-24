import React from 'react';
import ElementPortal from './ElementPortal';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const withElementPortal = (Child) => {
  const Portal = ({ selector, resetStyle, mapDomNodeToProps, ...childProps }) => {
    const ChildWrapper = (props) => <Child {...childProps} {...props} />;
    return <ElementPortal
      selector={selector}
      component={ChildWrapper}
      mapDomNodeToProps={mapDomNodeToProps}
      resetStyle={resetStyle}
    />;
  };

  Portal.displayName = `WithElementPortal(${getDisplayName(Child)})`;

  return Portal;
};

export default withElementPortal;
