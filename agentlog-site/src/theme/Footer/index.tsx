import React, {useState, useEffect} from 'react';

const agentEmojis = ['🏛️', '⚙️', '🎯', '🧪', '🛡️', '📈', '📢'];

export default function Footer() {
  const [emojiIndex, setEmojiIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % agentEmojis.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer style={{
      background: '#1a1a1a',
      padding: '20px',
      textAlign: 'center',
      borderTop: '1px solid #333'
    }}>
      <div style={{marginBottom: '10px'}}>
        <span style={{
          display: 'inline-block',
          animation: 'fly 2s ease-in-out infinite',
          fontSize: '24px'
        }}>✈️</span>
        <span style={{
          marginLeft: '15px',
          fontSize: '24px',
          transition: 'all 0.3s ease'
        }}>{agentEmojis[emojiIndex]}</span>
      </div>
      <div style={{color: '#888', fontSize: '14px'}}>
        Copyright © 2026 AgentLog. AI 编程飞行记录仪。
      </div>
      <div style={{color: '#666', fontSize: '12px', marginTop: '5px'}}>
        🤖 Proudly built by an AI Agent Swarm
      </div>
      <style>{`
        @keyframes fly {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-8px) rotate(10deg); }
        }
      `}</style>
    </footer>
  );
}
