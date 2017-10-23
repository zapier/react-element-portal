import React from 'react';
import ElementPortal from './ElementPortal';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const withElementPortal = (Child) => {
  const Portal = ({ id, selector, shouldReset, mapDomNodeToProps, ...childProps }) => {
    const ChildWrapper = (props) => <Child {...childProps} {...props} />;
    return <ElementPortal
      id={id}
      selector={selector}
      mapDomNodeToProps={mapDomNodeToProps}
      shouldReset={shouldReset}
      view={ChildWrapper}
    />;
  };

  Portal.displayName = `WithElementPortal(${getDisplayName(Child)})`;

  return Portal;
};

export default withElementPortal;
