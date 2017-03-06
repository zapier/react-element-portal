import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';

const reDataAttr = /^data\-(.+)$/;

export const getNodeData = (node) => {
  // fallback
  if (!node.datset) {
    const result = {};
    const attributes = node.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const match = attr.name.match(reDataAttr);
      if (match) {
        const key = match[1];
        result[key] = attr.value;
      }
    }
    return result;
  }

  return Object.keys(node.dataset)
    .reduce((result, key) => {
      result[key] = node.dataset[key];
      return result;
    }, {});
};

const createElementPortal = (Provider, contextKeys) => {

  invariant(
    Provider && contextKeys || (!Provider && !contextKeys),
    'createElementPortal requires 0 or 2 arguments'
  );

  invariant(
    !Provider || typeof Provider === 'function',
    'createElementPortal requires a React component class/function as the first argument'
  );

  invariant(
    !contextKeys || (typeof contextKeys === 'string' || Array.isArray('array')),
    'createElementPortal requires a context key or array of keys as the second argument'
  );

  contextKeys = (contextKeys && (
    Array.isArray(contextKeys) ? contextKeys : [contextKeys]
  )) || undefined;

  const contextTypes = contextKeys && contextKeys.reduce((obj, key) => {
    obj[key] = React.PropTypes.any.isRequired;
    return obj;
  }, {});

  const ElementPortal = React.createClass({

    contextTypes,

    propTypes: {
      id: PropTypes.string,
      selector: PropTypes.string,
      // Remove styles and classes from node.
      shouldReset: PropTypes.bool,
      view: PropTypes.func
    },

    componentDidMount() {
      this.renderToNodes();
    },

    componentDidUpdate() {
      this.renderToNodes();
    },

    renderToNodes() {
      const nodeById = this.props.id && document.getElementById(this.props.id);
      const nodesById = nodeById ? [nodeById] : [];
      const nodesBySelector = (this.props.selector && [].slice.call(document.querySelectorAll(this.props.selector))) || [];
      const nodes = nodesById.concat(nodesBySelector);

      nodes.forEach(node => {
        if (this.props.shouldReset) {
          node.className = '';
          node.removeAttribute('style');
        }

        const View = this.props.view;

        const children = View ?
          <View domNode={node} data={getNodeData(node)}/> :
          React.Children.only(this.props.children);

        ReactDOM.render(
          Provider ? (
            <Provider {...this.context}>
            {
              children
            }
            </Provider>
          ) : children,
          node
        );
      });
    },

    render() {
      return null;
    }
  });

  return ElementPortal;
};

export default createElementPortal;
