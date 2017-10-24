import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';

const noop = () => {};

const ElementPortal = createReactClass({
  propTypes: {
    id: PropTypes.string,
    selector: PropTypes.string,
    mapDomNodeToProps: PropTypes.func,
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
    const mapDomNodeToProps = this.props.mapDomNodeToProps || noop;
    const nodesBySelector = (this.props.selector && [].slice.call(document.querySelectorAll(this.props.selector))) || [];
    const nodes = nodesById.concat(nodesBySelector);

    nodes.forEach(node => {
      if (this.props.shouldReset) {
        node.className = '';
        node.removeAttribute('style');
      }

      const View = this.props.view;

      const children = View ?
        <View {...mapDomNodeToProps(node)} /> :
        React.Children.only(this.props.children);

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
