// Homelab topology data and interactions
(function () {
  'use strict';

  // Color palette
  const COLORS = {
    physical: '#50fa7b',
    vm: '#8be9fd',
    service: '#ffb86c',
    device: '#bd93f9',
    cloud: '#ff79c6'
  };

  // Node definitions (NO real IPs or credentials)
  const nodes = [
    // Cloud
    { id: 'twingate', label: 'Twingate', type: 'cloud', x: 400, y: 40, w: 120, h: 40, icon: '\u2601',
      desc: 'Zero-trust network access. Connects all devices across any network without traditional VPN.', specs: [
        { label: 'Type', value: 'ZTNA Mesh' }, { label: 'Devices', value: '10+' }
      ]},

    // Physical infrastructure
    { id: 'book5', label: 'book5', type: 'physical', x: 200, y: 140, w: 120, h: 40, icon: '\uD83D\uDCBB',
      desc: 'Samsung Galaxy Book5 Pro running Proxmox. Primary cluster node, hosts VMs and manages SSH tunnels.', specs: [
        { label: 'Role', value: 'Proxmox Node' }, { label: 'Hardware', value: 'Galaxy Book5 Pro' }, { label: 'Services', value: 'SSH hub, watchdogs' }
      ]},
    { id: 'tower', label: 'tower', type: 'physical', x: 400, y: 140, w: 120, h: 40, icon: '\uD83D\uDDFC',
      desc: 'Lenovo ThinkStation P510 running Proxmox. Secondary cluster node, workhorse for heavy VMs.', specs: [
        { label: 'Role', value: 'Proxmox Node' }, { label: 'Hardware', value: 'ThinkStation P510' }, { label: 'Network', value: '2.5 GbE' }
      ]},
    { id: 'pihole', label: 'pihole', type: 'physical', x: 600, y: 140, w: 120, h: 40, icon: '\uD83E\uDDE0',
      desc: 'Raspberry Pi running Pi-hole for network-wide DNS ad blocking and local DNS resolution.', specs: [
        { label: 'Role', value: 'DNS / Ad Blocking' }, { label: 'Hardware', value: 'Raspberry Pi 2' }, { label: 'Extra', value: 'QDevice for cluster quorum' }
      ]},

    // VMs
    { id: 'omarchy', label: 'omarchy', type: 'vm', x: 180, y: 260, w: 120, h: 40, icon: '\uD83D\uDDA5',
      desc: 'Arch Linux VM with a full desktop environment. Daily driver for development and tinkering.', specs: [
        { label: 'OS', value: 'Arch Linux' }, { label: 'Host', value: 'book5' }, { label: 'Use', value: 'Desktop / Dev' }
      ]},
    { id: 'ubuntu', label: 'ubuntu', type: 'vm', x: 420, y: 260, w: 120, h: 40, icon: '\uD83D\uDC27',
      desc: 'Ubuntu Server VM running Docker. Hosts all self-hosted services including media, AI, and security.', specs: [
        { label: 'OS', value: 'Ubuntu Server' }, { label: 'Host', value: 'tower' }, { label: 'Runtime', value: 'Docker' }
      ]},

    // Services (on ubuntu)
    { id: 'plex', label: 'Plex', type: 'service', x: 220, y: 380, w: 100, h: 36, icon: '\u25B6',
      desc: 'Media server for streaming movies, TV shows, and music across all devices.', specs: [
        { label: 'Type', value: 'Media Server' }, { label: 'Host', value: 'ubuntu (Docker)' }
      ]},
    { id: 'jellyfin', label: 'Jellyfin', type: 'service', x: 340, y: 380, w: 100, h: 36, icon: '\uD83C\uDFAC',
      desc: 'Open-source media server. Plex alternative with no subscription required.', specs: [
        { label: 'Type', value: 'Media Server' }, { label: 'Host', value: 'ubuntu (Docker)' }
      ]},
    { id: 'ollama', label: 'Ollama', type: 'service', x: 460, y: 380, w: 100, h: 36, icon: '\uD83E\uDD16',
      desc: 'Local AI model inference. Runs LLMs for AI-assisted development and experimentation.', specs: [
        { label: 'Type', value: 'AI / LLM' }, { label: 'Host', value: 'ubuntu (Docker)' }
      ]},
    { id: 'frigate', label: 'Frigate', type: 'service', x: 580, y: 380, w: 100, h: 36, icon: '\uD83D\uDCF7',
      desc: 'NVR with real-time AI object detection. Monitors security cameras with local processing.', specs: [
        { label: 'Type', value: 'NVR / Security' }, { label: 'Host', value: 'ubuntu (Docker)' }, { label: 'Detection', value: 'AI object detection' }
      ]},

    // Client devices
    { id: 'mac', label: 'Mac', type: 'device', x: 80, y: 510, w: 100, h: 36, icon: '\uD83C\uDF4E',
      desc: 'Primary development machine. Runs Claude Code, Neovim, and manages all projects.', specs: [
        { label: 'Role', value: 'Dev / Staging' }, { label: 'Tunnel', value: 'Persistent SSH' }
      ]},
    { id: 'phone', label: 'Phone', type: 'device', x: 200, y: 510, w: 100, h: 36, icon: '\uD83D\uDCF1',
      desc: 'Android device with Termux. SSH access to entire homelab from anywhere.', specs: [
        { label: 'Access', value: 'Termux + SSH' }, { label: 'Tunnel', value: 'Persistent SSH' }
      ]},
    { id: 'tablet', label: 'Tablet', type: 'device', x: 320, y: 510, w: 100, h: 36, icon: '\uD83D\uDCF2',
      desc: 'Samsung Galaxy Tab S9 FE. On-demand SSH tunnel to save battery.', specs: [
        { label: 'Hardware', value: 'Galaxy Tab S9 FE' }, { label: 'Tunnel', value: 'On-demand' }
      ]},
    { id: 'pixelbook', label: 'Pixelbook', type: 'device', x: 440, y: 510, w: 100, h: 36, icon: '\uD83D\uDCBB',
      desc: 'Pixelbook Go running Linux. Lightweight portable dev machine.', specs: [
        { label: 'Hardware', value: 'Pixelbook Go' }, { label: 'Tunnel', value: 'Persistent SSH' }
      ]},
    { id: 'pc', label: 'PC', type: 'device', x: 560, y: 510, w: 100, h: 36, icon: '\uD83D\uDDA5',
      desc: 'Windows PC with WSL Ubuntu. Production deployment target for scripts.', specs: [
        { label: 'Role', value: 'Production / WSL' }, { label: 'Tunnel', value: 'Persistent SSH' }
      ]}
  ];

  // Connections between nodes
  const connections = [
    // Twingate to physical
    { from: 'twingate', to: 'book5' },
    { from: 'twingate', to: 'tower' },
    { from: 'twingate', to: 'pihole' },
    // Physical to VMs
    { from: 'book5', to: 'omarchy' },
    { from: 'tower', to: 'ubuntu' },
    // Ubuntu to services
    { from: 'ubuntu', to: 'plex' },
    { from: 'ubuntu', to: 'jellyfin' },
    { from: 'ubuntu', to: 'ollama' },
    { from: 'ubuntu', to: 'frigate' },
    // Devices to twingate
    { from: 'twingate', to: 'mac' },
    { from: 'twingate', to: 'phone' },
    { from: 'twingate', to: 'tablet' },
    { from: 'twingate', to: 'pixelbook' },
    { from: 'twingate', to: 'pc' }
  ];

  // Build node lookup
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // SVG helpers
  const svgNS = 'http://www.w3.org/2000/svg';
  const connGroup = document.getElementById('connections');
  const nodeGroup = document.getElementById('nodes');

  function getCenter(node) {
    return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
  }

  function getColor(type) {
    return COLORS[type] || '#6272a4';
  }

  // Draw connections
  const lineElements = [];
  connections.forEach(conn => {
    const from = nodeMap[conn.from];
    const to = nodeMap[conn.to];
    if (!from || !to) return;
    const c1 = getCenter(from);
    const c2 = getCenter(to);

    // Static line
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', c1.x);
    line.setAttribute('y1', c1.y);
    line.setAttribute('x2', c2.x);
    line.setAttribute('y2', c2.y);
    line.setAttribute('stroke', '#2a2a2a');
    line.classList.add('topo-line');
    line.dataset.from = conn.from;
    line.dataset.to = conn.to;

    // Calculate length for dash animation
    const len = Math.sqrt((c2.x - c1.x) ** 2 + (c2.y - c1.y) ** 2);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;

    connGroup.appendChild(line);

    // Flow line (dashed animated)
    const flow = document.createElementNS(svgNS, 'line');
    flow.setAttribute('x1', c1.x);
    flow.setAttribute('y1', c1.y);
    flow.setAttribute('x2', c2.x);
    flow.setAttribute('y2', c2.y);
    flow.setAttribute('stroke', '#2a2a2a');
    flow.classList.add('topo-line-flow');
    flow.dataset.from = conn.from;
    flow.dataset.to = conn.to;
    connGroup.appendChild(flow);

    lineElements.push({ line, flow, from: conn.from, to: conn.to });
  });

  // Draw nodes
  const nodeElements = [];
  nodes.forEach((node, idx) => {
    const g = document.createElementNS(svgNS, 'g');
    g.classList.add('topo-node');
    g.dataset.id = node.id;
    g.style.setProperty('--node-color', getColor(node.type));

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', node.x);
    rect.setAttribute('y', node.y);
    rect.setAttribute('width', node.w);
    rect.setAttribute('height', node.h);
    rect.setAttribute('fill', '#161616');
    rect.setAttribute('stroke', getColor(node.type));
    g.appendChild(rect);

    // Icon
    const icon = document.createElementNS(svgNS, 'text');
    icon.classList.add('node-icon');
    icon.setAttribute('x', node.x + 16);
    icon.setAttribute('y', node.y + node.h / 2 + 5);
    icon.textContent = node.icon;
    g.appendChild(icon);

    // Label
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', node.x + node.w / 2 + 6);
    label.setAttribute('y', node.y + node.h / 2 + 4);
    label.textContent = node.label;
    g.appendChild(label);

    nodeGroup.appendChild(g);
    nodeElements.push({ el: g, node, idx });
  });

  // Staggered fade-in on load
  function animateIn() {
    nodeElements.forEach(({ el, idx }) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, idx * 80);
    });

    // Animate lines after nodes start appearing
    setTimeout(() => {
      lineElements.forEach(({ line, flow }, i) => {
        setTimeout(() => {
          line.classList.add('animated');
          line.setAttribute('stroke', '#3a3a3a');
          setTimeout(() => {
            flow.classList.add('animated');
            flow.setAttribute('stroke', '#3a3a3a');
          }, 400);
        }, i * 50);
      });
    }, nodes.length * 40);
  }

  // Hover highlighting
  nodeElements.forEach(({ el, node }) => {
    el.addEventListener('mouseenter', () => {
      lineElements.forEach(({ line, flow, from, to }) => {
        if (from === node.id || to === node.id) {
          line.classList.add('highlight');
          line.setAttribute('stroke', getColor(node.type));
          flow.classList.add('highlight');
          flow.setAttribute('stroke', getColor(node.type));
        }
      });
    });
    el.addEventListener('mouseleave', () => {
      lineElements.forEach(({ line, flow }) => {
        line.classList.remove('highlight');
        line.setAttribute('stroke', '#3a3a3a');
        flow.classList.remove('highlight');
        flow.setAttribute('stroke', '#3a3a3a');
      });
    });
  });

  // Detail panel
  const panel = document.getElementById('detail-panel');
  const panelTitle = document.getElementById('detail-title');
  const panelType = document.getElementById('detail-type');
  const panelDesc = document.getElementById('detail-desc');
  const panelSpecs = document.getElementById('detail-specs');
  const closeBtn = document.getElementById('detail-close');

  function openPanel(node) {
    panelTitle.textContent = node.label;
    panelType.textContent = node.type;
    panelType.style.color = getColor(node.type);
    panelDesc.textContent = node.desc;
    panelSpecs.innerHTML = (node.specs || []).map(s =>
      `<div class="detail-spec"><span class="detail-spec-label">${s.label}</span><span class="detail-spec-value">${s.value}</span></div>`
    ).join('');
    panel.classList.add('open');
  }

  function closePanel() {
    panel.classList.remove('open');
  }

  nodeElements.forEach(({ el, node }) => {
    el.addEventListener('click', () => openPanel(node));
  });

  closeBtn.addEventListener('click', closePanel);

  // Close panel on click outside
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !e.target.closest('.topo-node')) {
      closePanel();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  // Start animations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateIn);
  } else {
    animateIn();
  }
})();
