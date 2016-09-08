import React from 'react';
import {HomeView} from 'routes/Home/components/HomeView';
import {render} from 'enzyme';

describe('(View) Home', () => {
  let _component;

  beforeEach(() => {
    _component = render(<HomeView/>);
  });

  it('Renders a "EasyHi - Vue" text', () => {
    const EasyHi = _component.find('.css h2');
    expect(EasyHi).to.exist;
    expect(EasyHi.text()).to.match(/EasyHi - Vue/);
  });

  it('Renders four links', () => {
    const links = _component.find('nav a');
    expect(links).to.exist;
    expect(links.length).to.equals(4);
  });
});
