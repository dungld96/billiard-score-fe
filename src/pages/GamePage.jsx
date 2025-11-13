import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGame, applyDelta, addPlayer, undo } from '../api';
import { Row, Col, Card, InputNumber, Button, Space, Input, Typography, message } from 'antd';
import PlayerCard from '../components/PlayerCard';
import HistoryTable from '../components/HistoryTable';

const { Title } = Typography;

export default function GamePage(){
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [deltas, setDeltas] = useState({});
  const [newName, setNewName] = useState('');

  const fetchData = async () => {
    const res = await getGame(id);
    if (res?.error) { message.error(res.error); return; }
    setGame(res.game);
    setPlayers(res.players || []);
    setUpdates(res.updates || []);
  };

  useEffect(()=> { fetchData(); }, [id]);

  const handleApply = async (playerId) => {
    const v = Number(deltas[playerId] || 0);
    if (Number.isNaN(v)) { message.warn('Nhập số hợp lệ'); return; }
    await applyDelta(id, playerId, v);
    setDeltas(prev => ({ ...prev, [playerId]: '' }));
    await fetchData();
  };

  const handleAddPlayer = async () => {
    if (!newName.trim()) { message.warn('Nhập tên'); return; }
    await addPlayer(id, newName.trim());
    setNewName('');
    await fetchData();
  };

  const handleUndo = async () => {
    await undo(id);
    await fetchData();
  };

  return (
    <div className="container">
      <Title level={4}>{game?.title || 'Game'} <small>({players.length} players)</small></Title>

      <Row gutter={[12,12]} className="scoreboard-row">
        {players.map(p => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <PlayerCard player={p} />
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={5}>Nhập điểm ván đấu tiếp theo:</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          {players.map(p => (
            <div key={p.id} style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width: 100 }}>{p.name}</div>
              <InputNumber
                style={{ flex: 1 }}
                value={deltas[p.id]}
                onChange={val => setDeltas(prev => ({ ...prev, [p.id]: val }))}
                placeholder="Nhập điểm (âm hoặc dương)"
              />
              <Button onClick={() => handleApply(p.id)}>Nhập điểm</Button>
            </div>
          ))}

          <div style={{ display:'flex', gap:8 }}>
            <Input placeholder="Thêm tên (nếu cần)" value={newName} onChange={e=>setNewName(e.target.value)} />
            <Button onClick={handleAddPlayer}>Thêm</Button>
            <Button onClick={handleUndo}>Undo last</Button>
            <Button type="link" style={{ marginLeft:'auto' }} onClick={()=>{ navigator.clipboard?.writeText(window.location.href); message.success('Link copied'); }}>Copy share link</Button>
          </div>
        </Space>
      </Card>

      <div style={{ marginTop: 16 }}>
        <Title level={5}>Lịch sử</Title>
        <HistoryTable updates={updates} players={players} />
      </div>
    </div>
  );
}
