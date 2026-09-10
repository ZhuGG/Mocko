const shapes={
 leaf:'<path d="M19 4C9 3 3 8 6 15c6 5 14-1 13-11Z"/><path d="M4 21 15 10M8 17l-1-5m5 0 5 1"/>',
 spark:'<path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7Z"/>',
 mushroom:'<path d="M3 13c0-6 4-10 9-10s9 4 9 10H3Zm6 0-1 8h8l-1-8"/><path d="M8 8h.01M15 7h.01M17 10h.01"/>',
 water:'<path d="M12 3S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
 fox:'<path d="m4 3 7 5h2l7-5-1 12-7 6-7-6-1-12Z"/><path d="m5 14 7 3 7-3M8 11h.01M16 11h.01m-5 6 1 2 1-2"/>',
 deer:'<path d="M8 10 5 6V2m0 4L2 4m14 6 3-4V2m0 4 3-2M7 10l5-2 5 2-1 8-4 4-4-4-1-8Z"/><path d="M9 13h.01M15 13h.01m-4 5 1 1 1-1"/>',
 book:'<path d="M12 6C8 3 4 4 2 5v15c3-2 7-2 10 0 3-2 7-2 10 0V5c-2-1-6-2-10 1Zm0 0v14"/>',
 sound:'<path d="m3 10 4 0 5-4v12l-5-4H3Zm13-2c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
 mute:'<path d="m3 10 4 0 5-4v12l-5-4H3Zm13-1 5 6m0-6-5 6"/>',
 settings:'<path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/><circle cx="12" cy="12" r="5"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 heart:'<path d="M20 5c-3-3-7-1-8 2-1-3-5-5-8-2-5 5 2 11 8 16 6-5 13-11 8-16Z"/>',
 moon:'<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
 home:'<path d="m3 11 9-8 9 8M5 10v11h5v-6h4v6h5V10"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'
};
export const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name]||shapes.spark}</svg>`;
