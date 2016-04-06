import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
let Provider;
try {
  const ReactRedux = require('react-redux');
  Provider = ReactRedux.Provider;
} catch (e) {
  // Not using Redux I guess.
}

const ElementPortal = React.createClass({

  contextTypes: {
    store: React.PropTypes.object
  },

  propTypes: {
    id: PropTypes.string.isRequired,
    // Remove styles and classes from node.
    shouldReset: PropTypes.bool
  },

  componentDidMount() {
    this.renderToNode();
  },

  componentDidUpdate() {
    this.renderToNode();
  },

  renderToNode() {
    const node = document.getElementById(this.props.id);
    if (node) {
      if (this.props.shouldReset) {
        node.className = '';
        node.removeAttribute('style');
      }
      const child = (this.context.store && Provider) ? (
        <Provider store={this.context.store}>
          {React.Children.only(this.props.children)}
        </Provider>
      ) : (
        React.Children.only(this.props.children)
      );
      ReactDOM.render(
        child,
        node
      );
    }
  },

  render() {
    return null;
  }
});

export default ElementPortal;
