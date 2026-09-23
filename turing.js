// Turing tribute — type "turing" anywhere, search it in the palette, or open #turing.
// A 32-cell tape runs a binary-increment machine. The number it holds is not explained.
(function () {
  'use strict';

  const EPOCH_S = 1773162378;   // the moment the tape started counting
  const CELLS = 32;
  const STEP_MS = 110;
  const STEP_FAST_MS = 35;
  const RESYNC_AFTER_S = 15;

  // Rendered once by scripts/turing-portrait.py from turing.jpg (inverted for the dark page, tone-tinted) and frozen here.
  const PORTRAIT = "<span class=\"t1\">::.</span><span class=\"t0\">.....   ....     .                           ...</span><span class=\"t1\">.::::::::::--</span>\n<span class=\"t1\">.:.</span><span class=\"t0\">....     ...            .</span><span class=\"t1\">.::::--::.:</span><span class=\"t0\">..       ....</span><span class=\"t1\">::::::::::::</span>\n<span class=\"t1\">:.</span><span class=\"t0\">.....   ....           </span><span class=\"t1\">-</span><span class=\"t3\">+*****+</span><span class=\"t2\">+===-===+</span><span class=\"t3\">+</span><span class=\"t2\">=</span><span class=\"t0\">.    ..</span><span class=\"t1\">.::::::::::::</span>\n<span class=\"t0\">.</span><span class=\"t1\">.</span><span class=\"t0\">.....   ....         </span><span class=\"t2\">-</span><span class=\"t3\">*#</span><span class=\"t4\">#</span><span class=\"t3\">#****</span><span class=\"t2\">+===</span><span class=\"t3\">++++**#</span><span class=\"t4\">@@</span><span class=\"t3\">+</span><span class=\"t0\">    ..</span><span class=\"t1\">::..:..:::::</span>\n<span class=\"t1\">:</span><span class=\"t0\">.....      ..       </span><span class=\"t2\">=</span><span class=\"t4\">%@%%%%%</span><span class=\"t3\">##*+</span><span class=\"t2\">-</span><span class=\"t1\">-</span><span class=\"t2\">--==</span><span class=\"t3\">+*</span><span class=\"t4\">#%@@@</span><span class=\"t1\">:</span><span class=\"t0\">   ...</span><span class=\"t1\">:::::..:.::</span>\n<span class=\"t0\">.</span><span class=\"t1\">...</span><span class=\"t0\">....    .      </span><span class=\"t2\">-</span><span class=\"t4\">%@@@@@@%%</span><span class=\"t3\">#*+</span><span class=\"t2\">=====+</span><span class=\"t3\">+**</span><span class=\"t4\">#@</span><span class=\"t3\">#</span><span class=\"t2\">=</span><span class=\"t3\">+</span><span class=\"t2\">=</span><span class=\"t1\">:</span><span class=\"t0\">   ...</span><span class=\"t1\">:</span><span class=\"t0\">..</span><span class=\"t1\">..</span><span class=\"t0\">.</span><span class=\"t1\">.</span><span class=\"t0\">.</span><span class=\"t1\">.:</span>\n<span class=\"t1\">....</span><span class=\"t0\">.... ....     </span><span class=\"t1\">:</span><span class=\"t4\">@@@@@@@@@%#</span><span class=\"t3\">*+</span><span class=\"t2\">++=</span><span class=\"t3\">+*</span><span class=\"t4\">%%%@%</span><span class=\"t3\">+</span><span class=\"t1\">-</span><span class=\"t2\">=</span><span class=\"t1\">:-</span><span class=\"t2\">=</span><span class=\"t1\">-</span><span class=\"t0\">  ............</span><span class=\"t1\">:</span>\n<span class=\"t0\">.</span><span class=\"t1\">.</span><span class=\"t0\">..........      </span><span class=\"t2\">=</span><span class=\"t4\">%@@@@@%</span><span class=\"t3\">#*</span><span class=\"t2\">+=-</span><span class=\"t1\">--:</span><span class=\"t0\">...</span><span class=\"t1\">.::</span><span class=\"t0\">   </span><span class=\"t1\">:-::</span><span class=\"t2\">-</span><span class=\"t3\">+</span><span class=\"t1\">-</span><span class=\"t0\">    ..........</span>\n<span class=\"t1\">.</span><span class=\"t0\">.... ....        </span><span class=\"t3\">*</span><span class=\"t0\">. .                      </span><span class=\"t2\">-</span><span class=\"t1\">:</span><span class=\"t2\">-=</span><span class=\"t3\">*</span><span class=\"t4\">#</span><span class=\"t0\">     .........</span>\n<span class=\"t1\">.</span><span class=\"t0\">....             </span><span class=\"t2\">-</span><span class=\"t0\">                         </span><span class=\"t2\">-</span><span class=\"t3\">*</span><span class=\"t4\">#</span><span class=\"t3\">#</span><span class=\"t4\">#@</span><span class=\"t0\">.    .........</span>\n<span class=\"t1\">:.</span><span class=\"t0\">...   .        .</span><span class=\"t3\">+</span><span class=\"t2\">=-</span><span class=\"t1\">:</span><span class=\"t0\">                      </span><span class=\"t2\">=</span><span class=\"t4\">%@@@</span><span class=\"t3\">#</span><span class=\"t0\">    .... .  ..</span>\n<span class=\"t1\">.</span><span class=\"t0\">....            </span><span class=\"t3\">#</span><span class=\"t4\">#%@@@#</span><span class=\"t2\">=</span><span class=\"t0\">                  .</span><span class=\"t2\">++</span><span class=\"t3\">#</span><span class=\"t4\">#@</span><span class=\"t1\">:</span><span class=\"t0\">    ....    ..</span>\n<span class=\"t0\">....             </span><span class=\"t2\">=-</span><span class=\"t3\">*#*</span><span class=\"t4\">#%@</span><span class=\"t3\">*</span><span class=\"t0\">   .</span><span class=\"t2\">-</span><span class=\"t3\">#</span><span class=\"t4\">%%</span><span class=\"t3\">+</span><span class=\"t2\">=-</span><span class=\"t1\">:</span><span class=\"t0\">      </span><span class=\"t1\">:</span><span class=\"t2\">+</span><span class=\"t3\">*</span><span class=\"t4\">%</span><span class=\"t2\">=</span><span class=\"t0\">       .   ....</span>\n<span class=\"t0\">....             .      .      </span><span class=\"t1\">:</span><span class=\"t2\">-=</span><span class=\"t3\">+</span><span class=\"t0\">.</span><span class=\"t2\">-=</span><span class=\"t1\">.</span><span class=\"t0\">     </span><span class=\"t2\">=</span><span class=\"t0\">.</span><span class=\"t1\">:</span><span class=\"t0\">         ... ....</span>\n<span class=\"t0\">....             .                               </span><span class=\"t4\">#</span><span class=\"t0\">      .   . ..</span>\n<span class=\"t0\">.</span><span class=\"t1\">..</span><span class=\"t0\">....          </span><span class=\"t1\">:</span><span class=\"t0\">     </span><span class=\"t1\">:</span><span class=\"t0\">                     </span><span class=\"t3\">+*</span><span class=\"t0\">             . ..</span>\n<span class=\"t1\">:</span><span class=\"t0\">....... .       </span><span class=\"t1\">::</span><span class=\"t0\">    </span><span class=\"t2\">=</span><span class=\"t3\">*+</span><span class=\"t1\">:::</span><span class=\"t0\">                            . .    </span>\n<span class=\"t1\">::</span><span class=\"t0\">....... .      </span><span class=\"t1\">::</span><span class=\"t0\">                                     .      .</span>\n<span class=\"t1\">::...</span><span class=\"t0\">.......     .</span><span class=\"t2\">-</span><span class=\"t0\">.</span><span class=\"t1\">-</span><span class=\"t2\">=</span><span class=\"t3\">+</span><span class=\"t2\">=</span><span class=\"t1\">:</span><span class=\"t0\">.</span><span class=\"t1\">.</span><span class=\"t0\">                                   ..</span>\n<span class=\"t1\">:::.</span><span class=\"t0\">........      </span><span class=\"t1\">-</span><span class=\"t0\">   </span><span class=\"t1\">:</span><span class=\"t2\">---</span><span class=\"t1\">:</span><span class=\"t0\">                                   ..</span>\n<span class=\"t1\">-:::::.</span><span class=\"t0\">......     .</span><span class=\"t2\">=</span><span class=\"t0\">                     </span><span class=\"t2\">=</span><span class=\"t0\">                     .</span>\n<span class=\"t2\">-</span><span class=\"t1\">--:-:::</span><span class=\"t0\">....     </span><span class=\"t1\">:</span><span class=\"t4\">@</span><span class=\"t2\">=</span><span class=\"t1\">:</span><span class=\"t2\">-</span><span class=\"t0\">                   </span><span class=\"t3\">*</span><span class=\"t1\">-</span><span class=\"t0\">                  ...</span>\n<span class=\"t1\">-::--::::</span><span class=\"t0\">.   </span><span class=\"t1\">.-</span><span class=\"t3\">+</span><span class=\"t4\">@@@</span><span class=\"t0\">. .</span><span class=\"t3\">*</span><span class=\"t4\">#</span><span class=\"t3\">+</span><span class=\"t2\">-</span><span class=\"t0\">.              </span><span class=\"t2\">=</span><span class=\"t3\">++</span><span class=\"t2\">-</span><span class=\"t1\">:.</span><span class=\"t0\">             ....</span>\n<span class=\"t1\">--:::::::</span><span class=\"t2\">-</span><span class=\"t3\">+</span><span class=\"t4\">#@@@@@@@</span><span class=\"t3\">+</span><span class=\"t0\">   .</span><span class=\"t3\">+</span><span class=\"t4\">#%#</span><span class=\"t3\">+</span><span class=\"t1\">-</span><span class=\"t0\">.         </span><span class=\"t1\">-</span><span class=\"t2\">-++++</span><span class=\"t3\">+++</span><span class=\"t2\">-</span><span class=\"t0\">.         ....</span>\n<span class=\"t1\">:-</span><span class=\"t2\">=</span><span class=\"t3\">+**</span><span class=\"t4\">#%@@@@@@@@@@@@</span><span class=\"t0\">       </span><span class=\"t1\">:-</span><span class=\"t0\">.          </span><span class=\"t2\">--====</span><span class=\"t3\">+</span><span class=\"t2\">=</span><span class=\"t3\">*#*</span><span class=\"t2\">=-</span><span class=\"t1\">:.</span><span class=\"t0\">.       .</span>\n<span class=\"t4\">%%@@@@@@@@@@@@@@@@%@</span><span class=\"t0\">.      </span><span class=\"t2\">=</span><span class=\"t3\">*</span><span class=\"t2\">==</span><span class=\"t0\">        </span><span class=\"t2\">-</span><span class=\"t1\">-</span><span class=\"t2\">==+==</span><span class=\"t3\">*+</span><span class=\"t2\">+</span><span class=\"t3\">*****+++</span><span class=\"t2\">=</span><span class=\"t1\">-:</span><span class=\"t0\">    </span>\n<span class=\"t4\">@@@@@@@@@@@@@@@@@@@%</span><span class=\"t2\">+</span><span class=\"t0\">    </span><span class=\"t2\">-</span><span class=\"t1\">:</span><span class=\"t3\">#</span><span class=\"t4\">%</span><span class=\"t2\">+</span><span class=\"t0\">  .     </span><span class=\"t1\">-</span><span class=\"t2\">--=+===</span><span class=\"t3\">**</span><span class=\"t2\">=</span><span class=\"t3\">+*#**++</span><span class=\"t2\">+</span><span class=\"t3\">+**++</span><span class=\"t2\">-</span><span class=\"t1\">.</span>\n<span class=\"t4\">@@@%@@@@@@@@@@@@@@@##</span><span class=\"t0\">    </span><span class=\"t1\">.</span><span class=\"t2\">+</span><span class=\"t3\">*</span><span class=\"t4\">#</span><span class=\"t1\">-</span><span class=\"t0\">   </span><span class=\"t1\">:</span><span class=\"t0\">   </span><span class=\"t1\">.</span><span class=\"t2\">--==</span><span class=\"t3\">+</span><span class=\"t2\">===</span><span class=\"t3\">+**++*#***</span><span class=\"t2\">+</span><span class=\"t3\">+++****</span>\n<span class=\"t4\">@%%@@@@@@@@@@@@@@@@%%</span><span class=\"t2\">==</span><span class=\"t0\">  </span><span class=\"t3\">#</span><span class=\"t4\">%</span><span class=\"t3\">+#+</span><span class=\"t0\">       </span><span class=\"t2\">=-===</span><span class=\"t3\">+*++#**++**#**+++</span><span class=\"t2\">+</span><span class=\"t3\">**++</span>\n<span class=\"t4\">%%%@@@@@@@@@@@@@@@@%%</span><span class=\"t1\">-</span><span class=\"t0\">  </span><span class=\"t3\">*</span><span class=\"t4\">@</span><span class=\"t3\">#</span><span class=\"t2\">=</span><span class=\"t3\">+</span><span class=\"t2\">=</span><span class=\"t3\">+</span><span class=\"t0\">    </span><span class=\"t3\">*</span><span class=\"t2\">==+==</span><span class=\"t3\">+</span><span class=\"t2\">=</span><span class=\"t3\">+*++</span><span class=\"t2\">=</span><span class=\"t3\">+++++****+++*#**</span>\n<span class=\"t4\">%%%%%@@@%%@@@@@@@%%%#%</span><span class=\"t0\"> </span><span class=\"t3\">+*</span><span class=\"t4\">%</span><span class=\"t2\">=--</span><span class=\"t1\">-</span><span class=\"t3\">+</span><span class=\"t0\">.  .</span><span class=\"t2\">=====++</span><span class=\"t3\">+++**+</span><span class=\"t2\">+</span><span class=\"t3\">+**+**+++++</span><span class=\"t4\">##</span><span class=\"t3\">*#</span>\n<span class=\"t4\">%#%%%@@@@%%%@@@@%%%%%@#</span><span class=\"t3\">*</span><span class=\"t2\">=</span><span class=\"t3\">#</span><span class=\"t2\">=--==-</span><span class=\"t0\">  </span><span class=\"t3\">+</span><span class=\"t2\">+=++=</span><span class=\"t3\">+++++**+**+**++*+++*</span><span class=\"t4\">@#%@</span>\n<span class=\"t4\">@%%%%%@@@@%%@@@%%%%%%@@</span><span class=\"t3\">#**</span><span class=\"t2\">=--==</span><span class=\"t3\">+</span><span class=\"t0\"> .</span><span class=\"t3\">*</span><span class=\"t2\">=</span><span class=\"t3\">+</span><span class=\"t2\">++=</span><span class=\"t3\">+*++**+#*+++**</span><span class=\"t2\">+</span><span class=\"t3\">**+*</span><span class=\"t4\">#@@%#</span>";

  const CSS = `
    .tm-backdrop {
      position: fixed; inset: 0; z-index: 1100; background: radial-gradient(ellipse at 50% 35%, #101018 0%, #0a0a0a 65%);
      overflow-y: auto; opacity: 0; transition: opacity 0.4s ease;
      display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;
    }
    .tm-backdrop.show { opacity: 1; }
    .tm-close {
      position: fixed; top: 1rem; right: 1.25rem; background: none; border: 1px solid #2a2a3a; color: #6272a4;
      font-family: inherit; font-size: 1rem; width: 2.2rem; height: 2.2rem; border-radius: 50%; cursor: pointer;
    }
    .tm-close:hover { color: #50fa7b; border-color: #50fa7b; }
    .tm-col { display: flex; flex-direction: column; align-items: center; gap: 1.1rem; max-width: 100%; }
    .tm-portrait {
      margin: 0; font-family: "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace;
      font-size: clamp(4.8px, 1.45vw, 10.5px); line-height: 1.05; letter-spacing: 0.02em;
      color: #b9c0d8; white-space: pre; user-select: none;
    }
    .tm-portrait .t0 { color: #1b2028; } .tm-portrait .t1 { color: #3b4a63; } .tm-portrait .t2 { color: #6272a4; }
    .tm-portrait .t3 { color: #8be9fd; } .tm-portrait .t4 { color: #f8f8f2; text-shadow: 0 0 8px rgba(139,233,253,0.35); }
    .tm-name { color: #6272a4; font-size: 0.78rem; letter-spacing: 0.35em; text-transform: uppercase; margin-top: 0.4rem; }
    .tm-dates { color: #f8f8f2; font-size: 1.05rem; letter-spacing: 0.15em; margin-top: -0.6rem; }
    .tm-quote { color: #a3abc9; font-style: italic; font-size: 0.92rem; max-width: 520px; text-align: center; line-height: 1.6; margin: 0; }
    .tm-quote small { display: block; font-style: normal; color: #6272a4; font-size: 0.75rem; margin-top: 0.4rem; letter-spacing: 0.1em; }
    .tm-machine { display: flex; align-items: center; gap: 0.6rem; margin-top: 0.6rem; width: 100%; max-width: 900px; justify-content: center; }
    .tm-lamp { width: 10px; height: 10px; border-radius: 50%; background: #2a2a3a; box-shadow: 0 0 0 rgba(0,0,0,0); transition: background 0.1s, box-shadow 0.1s; flex: none; }
    .tm-lamp.idle { background: #50fa7b; box-shadow: 0 0 10px rgba(80,250,123,0.6); }
    .tm-lamp.carry { background: #ff79c6; box-shadow: 0 0 12px rgba(255,121,198,0.7); }
    .tm-lamp.return { background: #8be9fd; box-shadow: 0 0 10px rgba(139,233,253,0.6); }
    .tm-tape-wrap { min-width: 0; overflow-x: auto; padding: 1rem 0 0.4rem; }
    .tm-tape { display: grid; grid-template-columns: repeat(${CELLS}, auto); gap: 2px; position: relative; justify-content: center; }
    .tm-cell {
      width: clamp(9px, 2.3vw, 24px); height: clamp(16px, 3.4vw, 34px); display: flex; align-items: center; justify-content: center;
      font-family: "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace; font-size: clamp(7px, 1.6vw, 15px);
      background: #12121a; border: 1px solid #2a2a3a; border-radius: 3px; color: #f8f8f2; position: relative;
      transition: background 0.08s, color 0.08s;
    }
    .tm-cell.zero { color: #3a3f55; }
    .tm-cell.lead { color: #23263a; }
    .tm-cell.head { background: #1a1a2a; border-color: #50fa7b; color: #50fa7b; }
    .tm-cell.head::before { content: "▾"; position: absolute; top: -1.05em; left: 50%; transform: translateX(-50%); color: #50fa7b; font-size: 0.95em; }
    .tm-cell.wrote { background: #2a1a2a; color: #ff79c6; border-color: #ff79c6; }
    @media (max-width: 520px) {
      .tm-tape { gap: 1px; }
      .tm-cell { box-sizing: border-box; width: calc((100vw - 4.5rem) / 32); height: calc((100vw - 4.5rem) / 32 * 1.7); font-size: 7px; border-radius: 2px; }
      .tm-tape-wrap { overflow: visible; }
    }
  `;

  let backdrop = null, cells = [], lamp = null, timer = null;
  let tape, head, state;

  function wallValue() { return Math.max(0, Math.floor(Date.now() / 1000) - EPOCH_S); }
  function tapeValue() { return tape.reduce((v, b) => v * 2 + b, 0); }
  function loadTape(v) { for (let i = CELLS - 1; i >= 0; i--) { tape[i] = v % 2; v = Math.floor(v / 2); } }

  function initMachine() {
    tape = new Array(CELLS).fill(0);
    loadTape(wallValue());
    head = CELLS - 1;
    state = 'idle';
  }

  // One step of the machine. Increment = flip trailing 1s to 0 walking left, flip the first 0 to 1, walk back.
  function step() {
    const behind = wallValue() - tapeValue();
    if (state === 'idle') {
      if (behind > RESYNC_AFTER_S) { loadTape(wallValue()); head = CELLS - 1; return 'sync'; }
      if (behind > 0) { state = 'carry'; return 'start'; }
      return 'idle';
    }
    if (state === 'carry') {
      if (tape[head] === 1) { tape[head] = 0; head--; if (head < 0) { initMachine(); } return 'wrote'; }
      tape[head] = 1; state = 'return'; return 'wrote';
    }
    if (state === 'return') {
      if (head < CELLS - 1) { head++; } else { state = 'idle'; }
      return 'move';
    }
    return 'idle';
  }

  function render(what) {
    let lead = true;
    for (let i = 0; i < CELLS; i++) {
      const b = tape[i];
      if (b === 1) lead = false;
      const c = cells[i];
      c.textContent = b;
      c.className = 'tm-cell' + (b === 0 ? (lead ? ' lead' : ' zero') : '') + (i === head ? ' head' : '');
      if (i === head && what === 'wrote') c.classList.add('wrote');
    }
    lamp.className = 'tm-lamp ' + state;
  }

  function tick() {
    const what = step();
    render(what);
    const behind = wallValue() - tapeValue();
    timer = setTimeout(tick, behind > 1 ? STEP_FAST_MS : STEP_MS);
  }

  function open() {
    if (backdrop) return;
    if (!document.getElementById('tm-style')) {
      const s = document.createElement('style'); s.id = 'tm-style'; s.textContent = CSS; document.head.appendChild(s);
    }
    backdrop = document.createElement('div');
    backdrop.className = 'tm-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-label', 'Alan Turing, 1912 to 1954');
    backdrop.innerHTML = `
      <button class="tm-close" aria-label="Close">×</button>
      <div class="tm-col">
        <pre class="tm-portrait" aria-hidden="true"></pre>
        <div class="tm-name">Alan Turing</div>
        <div class="tm-dates">1912 – 1954</div>
        <p class="tm-quote">“We can only see a short distance ahead, but we can see plenty there that needs to be done.”<small>Computing Machinery and Intelligence, 1950</small></p>
        <div class="tm-machine"><span class="tm-lamp"></span><div class="tm-tape-wrap"><div class="tm-tape"></div></div></div>
      </div>`;
    backdrop.querySelector('.tm-portrait').innerHTML = PORTRAIT;
    const tapeEl = backdrop.querySelector('.tm-tape');
    cells = [];
    for (let i = 0; i < CELLS; i++) { const c = document.createElement('div'); c.className = 'tm-cell'; tapeEl.appendChild(c); cells.push(c); }
    lamp = backdrop.querySelector('.tm-lamp');
    backdrop.querySelector('.tm-close').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    initMachine();
    render('idle');
    requestAnimationFrame(() => backdrop.classList.add('show'));
    timer = setTimeout(tick, STEP_MS);
  }

  function close() {
    if (!backdrop) return;
    clearTimeout(timer); timer = null;
    const b = backdrop; backdrop = null;
    b.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => b.remove(), 400);
    if (location.hash === '#turing') history.replaceState(null, '', location.pathname);
  }

  // Typed trigger (the original): the letters t-u-r-i-n-g in a row, outside any input.
  let buffer = '';
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop) { close(); return; }
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-6);
    if (buffer === 'turing') { buffer = ''; open(); }
  });

  function checkHash() { if (location.hash === '#turing') open(); }
  window.addEventListener('hashchange', checkHash);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', checkHash); else checkHash();

  window.JadedTuring = { open, close };
})();
