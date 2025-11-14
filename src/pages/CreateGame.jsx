import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, getPlayers } from '../api';
import { Card, Input, Button, Space, Select, message } from 'antd';

export default function CreateGame() {
  const [title, setTitle] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const res = await getPlayers();
    if (res?.error) { message.error(res.error); return; }
    setPlayers(res || []);
  };


  const start = async () => {
    if (selectedIds.length < 2) { message.warn('Cần ít nhất 2 người'); return; }
    const g = await createGame(title, selectedIds);
    if (g?.error) { message.error(g.error); return; }
    message.success('Game created');
    navigate(`/game/${g?.game?.id}`);
  };

  return (
    <div className="container card-wrap">
      <Card title="Tạo game mới">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input placeholder="Tiêu đề (tùy chọn)" value={title} onChange={e => setTitle(e.target.value)} />
            <Select
            mode="multiple"
            placeholder="Chọn người chơi"
            value={selectedIds}
            onChange={setSelectedIds}
            maxTagCount="responsive"
            options={players.map(p => ({ label: p.name, value: p.id }))}
            style={{width: "100%"}}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={start}>Bắt đầu game</Button>
          </div>
        </Space>
      </Card>
    </div>
  );
}
