import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

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

const ElementPortal = React.createClass({

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

      // This will become `ReactDOM.unstable_createPortal()` once the new Fiber implementation lands in React:
      // https://github.com/facebook/react/pull/8386
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        node
      );
    });
  },

  render() {
    return null;
  }
});

export default ElementPortal;
