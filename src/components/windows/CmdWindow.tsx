'use client';

import { useEffect, useRef, useState } from 'react';

const BOOT_LINES = [
  'Microsoft Windows [Version 6.1.7601]',
  'Copyright (c) 2009 Microsoft Corporation.  All rights reserved.',
  '',
  'C:\\Users\\Visitor>',
];

const DIR_OUTPUT = [
  ' Directory of C:\\Users\\Visitor',
  '',
  '04/28/2026  10:00 AM    <DIR>          .',
  '04/28/2026  10:00 AM    <DIR>          ..',
  '04/28/2026  09:15 AM        2,048,576  resume.pdf',
  '04/28/2026  09:20 AM       16,777,216  projects.exe',
  '04/28/2026  08:00 AM           32,768  coffee.exe',
  '04/28/2026  08:01 AM               0  imposter_syndrome.dll',
  '04/28/2026  07:45 AM        1,048,576  courseconnect.ai',
  '04/28/2026  07:30 AM          512,000  gaitguard.ipa',
  '               6 File(s)     20,419,036 bytes',
  '               2 Dir(s)   Never Enough Free Space',
];

const IPCONFIG_OUTPUT = [
  'Windows IP Configuration',
  '',
  'Ethernet adapter Local Area Connection:',
  '   Connection-specific DNS Suffix . : adamosman.dev',
  '   IPv4 Address. . . . . . . . . . . : 192.168.1.1',
  '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
  '   Default Gateway . . . . . . . . . : adamosman.dev',
  '',
  'Wireless LAN adapter Wi-Fi:',
  '   IPv4 Address. . . . . . . . . . . : 10.0.0.42',
  '   DNS Servers . . . . . . . . . . . : 8.8.8.8',
  '                                        adamosman.dev',
];

const HELP_OUTPUT = [
  'Available commands:',
  '',
  '  dir          List directory contents',
  '  ipconfig     Display IP configuration',
  '  whoami       Display current user info',
  '  hire adam    Best command you can run',
  '  cls          Clear screen',
  '  help         Show this help message',
];

const HIRED_ART = [
  '  _   _ ___ ____  _____ ____  ',
  ' | | | |_ _|  _ \\| ____|  _ \\ ',
  ' | |_| || || |_) |  _| | | | |',
  ' |  _  || ||  _ <| |___| |_| |',
  ' |_| |_|___|_| \\_\\_____|____/ ',
  '',
  ' Adam Osman — Offer accepted. ',
  ' Start date: ASAP. Welcome aboard!',
];

function processCommand(input: string): string[] {
  const cmd = input.trim().toLowerCase();
  if (cmd === 'dir') return DIR_OUTPUT;
  if (cmd === 'ipconfig') return IPCONFIG_OUTPUT;
  if (cmd === 'help') return HELP_OUTPUT;
  if (cmd === 'hire adam') return HIRED_ART;
  if (cmd === 'whoami') return ['Adam Osman — Developer, Founder, Student'];
  if (cmd === 'cls') return ['__CLS__'];
  if (cmd === '') return [];
  return [`'${input.trim()}' is not recognized as an internal or external command.`];
}

export default function CmdWindow() {
  const [lines, setLines] = useState<string[]>(BOOT_LINES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = processCommand(input);
    if (result[0] === '__CLS__') {
      setLines(['C:\\Users\\Visitor>']);
    } else {
      setLines(prev => [
        ...prev.slice(0, -1),
        `C:\\Users\\Visitor>${input}`,
        ...result,
        'C:\\Users\\Visitor>',
      ]);
    }
    setInput('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: '#0c0c0c', color: '#cccccc',
        fontFamily: 'Consolas, "Courier New", monospace', fontSize: 13,
        padding: 8, cursor: 'text', userSelect: 'text',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: line.startsWith('C:\\') ? '#cccccc' : '#00cc00' }}>{line || ' '}</div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: 4 }}>
        <span style={{ color: '#cccccc', flexShrink: 0 }}>C:\Users\Visitor&gt;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          spellCheck={false}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#cccccc', fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: 13, caretColor: '#cccccc',
          }}
        />
      </form>
    </div>
  );
}
