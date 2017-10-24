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
    shouldReset: PropTypes.bool,
    component: PropTypes.func
  },

  componentDidMount() {
    this.renderToNodes();
  },

  componentDidUpdate() {
    this.renderToNodes();
  },

  renderToNodes() {
    const mapDomNodeToProps = this.props.mapDomNodeToProps || noop;
    const nodes = (this.props.selector && [].slice.call(document.querySelectorAll(this.props.selector))) || [];
    const { component } = this.props;

    nodes.forEach(node => {
      if (this.props.shouldReset) {
        node.className = '';
        node.removeAttribute('style');
      }

      const children = component
        ? React.createElement(component, mapDomNodeToProps(node))
        : React.Children.only(this.props.children);

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
