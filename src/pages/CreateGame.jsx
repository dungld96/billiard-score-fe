import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, addPlayer } from '../api';
import { Card, Input, Button, Space, InputNumber, Tag, message } from 'antd';

export default function CreateGame(){
  const [max, setMax] = useState(3);
  const [title, setTitle] = useState('');
  const [newName, setNewName] = useState('');
  const [names, setNames] = useState([]);
  const navigate = useNavigate();

  const addName = () => {
    if (!newName.trim()) { message.warn('Nhập tên'); return; }
    if (names.length >= 5) { message.warn('Tối đa 5 người'); return; }
    setNames([...names, newName.trim()]);
    setNewName('');
  };

  const start = async () => {
    if (names.length < 2) { message.warn('Cần ít nhất 2 người'); return; }
    const g = await createGame(max, title);
    if (g?.error) { message.error(g.error); return; }
    for (const n of names) {
      const r = await addPlayer(g.id, n);
      if (r?.error) { message.error('Lỗi thêm player'); }
    }
    message.success('Game created');
    navigate(`/game/${g.id}`);
  };

  return (
    <div className="container card-wrap">
      <Card title="Tạo game mới">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Tiêu đề (tùy chọn)" value={title} onChange={e=>setTitle(e.target.value)} />
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div>Số người</div>
            <InputNumber min={2} max={5} value={max} onChange={v=>setMax(v)} />
          </div>

          <div style={{ display:'flex', gap:8 }}>
            <Input placeholder="Tên người chơi" value={newName} onChange={e=>setNewName(e.target.value)} onPressEnter={addName} />
            <Button onClick={addName}>Thêm</Button>
          </div>

          <div>
            {names.map((n,i)=>(<Tag key={i}>{i+1}. {n}</Tag>))}
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Button type="primary" onClick={start}>Bắt đầu game</Button>
          </div>
        </Space>
      </Card>
    </div>
  );
}
