import test from 'ava';
import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose, createStore } from 'redux';

import 'babel-core/register';

import uniqueId from './helpers/uniqueId';
import ElementPortal, { withElementPortal } from '../src';

test('can render to ElementPortal using id selector', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal selector={`#${headerId}`}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
});

test('can render to ElementPortal using class selector', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting"></li>
      <li class="greeting"></li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal selector="li.greeting">
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  elements.forEach(liNode => {
    t.is(liNode.textContent, 'Hello');
  });
});

test('can render to ElementPortal using selector with custom component', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting"></li>
      <li class="greeting"></li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal selector="li.greeting" component={Greeting}/>
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  t.is(elements[0].textContent, 'Hello');
  t.is(elements[1].textContent, 'Hello');
});

test('can render to ElementPortal using nodes', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal nodes={document.getElementById(headerId)}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
});

test('can render to ElementPortal using nodes', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting"></li>
      <li class="greeting"></li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  render(
    <div>
      <ElementPortal nodes={elements}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  elements.forEach(liNode => {
    t.is(liNode.textContent, 'Hello');
  });
});

test('can render to ElementPortal using nodes as a NodeList', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting"></li>
      <li class="greeting"></li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal nodes={node.querySelectorAll('li.greeting')}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  elements.forEach(liNode => {
    t.is(liNode.textContent, 'Hello');
  });
});

test('can render to ElementPortal using nodes with custom component', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting"></li>
      <li class="greeting"></li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  render(
    <div>
      <ElementPortal nodes={elements} component={Greeting}/>
    </div>,
    document.getElementById(appId)
  );
  t.is(elements[0].textContent, 'Hello');
  t.is(elements[1].textContent, 'Hello');
});

test('map dom node to props', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting" data-new="true">Joe</li>
      <li class="greeting">Mary</li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const mapNodeToProps = (domNode) => ({
    name: domNode.textContent,
    isNew: !!domNode.getAttribute('data-new')
  });
  const Greeting = ({ name, isNew }) => (<div>Hello {isNew && 'and welcome '}{name}</div>);
  render(
    <div>
      <ElementPortal selector="li.greeting" component={Greeting} mapNodeToProps={mapNodeToProps} />
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  t.is(elements[0].textContent, 'Hello and welcome Joe');
  t.is(elements[1].textContent, 'Hello Mary');
});

test('erases classes and styles', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}" class="foo" style="color:red">
    </div>
    <div id="${appId}">
    </div>
  `;
  t.is(document.getElementById(headerId).classList.length, 1);
  t.is(document.getElementById(headerId).getAttribute('style'), 'color:red');
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal selector={`#${headerId}`} resetAttributes={['class', 'style']}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
  t.is(document.getElementById(headerId).classList.length, 0);
  t.is(document.getElementById(headerId).getAttribute('style'), null);
});

test('erases all attributes', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}" class="foo" data-bar="baz" qux>
    </div>
    <div id="${appId}">
    </div>
  `;
  const headerElement = document.getElementById(headerId);
  t.is(headerElement.classList.length, 1);
  t.is(headerElement.getAttribute('data-bar'), 'baz');
  t.is(headerElement.getAttribute('quz'), null);
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal selector={`#${headerId}`} resetAttributes={true}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(headerElement.textContent, 'Hello');
  t.is(headerElement.classList.length, 0);
  t.is(headerElement.getAttribute('data-bar'), null);
  t.is(headerElement.getAttribute('qux'), null);
});

test('transfers context to the portal', t => {
  const store = createStore((state = 0, action) => {
    if (action && action.type === 'INC') {
      return state + 1;
    }
    return state;
  });
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Count = ({state}) => (<div>{state}</div>);
  const CountContainer = connect(
    state => ({state})
  )(Count);
  render(
    <Provider store={store}>
      <div>
        <ElementPortal selector={`#${headerId}`}>
          <CountContainer/>
        </ElementPortal>
      </div>
    </Provider>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, '0');
  store.dispatch({type: 'INC'});
  t.is(document.getElementById(headerId).textContent, '1');
});

test('can be used as higher-order component', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  const GreetingWithPortal = withElementPortal({
    selector: `#${headerId}`
  })(Greeting);

  render(
    <div>
      <GreetingWithPortal />
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
});

test('can be composed with other HOC\'s', t => {
  const store = createStore((state = { name: 'world' }) => {
    return state;
  });
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;

  const MyComponent = (props) => <h1>Hello, {props.name}!</h1>;

  const MyComposedComponent = compose(
    withElementPortal({ selector: `#${headerId}` }),
    connect((state) => ({ name: state.name }))
  )(MyComponent);

  render(
    <Provider store={store}>
      <MyComposedComponent />
    </Provider>,
    document.getElementById(appId)
  );

  t.is(document.getElementById(headerId).textContent, 'Hello, world!');
});

test('map dom node to props when used as HOC', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}" data-new="true">Joe</div>
    <div id="${appId}">Mary</div>
  `;
  const Greeting = ({ name, isNew }) => (<div>Hello {isNew && 'and welcome '}{name}</div>);
  const GreetingWithPortal = withElementPortal({
    selector: `#${headerId}`,
    mapNodeToProps: (domNode) => ({
      name: domNode.textContent,
      isNew: !!domNode.getAttribute('data-new')
    })
  })(Greeting);

  render(
    <div>
      <GreetingWithPortal />
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello and welcome Joe');
});

test('passes props through to the inner component when used as a HOC', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = ({name}) => (<div>Hello {name}</div>);
  const GreetingWithPortal = withElementPortal({
    selector: `#${headerId}`
  })(Greeting);

  render(
    <div>
      <GreetingWithPortal name="Joe" />
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello Joe');
});
