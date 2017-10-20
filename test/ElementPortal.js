import test from 'ava';
import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose, createStore } from 'redux';

import 'babel-core/register';

import uniqueId from './helpers/uniqueId';
import ElementPortal, { withElementPortal } from '../src';

test('can render to ElementPortal using element id', t => {
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
      <ElementPortal id={headerId}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
});

test('can render to ElementPortal using selector', t => {
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
      <li class="greeting">Joe</li>
      <li class="greeting">Mary</li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = ({domNode}) => (<div>Hello {domNode.textContent}</div>);
  render(
    <div>
      <ElementPortal selector="li.greeting" view={Greeting}/>
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  t.is(elements[0].textContent, 'Hello Joe');
  t.is(elements[1].textContent, 'Hello Mary');
});

test('can pass along data attributes', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}" data-name="Joe">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = ({data}) => (<div>Hello {data.name}</div>);
  render(
    <div>
      <ElementPortal id={headerId} view={Greeting}/>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello Joe');
  // Another render should get same data.
  render(
    <div>
      <ElementPortal id={headerId} view={Greeting}/>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello Joe');
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
      <ElementPortal id={headerId} shouldReset>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
  t.is(document.getElementById(headerId).classList.length, 0);
  t.is(document.getElementById(headerId).getAttribute('style'), null);
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
        <ElementPortal id={headerId}>
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
  const GreetingWithPortal = withElementPortal(Greeting);

  render(
    <div>
      <GreetingWithPortal id={headerId} />
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
    withElementPortal,
    connect((state) => ({ name: state.name }))
  )(MyComponent);

  render(
    <Provider store={store}>
      <MyComposedComponent id={headerId} />
    </Provider>,
    document.getElementById(appId)
  );

  t.is(document.getElementById(headerId).textContent, 'Hello, world!');
});

test('passes along data attributes when used as HOC', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}" data-name="Joe">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = ({data}) => (<div>Hello {data.name}</div>);
  const GreetingWithPortal = withElementPortal(Greeting);

  render(
    <div>
      <GreetingWithPortal id={headerId} />
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello Joe');
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
  const GreetingWithPortal = withElementPortal(Greeting);

  render(
    <div>
      <GreetingWithPortal id={headerId} name="Joe" />
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello Joe');
});
