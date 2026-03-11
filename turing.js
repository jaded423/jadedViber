// Turing Machine Easter Egg
// Type "turing" anywhere on the page to activate
(function () {
  'use strict';

  let buffer = '';
  const TRIGGER = 'turing';
  let widget = null;
  let running = false;
  let interval = null;

  // Simple binary counter: increments a binary number on the tape
  // States: q0 = scan right to find rightmost 1 or blank
  //         q1 = carry (flip 0->1 and halt, or 1->0 and carry left)
  //         q2 = halt
  const TAPE_SIZE = 16;
  const STEP_MS = 400;

  let tape, head, state, stepCount;

  function initMachine() {
    tape = new Array(TAPE_SIZE).fill(0);
    // Start with a small number: 0000000000000101 (5 in binary)
    tape[TAPE_SIZE - 1] = 1;
    tape[TAPE_SIZE - 3] = 1;
    head = TAPE_SIZE - 1;
    state = 'q0';
    stepCount = 0;
  }

  // Transition function for binary increment
  function step() {
    if (state === 'halt') return false;
    stepCount++;

    if (state === 'q0') {
      // Move to rightmost position to start incrementing
      // Already there, switch to increment mode
      state = 'q1';
    }

    if (state === 'q1') {
      if (tape[head] === 0) {
        tape[head] = 1;
        state = 'done'; // finished one increment
      } else {
        tape[head] = 0;
        if (head > 0) {
          head--;
        } else {
          state = 'done'; // overflow, wrap
        }
        return true;
      }
    }

    if (state === 'done') {
      // Reset for next increment cycle
      head = TAPE_SIZE - 1;
      state = 'q0';
    }

    return true;
  }

  function createWidget() {
    if (widget) return;

    widget = document.createElement('div');
    widget.id = 'turing-widget';
    widget.innerHTML = `
      <div class="tw-titlebar">
        <span class="tw-title">TURING MACHINE</span>
        <button class="tw-close" id="tw-close">&times;</button>
      </div>
      <div class="tw-state" id="tw-state">State: q0</div>
      <div class="tw-tape" id="tw-tape"></div>
      <div class="tw-controls">
        <button class="tw-btn" id="tw-play">Play</button>
        <button class="tw-btn" id="tw-pause">Pause</button>
        <button class="tw-btn" id="tw-step">Step</button>
      </div>
      <div class="tw-counter" id="tw-counter">Steps: 0</div>
    `;
    document.body.appendChild(widget);

    // Apply styles
    const style = document.createElement('style');
    style.textContent = `
      #turing-widget {
        position: fixed;
        bottom: -250px;
        right: 20px;
        width: 360px;
        background: #161616;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
        z-index: 9999;
        font-family: 'SF Mono', 'Fira Code', monospace;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
        transition: bottom 0.4s ease;
        overflow: hidden;
      }
      #turing-widget.visible {
        bottom: 20px;
      }
      .tw-titlebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.75rem;
        background: #1e1e1e;
        border-bottom: 1px solid #2a2a2a;
      }
      .tw-title {
        font-size: 0.7rem;
        color: #6272a4;
        letter-spacing: 0.15em;
        font-weight: 700;
      }
      .tw-close {
        background: none;
        border: none;
        color: #6272a4;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 0.2s;
      }
      .tw-close:hover { color: #ff5555; }
      .tw-state {
        text-align: center;
        padding: 0.5rem;
        font-size: 0.75rem;
        color: #bd93f9;
      }
      .tw-tape {
        display: flex;
        justify-content: center;
        padding: 0.5rem;
        gap: 2px;
        overflow-x: auto;
      }
      .tw-cell {
        width: 20px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        color: #f8f8f2;
        background: #0a0a0a;
        border: 1px solid #2a2a2a;
        border-radius: 3px;
        transition: all 0.15s ease;
        flex-shrink: 0;
      }
      .tw-cell.head {
        background: #50fa7b;
        color: #0a0a0a;
        font-weight: 700;
        border-color: #50fa7b;
        box-shadow: 0 0 6px rgba(80, 250, 123, 0.4);
      }
      .tw-cell.changed {
        animation: twFlash 0.3s ease;
      }
      @keyframes twFlash {
        50% { background: #8be9fd; color: #0a0a0a; }
      }
      .tw-controls {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem;
      }
      .tw-btn {
        background: #0a0a0a;
        border: 1px solid #2a2a2a;
        color: #f8f8f2;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tw-btn:hover {
        border-color: #50fa7b;
        color: #50fa7b;
      }
      .tw-counter {
        text-align: center;
        padding: 0.25rem 0.5rem 0.5rem;
        font-size: 0.65rem;
        color: #444;
      }
    `;
    document.head.appendChild(style);

    // Render tape
    renderTape();

    // Slide in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        widget.classList.add('visible');
      });
    });

    // Event listeners
    document.getElementById('tw-close').addEventListener('click', destroyWidget);
    document.getElementById('tw-play').addEventListener('click', play);
    document.getElementById('tw-pause').addEventListener('click', pause);
    document.getElementById('tw-step').addEventListener('click', doStep);
  }

  function renderTape() {
    const container = document.getElementById('tw-tape');
    if (!container) return;
    const prevCells = container.querySelectorAll('.tw-cell');
    const prevValues = [];
    prevCells.forEach(c => prevValues.push(c.textContent));

    container.innerHTML = '';
    tape.forEach((val, i) => {
      const cell = document.createElement('div');
      cell.className = 'tw-cell' + (i === head ? ' head' : '');
      cell.textContent = val;
      if (prevValues[i] !== undefined && prevValues[i] !== String(val)) {
        cell.classList.add('changed');
      }
      container.appendChild(cell);
    });

    const stateEl = document.getElementById('tw-state');
    if (stateEl) stateEl.textContent = 'State: ' + state;

    const counterEl = document.getElementById('tw-counter');
    if (counterEl) counterEl.textContent = 'Steps: ' + stepCount;
  }

  function doStep() {
    step();
    renderTape();
  }

  function play() {
    if (running) return;
    running = true;
    interval = setInterval(() => {
      doStep();
    }, STEP_MS);
  }

  function pause() {
    running = false;
    if (interval) clearInterval(interval);
    interval = null;
  }

  function destroyWidget() {
    pause();
    if (widget) {
      widget.classList.remove('visible');
      setTimeout(() => {
        if (widget && widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
        widget = null;
      }, 400);
    }
  }

  // Listen for keystrokes
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    buffer += e.key.toLowerCase();
    if (buffer.length > TRIGGER.length) {
      buffer = buffer.slice(-TRIGGER.length);
    }

    if (buffer === TRIGGER) {
      buffer = '';
      if (!widget) {
        initMachine();
        createWidget();
      }
    }
  });
})();
