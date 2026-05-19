// /now interactive archive terminal
// Reads JSON data from #now-data, parses commands, prints output.
(function () {
  const term = document.getElementById('now-term');
  const body = document.getElementById('now-term-body');
  const output = document.getElementById('now-term-output');
  const form = document.getElementById('now-term-form');
  const input = document.getElementById('now-term-input');
  const dataEl = document.getElementById('now-data');
  if (!term || !body || !output || !form || !input || !dataEl) return;

  let data;
  try {
    data = JSON.parse(dataEl.textContent);
  } catch (e) {
    println('archive data unavailable: ' + e.message, 'err');
    return;
  }

  const posts = data.posts || [];
  const current = data.current || null;

  // --- virtual filesystem ---
  // post.N.md = shipped items (lowest N = newest)
  // .now      = current task (hidden)
  // .profile  = bio (hidden)
  // .tags     = all unique tags (hidden)
  const files = {};
  posts.forEach((p) => { files[p.filename] = postBody(p); });
  files['.now'] = currentBody(current);
  files['.profile'] = profileBody();
  files['.tags'] = tagsBody(posts);

  const visibleNames = posts.map((p) => p.filename).sort();
  const allNames = Object.keys(files).sort();

  const history = [];
  let histIdx = -1;
  let draft = '';

  // --- output helpers ---
  function println(text, cls) {
    const line = document.createElement('div');
    line.className = 'now-term-line' + (cls ? ' now-term-' + cls : '');
    line.textContent = text;
    output.appendChild(line);
  }

  function printHTML(html, cls) {
    const line = document.createElement('div');
    line.className = 'now-term-line' + (cls ? ' now-term-' + cls : '');
    line.innerHTML = html;
    output.appendChild(line);
  }

  function printEcho(cmd) {
    printHTML(
      '<span class="now-term-echo-prompt">guest@jadedviber:~/archive$</span> ' +
        escapeHTML(cmd),
      'echo'
    );
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  // --- file body builders ---
  function postBody(p) {
    const lines = [];
    lines.push(`# ${p.title}`);
    lines.push('');
    if (p.finished) lines.push(`shipped: ${p.finished}`);
    if (p.started && p.started !== p.finished) lines.push(`started: ${p.started}`);
    if (p.tags && p.tags.length) lines.push(`tags:    ${p.tags.join(', ')}`);
    lines.push('');
    lines.push(p.summary);
    if (p.links && p.links.length) {
      lines.push('');
      lines.push('links:');
      p.links.forEach((l) => lines.push(`  - ${l.label}: ${l.url}`));
    }
    return lines.join('\n');
  }

  function currentBody(c) {
    if (!c) return '(no current task)';
    const lines = [
      `# ${c.title}  [WIP]`,
      '',
      `started:  ${c.started || ''}`,
      `progress: ${c.progress_pct || 0}%`,
    ];
    if (c.tags && c.tags.length) lines.push(`tags:     ${c.tags.join(', ')}`);
    lines.push('', c.summary || '');
    if (c.links && c.links.length) {
      lines.push('', 'links:');
      c.links.forEach((l) => lines.push(`  - ${l.label}: ${l.url}`));
    }
    return lines.join('\n');
  }

  function profileBody() {
    return [
      '# Joshua Brown (jaded)',
      '',
      'role:    vibe coder / homelab tinkerer',
      'site:    https://jadedviber.com',
      'github:  https://github.com/jaded423',
      '',
      'Building things that work while I sleep.',
    ].join('\n');
  }

  function tagsBody(posts) {
    const tags = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort().join('\n') || '(no tags)';
  }

  // --- commands ---
  const commands = {
    help() {
      printHTML([
        'available commands:',
        '  <span class="kw">help</span>             show this',
        '  <span class="kw">ls</span> [-l|-la]      list shipped posts',
        '  <span class="kw">cat</span> &lt;file&gt;       print file',
        '  <span class="kw">open</span> &lt;file&gt;      alias for cat',
        '  <span class="kw">pwd</span>              print working dir',
        '  <span class="kw">whoami</span>           guest',
        '  <span class="kw">date</span>             today',
        '  <span class="kw">history</span>          recent commands',
        '  <span class="kw">clear</span>            clear screen',
        '  <span class="kw">exit</span>             well, you can try',
        '',
        'tip: lowest-numbered post is newest. <span class="kw">cat post.1</span>',
      ].join('\n'));
    },
    ls(args) {
      const flags = args.filter((a) => a.startsWith('-')).join('');
      const all = flags.includes('a');
      const long = flags.includes('l');
      const names = all ? allNames : visibleNames;
      if (long) {
        names.forEach((n) => {
          const p = posts.find((p) => p.filename === n);
          const meta = p ? (p.finished || p.started) : 'hidden';
          const tagstr = p && p.tags && p.tags.length ? ' [' + p.tags.join(',') + ']' : '';
          printHTML(`<span class="dim">-rw-r--r--  jaded  ${meta}</span>  <span class="fname">${escapeHTML(n)}</span>${escapeHTML(tagstr)}`);
        });
      } else {
        printHTML(names.map((n) => `<span class="fname">${escapeHTML(n)}</span>`).join('  '));
      }
    },
    cat(args) {
      if (!args.length) return println('cat: missing file operand', 'err');
      args.forEach((arg) => {
        const name = resolveName(arg);
        if (!name) return println(`cat: ${arg}: No such file or directory`, 'err');
        printHTML('<pre class="now-term-file">' + escapeHTML(files[name]) + '</pre>');
      });
    },
    open(args) { commands.cat(args); },
    pwd() { println('/home/guest/archive'); },
    whoami() { println('guest'); },
    date() { println(new Date().toString()); },
    history() {
      history.forEach((h, i) => println(`  ${i + 1}  ${h}`));
    },
    clear() { output.innerHTML = ''; },
    cd(args) {
      const target = args[0] || '~';
      if (target === '..' || target === '/' || target === '~' || target === '~/' || target === '/home/guest' || target === 'archive') {
        printHTML('<span class="dim">(this is a static page — you live here now)</span>');
      } else {
        println(`cd: no such file or directory: ${target}`, 'err');
      }
    },
    echo(args) { println(args.join(' ')); },
    exit() { printHTML('<span class="dim">no escape from the snek</span>'); },
    logout() { commands.exit(); },
    sudo() { println('guest is not in the sudoers file. This incident will be reported.', 'err'); },
    rm() { println('permission denied. nice try.', 'err'); },
    vim(args) {
      if (args.length) commands.cat(args);
      else printHTML('<span class="dim">vim: read-only — try cat &lt;file&gt;</span>');
    },
    vi(args) { commands.vim(args); },
    nano(args) { commands.vim(args); },
    nvim(args) { commands.vim(args); },
    'rm -rf /'() { println('lol', 'err'); },
    snek() { printHTML('<span class="snek">🐍 vssssss</span>'); },
    matrix() { printHTML('<span class="dim">wake up, neo…</span>'); },
  };

  function resolveName(arg) {
    if (files[arg]) return arg;
    // accept extension-less form
    const withMd = arg + '.md';
    if (files[withMd]) return withMd;
    // tolerate ./ prefix
    const stripped = arg.replace(/^\.\//, '');
    if (files[stripped]) return stripped;
    return null;
  }

  function run(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;
    history.push(cmd);
    histIdx = history.length;
    printEcho(cmd);
    const tokens = cmd.split(/\s+/);
    const name = tokens[0];
    const args = tokens.slice(1);
    if (commands[name]) {
      commands[name](args);
    } else {
      println(`${name}: command not found. type 'help'.`, 'err');
    }
  }

  // --- input handling ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    draft = '';
    run(v);
    scrollToBottom();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      if (histIdx === history.length) draft = input.value;
      histIdx = Math.max(0, histIdx - 1);
      input.value = history[histIdx] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx >= history.length) return;
      histIdx += 1;
      input.value = histIdx >= history.length ? draft : history[histIdx];
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const tokens = input.value.split(/\s+/);
      const last = tokens[tokens.length - 1];
      if (tokens.length < 2 || !last) return;
      const matches = allNames.filter((n) => n.startsWith(last));
      if (matches.length === 1) {
        tokens[tokens.length - 1] = matches[0];
        input.value = tokens.join(' ');
      } else if (matches.length > 1) {
        printEcho(input.value);
        printHTML(matches.map((n) => `<span class="fname">${escapeHTML(n)}</span>`).join('  '));
        scrollToBottom();
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  // refocus input on terminal click
  term.addEventListener('click', () => {
    if (window.getSelection().toString()) return;
    input.focus();
  });

  // --- banner ---
  const banner = [
    '┌──────────────────────────────────────────────────────────┐',
    '│  jadedviber.archive — shipped work, terminal-style       │',
    '│  type \'help\' for commands, \'ls\' to list, \'cat post.1\' │',
    '└──────────────────────────────────────────────────────────┘',
  ].join('\n');
  printHTML('<pre class="now-term-banner">' + escapeHTML(banner) + '</pre>');
  println(`${posts.length} shipped posts available.`, 'dim');
  println('');

  input.focus();
})();
