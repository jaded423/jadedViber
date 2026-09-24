// Homelab map: data + renderer. Same visual vocabulary as the /work diagrams (classes in homelab.css).
// No LAN addresses, no MACs, no tailnet IPs, no SSIDs. The wiki in the homeLab repo owns those.
(function () {
  'use strict';

  const COLORS = {
    physical: '#50fa7b', vm: '#8be9fd', ct: '#8be9fd', cloud: '#ff79c6',
    device: '#bd93f9', storage: '#ffb86c', host: '#6272a4'
  };
  const SHAPE = {
    physical: 'box-sage', vm: 'box-blue', ct: 'box-ct', cloud: 'box-pink',
    device: 'box-accent', storage: 'box-orange', host: 'box-dash', net: 'box'
  };
  const TYPE_LABEL = {
    physical: 'physical', vm: 'virtual machine', ct: 'container', cloud: 'overlay network',
    device: 'device', storage: 'storage', host: 'host jobs', net: 'network'
  };

  // ---- section captions ----
  const captions = [
    { x: 520, y: 16, text: 'ANYWHERE · THE ROAMING FLEET · every box runs the Tailscale client', anchor: 'middle' },
    { x: 520, y: 329, text: 'THE HOUSE · one flat /22 · 2.5 GbE between the nodes', anchor: 'middle' },
    { x: 44, y: 658, text: 'ALSO ON THE LAN', anchor: 'start' }
  ];

  // ---- groups (the two Proxmox nodes) ----
  const groups = [
    { id: 'book5', type: 'physical', x: 40, y: 340, w: 400, h: 310,
      title: 'book5 · Proxmox node 1', right: 'Galaxy Book5 Pro 360 · 16 GB',
      desc: 'A Samsung Galaxy Book5 Pro 360 running Proxmox VE with its screen switched off. Cluster node 1, the SSH jump host, the Twingate connector, and the place tower\'s syslog goes to die loudly. It keeps the lighter guests and all the watchdogs.',
      specs: [
        { label: 'Hardware', value: 'Galaxy Book5 Pro 360, Lunar Lake' },
        { label: 'Memory', value: '16 GB' },
        { label: 'Storage', value: '880 GB NVMe, ZFS' },
        { label: 'Guests', value: 'VM 100 · CT 316 · CT 103' },
        { label: 'Network', value: '2.5 GbE over USB' },
        { label: 'Watchdogs', value: 'network, CPU, tower' }
      ] },
    { id: 'tower', type: 'physical', x: 480, y: 340, w: 520, h: 310,
      title: 'tower · Proxmox node 2', right: 'ThinkStation P510 · Xeon 16c · 78 GB ECC · Quadro M4000',
      desc: 'A Lenovo ThinkStation P510: sixteen Xeon cores, 78 GB of ECC memory, a Quadro M4000 bound to VFIO and handed whole to the media VM. Cluster node 2 and the storage box. The kernel is pinned to a known-good build after a newer one started hanging it silently.',
      specs: [
        { label: 'Hardware', value: 'ThinkStation P510' },
        { label: 'CPU', value: 'Xeon E5-2667 v4, 16c / 32t' },
        { label: 'Memory', value: '78 GB DDR4 ECC' },
        { label: 'GPU', value: 'Quadro M4000 8 GB → VM 101' },
        { label: 'Storage', value: 'SSD rpool + 4 TB HDD media-pool' },
        { label: 'Guests', value: 'VM 101 · VM 111' },
        { label: 'Network', value: '2.5 GbE primary, 1 GbE spare' }
      ] }
  ];

  // ---- nodes ----
  const nodes = [
    // roaming fleet
    { id: 'pocket', type: 'device', x: 40, y: 28, w: 180, h: 50, title: 'Pocket', lines: ['GPD Pocket 4 · daily driver'],
      desc: 'A GPD Pocket 4 running Omarchy (Arch + Hyprland). The daily driver since mid-September, where every command in the lab is typed. Ryzen AI 9, 32 GB, 2 TB, an 8.8-inch screen.',
      specs: [{ label: 'OS', value: 'Omarchy' }, { label: 'Role', value: 'workstation' }, { label: 'Reaches the lab', value: 'Tailscale, by name' }] },
    { id: 'phone', type: 'device', x: 240, y: 28, w: 180, h: 50, title: 'Phone', lines: ['S25 Ultra · Termux · Tailscale'],
      desc: 'Samsung S25 Ultra with Termux. Full SSH access to the lab from anywhere, and the sermon pages play here.',
      specs: [{ label: 'Access', value: 'Termux + ssh' }, { label: 'Path', value: 'Tailscale' }] },
    { id: 'tablet', type: 'device', x: 440, y: 28, w: 180, h: 50, title: 'Tablet', lines: ['Tab S9 FE · on-demand tunnel'],
      desc: 'Samsung Galaxy Tab S9 FE. Reaches the lab through an on-demand tunnel to save battery.',
      specs: [{ label: 'Hardware', value: 'Tab S9 FE' }, { label: 'Tunnel', value: 'on demand' }] },
    { id: 'go', type: 'device', x: 640, y: 28, w: 180, h: 50, title: 'Pixelbook Go', lines: ['CachyOS · dual kernel'],
      desc: 'A Pixelbook Go running CachyOS with two kernels to pick from at boot. Lightweight portable box, static on the LAN when it is home.',
      specs: [{ label: 'OS', value: 'CachyOS' }, { label: 'Role', value: 'portable dev' }] },
    { id: 'mac', type: 'device', x: 840, y: 28, w: 180, h: 50, title: 'Mac', lines: ['the old daily driver · retiring'],
      desc: 'The MacBook Air that ran the lab until September. Mirrored whole to tower\'s ZFS pool before it goes, snapshot per run.',
      specs: [{ label: 'Status', value: 'retiring' }, { label: 'Backup', value: 'tower media-pool/backups' }] },

    // overlays
    { id: 'tailscale', type: 'cloud', x: 40, y: 132, w: 350, h: 50, title: 'Tailscale mesh', lines: ['MagicDNS · bare ssh alias works from anywhere · the primary path'],
      desc: 'The primary way in. Every host runs the client and gets a name, so the bare alias reaches it from anywhere with no port forwards and no VPN server to maintain. A tailnet ACL tags the Pi gateway and auto-approves the LAN route it advertises.',
      specs: [{ label: 'Role', value: 'primary overlay' }, { label: 'Names', value: 'MagicDNS' }, { label: 'Since', value: 'May 2026 (was LAN-first)' }] },
    { id: 'internet', type: 'net', x: 430, y: 132, w: 200, h: 50, title: 'Internet', lines: ['Spectrum modem in bridge mode'],
      desc: 'The cable modem is in bridge mode, so the router holds the public address and there is no double NAT. Power-cycle it when the router changes; it binds to the first MAC it sees.',
      specs: [{ label: 'Modem', value: 'bridge mode' }, { label: 'NAT', value: 'single, at the router' }] },
    { id: 'twingate', type: 'cloud', x: 670, y: 132, w: 350, h: 50, title: 'Twingate', lines: ['zero-trust · scoped to LAN-only web UIs · connector on book5'],
      desc: 'The second overlay, kept on purpose. Scoped to the web UIs that only answer on the LAN (Home Assistant, Plex). When one overlay breaks, the other usually still works.',
      specs: [{ label: 'Role', value: 'secondary overlay' }, { label: 'Connector', value: 'runs on book5' }, { label: 'Scope', value: 'media + LAN-only UIs' }] },

    // the edge of the house
    { id: 'pigw1', type: 'physical', x: 40, y: 218, w: 260, h: 56, title: 'pi-gw1', lines: ['Raspberry Pi 5 · Tailscale subnet router', 'Caddy front door for the sermon pages'],
      desc: 'A Raspberry Pi 5 wired into the router. It advertises the whole LAN as a Tailscale subnet route, so a phone on cellular reaches the cameras, the router, and the containers that have no Tailscale of their own. Caddy on it terminates TLS for sermons.jadedviber.com. It is the first unit of a client-site gateway kit, living here as the tester.',
      specs: [{ label: 'Hardware', value: 'Raspberry Pi 5' }, { label: 'Jobs', value: 'subnet router · Caddy' }, { label: 'Origin', value: 'piGate kit #1' }] },
    { id: 'router', type: 'physical', x: 400, y: 218, w: 260, h: 56, title: 'Flint 3 router', lines: ['GL.iNet, OpenWrt underneath · gateway + DHCP', 'DNS handed to clients = the pihole'],
      desc: 'A GL.iNet Flint 3 (Wi-Fi 7, OpenWrt-based) is the gateway since 23 September, the third router this year. Config as code over ssh, real DHCP, the pihole handed out as DNS. Static hosts pin their own addresses outside the DHCP pool, so nothing can collide.',
      specs: [{ label: 'Model', value: 'GL.iNet Flint 3' }, { label: 'Firmware', value: 'GL 4.9, OpenWrt' }, { label: 'DHCP', value: 'pool outside the static range' }, { label: 'Since', value: '2026-09-23' }] },
    { id: 'deco', type: 'physical', x: 720, y: 218, w: 200, h: 56, title: 'Deco BE63', lines: ['Wi-Fi access point only', 'wired backhaul to the router'],
      desc: 'The surviving Deco of a pair (lightning took the other in June). It used to be the router; now it is an access point on a wired backhaul and nothing more.',
      specs: [{ label: 'Role', value: 'access point' }, { label: 'Backhaul', value: 'wired' }] },

    // book5 guests
    { id: 'vm100', type: 'vm', x: 60, y: 376, w: 360, h: 56, title: 'VM 100 · omarchy', lines: ['Arch + Hyprland desktop · Sunshine game stream · n8n', 'book5\'s Intel Arc iGPU passed through for encode'],
      desc: 'An Arch Linux desktop VM with Hyprland. Doubles as a game-stream rig (Sunshine, hardware encode on the passed-through iGPU) and the home of the n8n automation stack. Memory is fixed, ballooning off, because ballooning crushed it under game load.',
      specs: [{ label: 'OS', value: 'Arch, Hyprland' }, { label: 'Memory', value: '9 GB fixed, no balloon' }, { label: 'GPU', value: 'Intel Arc iGPU passthrough' }, { label: 'Runs', value: 'Sunshine · n8n' }] },
    { id: 'ct316', type: 'ct', x: 60, y: 448, w: 172, h: 56, title: 'CT 316 · sermons', lines: ['nginx · pages + audio', 'LAN-only, fronted by pi-gw1'],
      desc: 'An unprivileged Debian container that is the one home of the sermon site: follow-along pages, transcripts, and one mp3 per sermon. Born on tower on 21 September, moved to book5 two days later after tower hung twice. It has no Tailscale of its own; pi-gw1 fronts it.',
      specs: [{ label: 'Type', value: 'LXC, Debian 13' }, { label: 'Size', value: '1 GB · 2 cores · 8 GB disk' }, { label: 'Serves', value: 'sermons.jadedviber.com' }] },
    { id: 'ct103', type: 'ct', x: 248, y: 448, w: 172, h: 56, title: 'CT 103 · Homelable', lines: ['network scanner', 'keeps a map of the /22'],
      desc: 'A network scanner container that walks the whole subnet and keeps an inventory, with a small MCP endpoint so a Claude session can ask it what is on the network.',
      specs: [{ label: 'Type', value: 'container' }, { label: 'Job', value: 'scan + inventory' }] },
    { id: 'book5host', type: 'host', x: 60, y: 520, w: 360, h: 114, title: 'on the host itself', lines: ['network + CPU watchdogs', 'tower-watchdog: three silent minutes → pull tower\'s plug', 'syslog receiver for tower\'s last words', 'Twingate connector · the ssh jump host', 'quorum: the pihole is the cluster\'s tie-breaker'],
      desc: 'The jobs that run on book5 outside any guest. A net-health watchdog that probes internet, peers, and DNS separately and only restarts networking on true isolation. A CPU watchdog. A tower watchdog that power-cycles tower\'s smart plug after three unanswered minutes. rsyslog listening for tower. The Twingate connector.',
      specs: [{ label: 'Watchdogs', value: 'net-health · CPU · tower' }, { label: 'Logs', value: 'tower → book5, UDP syslog' }, { label: 'Quorum', value: 'QDevice on the pihole' }] },

    // tower guests
    { id: 'vm101', type: 'vm', x: 500, y: 376, w: 290, h: 150, align: 'left', title: 'VM 101 · ubuntu — the workhorse', lines: [
        '48 GB · 28 vCPU · the Quadro M4000 passed through',
        'media: Plex · Jellyfin · qBittorrent',
        'AI: Ollama + Open WebUI · whisper',
        'eyes: Frigate NVR · MQTT · plate reader',
        'code + books: Gitea · two Odoo instances',
        'games: steam-headless, streamed by Sunshine',
        'ops: Portainer · ClamAV · autoheal',
        'egress: Mullvad WireGuard, lockdown always on'],
      desc: 'The busiest box in the house. Ubuntu Server with Docker: two media servers, torrents, a local LLM with a chat UI, an NVR watching two cameras with plate recognition, a Gitea mirror, two Odoo instances (one to learn the ERP I use at work, one for personal finance), a headless Steam rig, and on-demand Whisper. It is the only machine on Mullvad, lockdown on, which is why it is reached by jumping through tower rather than over Tailscale.',
      specs: [{ label: 'OS', value: 'Ubuntu Server 22.04' }, { label: 'Resources', value: '48 GB · 28 vCPU' }, { label: 'GPU', value: 'Quadro M4000, VFIO' }, { label: 'Services', value: '17 running' }, { label: 'Storage', value: 'one root disk + NFS from tower' }, { label: 'Egress', value: 'Mullvad, lockdown' }, { label: 'Access', value: 'ProxyJump through tower' }] },
    { id: 'vm111', type: 'vm', x: 810, y: 376, w: 170, h: 56, title: 'VM 111 · Home Assistant', lines: ['Hubspace · Frigate · MQTT', 'porch-cam notifications'],
      desc: 'Home Assistant OS. Smart plugs and lights, the Frigate integration, an MQTT bus, and the notification that fires when autoheal has to restart Frigate, so a silent fix is never silent.',
      specs: [{ label: 'OS', value: 'Home Assistant OS' }, { label: 'Integrations', value: 'Hubspace · Frigate · MQTT' }, { label: 'Access', value: 'ProxyJump tower · Twingate for the UI' }] },
    { id: 'mediapool', type: 'storage', x: 810, y: 448, w: 170, h: 78, title: 'media-pool', lines: ['4 TB ZFS HDD pool', 'media · Frigate clips', 'Ollama models · backups'],
      desc: 'tower\'s 4 TB spinning-disk ZFS pool, exported to VM 101 over NFS across the 2.5 GbE bridge. Movies, series, music, camera recordings, model files, and the whole-machine backups of the Mac and the Pocket, one snapshot per run.',
      specs: [{ label: 'Pool', value: '4 TB HDD, ZFS' }, { label: 'Export', value: 'NFS → VM 101, 3.2 T' }, { label: 'Datasets', value: 'media · frigate · ollama · backups' }] },
    { id: 'towerhost', type: 'host', x: 500, y: 542, w: 480, h: 92, title: 'on the host itself', lines: [
        'kernel pinned to a known-good build after 6.17.13 started hanging the box',
        'lockup → loud panic → reboot in 30 s · pstore keeps the kernel\'s last words',
        'rsyslog streams to book5, so the log survives the crash',
        'ZFS: rpool on SSD for VM disks · media-pool on HDD, exported over NFS'],
      desc: 'What tower runs outside its guests: the ZFS pools and the NFS export, and the crash instrumentation. Soft and hard lockups are set to panic, panic reboots the box in thirty seconds, pstore keeps the panic across the reboot, and rsyslog forwards everything to book5 as it happens.',
      specs: [{ label: 'Kernel', value: 'pinned 6.17.4' }, { label: 'On lockup', value: 'panic → reboot 30 s' }, { label: 'Forensics', value: 'pstore + book5 syslog' }] },

    // also on the LAN
    { id: 'pihole', type: 'physical', x: 40, y: 690, w: 210, h: 56, title: 'pihole', lines: ['Raspberry Pi 2 B · DNS + ad-block', 'unbound resolver · cluster QDevice'],
      desc: 'A Raspberry Pi 2 doing three jobs: Pi-hole ad-blocking DNS for every client, an unbound recursive resolver behind it, and the QDevice that breaks ties for the two-node Proxmox cluster. A 7-inch screen on the front shows the query dashboard.',
      specs: [{ label: 'Hardware', value: 'Raspberry Pi 2 Model B' }, { label: 'DNS', value: 'Pi-hole + unbound' }, { label: 'Extra', value: 'Proxmox QDevice' }] },
    { id: 'cams', type: 'device', x: 280, y: 690, w: 210, h: 56, title: 'Cameras', lines: ['two Tapo cams, porch + pet cam', 'streams into Frigate on VM 101'],
      desc: 'Two TP-Link Tapo cameras, one on the porch (4K) and one on the pets (2K). They stream to Frigate on VM 101, which does object detection and plate reading locally. Nothing leaves the house.',
      specs: [{ label: 'Cameras', value: '2× Tapo' }, { label: 'NVR', value: 'Frigate, VM 101' }, { label: 'Cloud', value: 'none' }] },
    { id: 'pc', type: 'device', x: 520, y: 690, w: 210, h: 56, title: 'PC + WSL', lines: ['Windows box · WSL Ubuntu', 'shares its internet with pi1'],
      desc: 'A Windows desktop with WSL. It came home from the office in August. Its remaining job is to share its connection with pi1, which has no Wi-Fi.',
      specs: [{ label: 'OS', value: 'Windows + WSL' }, { label: 'Job', value: 'ICS host for pi1' }] },
    { id: 'pi1', type: 'physical', x: 760, y: 690, w: 210, h: 56, title: 'pi1', lines: ['Raspberry Pi 1 B+ · DietPi', 'bare-git mirror of 15 repos'],
      desc: 'The original Raspberry Pi, model B+, on DietPi. A bare-git mirror of fifteen repositories, pushed weekly alongside GitHub and Gitea. It used to sit offsite; since August it lives in the same building as the cluster it backs up, so it is a third local copy now.',
      specs: [{ label: 'Hardware', value: 'Raspberry Pi 1 B+' }, { label: 'OS', value: 'DietPi Bookworm' }, { label: 'Repos', value: '15, bare' }, { label: 'Offsite', value: 'not any more' }] }
  ];

  // ---- edges: explicit paths, labeled like the /work diagrams ----
  const edges = [
    // fleet → overlays
    { d: 'M130 78 V96', cls: 'faint', from: 'pocket', to: 'tailscale' },
    { d: 'M330 78 V96', cls: 'faint', from: 'phone', to: 'tailscale' },
    { d: 'M530 78 V96', cls: 'faint', from: 'tablet', to: 'tailscale' },
    { d: 'M730 78 V96', cls: 'faint', from: 'go', to: 'tailscale' },
    { d: 'M930 78 V96', cls: 'faint', from: 'mac', to: 'tailscale' },
    { d: 'M130 96 H930', cls: 'bus' },
    { d: 'M215 96 V132', arrow: true, from: 'fleet', to: 'tailscale', label: 'ssh · every host by name', lx: 222, ly: 118, anchor: 'start' },
    { d: 'M845 96 V132', arrow: true, from: 'fleet', to: 'twingate', label: 'LAN-only web UIs', lx: 852, ly: 118, anchor: 'start' },
    // overlays → edge of the house
    { d: 'M170 182 V218', arrow: true, from: 'tailscale', to: 'pigw1', label: 'advertises the LAN as a subnet route', lx: 178, ly: 204, anchor: 'start' },
    { d: 'M530 182 V218', arrow: true, from: 'internet', to: 'router', label: 'WAN · public IP · no double NAT', lx: 538, ly: 204, anchor: 'start' },
    { d: 'M660 246 H720', arrow: true, from: 'router', to: 'deco', label: 'wired', lx: 690, ly: 240, anchor: 'middle' },
    // into the LAN bus
    { d: 'M28 310 H1000', cls: 'bus' },
    { d: 'M170 274 V310', arrow: true, from: 'pigw1', to: 'lan' },
    { d: 'M530 274 V310', arrow: true, from: 'router', to: 'lan' },
    { d: 'M820 274 V310', arrow: true, from: 'deco', to: 'lan', label: 'Wi-Fi clients', lx: 828, ly: 296, anchor: 'start' },
    // bus → the nodes
    { d: 'M240 310 V340', arrow: true, from: 'lan', to: 'book5' },
    { d: 'M740 310 V340', arrow: true, from: 'lan', to: 'tower' },
    // inside tower
    { d: 'M810 490 H790', arrow: true, from: 'mediapool', to: 'vm101' },
    // bus → also on the LAN
    { d: 'M28 310 V666 H865', cls: 'faint' },
    { d: 'M145 666 V690', cls: 'faint', from: 'lan', to: 'pihole' },
    { d: 'M385 666 V690', cls: 'faint', from: 'lan', to: 'cams' },
    { d: 'M625 666 V690', cls: 'faint', from: 'lan', to: 'pc' },
    { d: 'M865 666 V690', cls: 'faint', from: 'lan', to: 'pi1' },
    { d: 'M730 718 H760', arrow: true, from: 'pc', to: 'pi1', label: 'ICS', lx: 745, ly: 712, anchor: 'middle', small: true }
  ];

  // ---- render ----
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('topology');
  if (!svg) return;
  const gGroups = document.getElementById('topo-groups');
  const gEdges = document.getElementById('topo-edges');
  const gNodes = document.getElementById('topo-nodes');
  const gLabels = document.getElementById('topo-labels');

  function el(name, attrs, cls) {
    const e = document.createElementNS(svgNS, name);
    Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k]));
    if (cls) e.setAttribute('class', cls);
    return e;
  }
  function text(x, y, str, cls) {
    const t = el('text', { x, y }, cls);
    t.textContent = str;
    return t;
  }

  captions.forEach(c => {
    const t = text(c.x, c.y, c.text, 'cap');
    t.setAttribute('text-anchor', c.anchor);
    gLabels.appendChild(t);
  });

  const items = [];   // every clickable thing: { el, data }

  groups.forEach(g => {
    const wrap = el('g', { 'data-id': g.id }, 'topo-group');
    wrap.style.setProperty('--node-color', COLORS[g.type]);
    wrap.appendChild(el('rect', { x: g.x, y: g.y, width: g.w, height: g.h, rx: 9 }, 'box-group g-shape'));
    wrap.appendChild(text(g.x + 16, g.y + 22, g.title, 't-strong'));
    const r = text(g.x + g.w - 16, g.y + 22, g.right, 'lbl t-e');
    wrap.appendChild(r);
    gGroups.appendChild(wrap);
    items.push({ el: wrap, data: g });
  });

  const edgeEls = [];
  edges.forEach(e => {
    const p = el('path', { d: e.d }, 'topo-edge' + (e.cls ? ' ' + e.cls : ''));
    if (e.arrow) p.setAttribute('marker-end', 'url(#topo-ar)');
    gEdges.appendChild(p);
    let label = null;
    if (e.label) {
      label = text(e.lx, e.ly, e.label, 'topo-label' + (e.small ? ' xs' : ''));
      label.setAttribute('text-anchor', e.anchor || 'middle');
      gLabels.appendChild(label);
    }
    edgeEls.push({ p, label, from: e.from, to: e.to, cls: e.cls });
  });

  nodes.forEach(n => {
    const wrap = el('g', { 'data-id': n.id }, 'topo-node');
    wrap.style.setProperty('--node-color', COLORS[n.type]);
    wrap.appendChild(el('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 7 }, SHAPE[n.type]));
    const left = n.align === 'left';
    const tx = left ? n.x + 16 : n.x + n.w / 2;
    const tcls = left ? 't-strong' : 't-strong t-c';
    const lcls = left ? 'lbl' : 'lbl t-c';
    wrap.appendChild(text(tx, n.y + 19, n.title, tcls));
    (n.lines || []).forEach((line, i) => {
      wrap.appendChild(text(tx, n.y + 35 + 14 * i, line, lcls));
    });
    gNodes.appendChild(wrap);
    items.push({ el: wrap, data: n });
  });

  // ---- entrance ----
  function animateIn() {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const groupEls = items.filter(i => i.el.classList.contains('topo-group'));
    const nodeEls = items.filter(i => i.el.classList.contains('topo-node'));
    groupEls.forEach((g, i) => setTimeout(() => g.el.classList.add('visible'), i * 120));
    nodeEls.forEach((n, i) => setTimeout(() => n.el.classList.add('visible'), 200 + i * 45));
    const edgeStart = reduce ? 0 : 200 + nodeEls.length * 45;
    edgeEls.forEach((e, i) => {
      const drawable = !e.cls && !reduce;
      if (drawable) {
        const len = e.p.getTotalLength();
        e.p.style.strokeDasharray = len;
        e.p.style.strokeDashoffset = len;
        e.p.style.transition = 'stroke-dashoffset 0.5s ease, stroke 0.15s ease, opacity 0.6s ease';
      }
      setTimeout(() => {
        e.p.classList.add('shown');
        if (drawable) e.p.style.strokeDashoffset = 0;
        if (e.label) e.label.classList.add('shown');
      }, edgeStart + i * 40);
    });
    // clear the dash inline styles once drawn so highlight/dim look right
    setTimeout(() => edgeEls.forEach(e => {
      if (!e.cls) { e.p.style.strokeDasharray = ''; e.p.style.strokeDashoffset = ''; e.p.style.transition = ''; }
    }), edgeStart + edgeEls.length * 40 + 700);
  }

  // ---- hover: light the edges that touch this box ----
  const GROUP_OF = {};
  nodes.forEach(n => {
    if (['vm100', 'ct316', 'ct103', 'book5host'].includes(n.id)) GROUP_OF[n.id] = 'book5';
    if (['vm101', 'vm111', 'mediapool', 'towerhost'].includes(n.id)) GROUP_OF[n.id] = 'tower';
  });
  const FLEET = ['pocket', 'phone', 'tablet', 'go', 'mac'];

  function touches(edge, id) {
    const ids = [id];
    if (GROUP_OF[id]) ids.push(GROUP_OF[id]);
    if (FLEET.includes(id)) ids.push('fleet');
    return ids.includes(edge.from) || ids.includes(edge.to);
  }
  function setHover(id, color) {
    edgeEls.forEach(e => {
      const hit = id && touches(e, id);
      e.p.classList.toggle('highlight', !!hit);
      e.p.classList.toggle('dim', !!id && !hit);
      if (hit) e.p.style.setProperty('--edge-color', color); else e.p.style.removeProperty('--edge-color');
      if (e.label) { e.label.classList.toggle('highlight', !!hit); e.label.classList.toggle('dim', !!id && !hit); }
    });
  }
  items.forEach(({ el: g, data }) => {
    g.addEventListener('mouseenter', () => setHover(data.id, COLORS[data.type]));
    g.addEventListener('mouseleave', () => setHover(null));
  });

  // ---- detail panel ----
  const panel = document.getElementById('detail-panel');
  const panelTitle = document.getElementById('detail-title');
  const panelType = document.getElementById('detail-type');
  const panelDesc = document.getElementById('detail-desc');
  const panelSpecs = document.getElementById('detail-specs');
  const closeBtn = document.getElementById('detail-close');
  let selected = null;

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function openPanel(item) {
    if (selected) selected.el.classList.remove('selected');
    selected = item;
    item.el.classList.add('selected');
    const d = item.data;
    panelTitle.textContent = d.title;
    panelType.textContent = TYPE_LABEL[d.type] || d.type;
    panelType.style.color = COLORS[d.type];
    panelDesc.textContent = d.desc || '';
    panelSpecs.innerHTML = (d.specs || []).map(s =>
      `<div class="detail-spec"><span class="detail-spec-label">${esc(s.label)}</span><span class="detail-spec-value">${esc(s.value)}</span></div>`
    ).join('');
    panel.classList.add('open');
  }
  function closePanel() {
    panel.classList.remove('open');
    if (selected) { selected.el.classList.remove('selected'); selected = null; }
  }
  items.forEach(item => {
    item.el.addEventListener('click', ev => { ev.stopPropagation(); openPanel(item); });
  });
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('click', e => { if (!panel.contains(e.target)) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', animateIn);
  else animateIn();
})();
