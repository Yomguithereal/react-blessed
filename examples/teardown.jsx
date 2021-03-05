import {once} from 'events';

import blessed from 'blessed';
import React from 'react';
import {render} from '../src';

async function main() {
  const screen = blessed.screen({
    smartCSR: true
  });

  render(
    <React.Fragment>
      <blessed-box
        label="demo destroy without unmount"
        width="50%"
        left="center"
        height="0%+5"
        border={{type: 'line'}}>
        <blessed-box>press q to try to exit</blessed-box>
        <blessed-box top="0%+2">
          <Ticker ms={1000} />
        </blessed-box>
      </blessed-box>
    </React.Fragment>,
    screen
  );

  screen.key(['escape', 'q', 'C-c'], () => screen.destroy());

  await once(screen, 'destroy');

  console.error("look out for zombies; press Ctrl-C when you've seen enough");
}

function Ticker(props) {
  const tick = useTicker(props.ms);

  return <blessed-text>{`tick: ${tick}`}</blessed-text>;
}

function useTicker(ms) {
  const [tick, set_tick] = React.useState(0);
  React.useEffect(() => {
    console.error('ticker starting');
    const timer = setTimeout(tick, ms);
    return () => {
      console.error('ticker ending');
      clearTimeout(timer);
    };
    function tick() {
      console.error('ticker ticking');
      timer.refresh();
      set_tick(tick => tick + 1);
    }
  }, []);
  return tick;
}

main().then(null, err => {
  console.error(err.stack || err);
  process.exit(1);
});
