import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGame, applyDelta, undo } from '../api';
import { Row, Col, Card, InputNumber, Button, Space, Input, Typography, message } from 'antd';
import PlayerCard from '../components/PlayerCard';
import HistoryTable from '../components/HistoryTable';

const { Title } = Typography;

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [deltas, setDeltas] = useState({});

  const fetchData = async () => {
    const res = await getGame(id);
    if (res?.error) { message.error(res.error); return; }
    setGame(res.game);
    setPlayers(res.players || []);
    setUpdates(res.updates || []);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleApply = async (gameId) => {
    const deltasArray = Object.entries(deltas).map(([playerId, delta]) => ({ playerId, delta }));
    await applyDelta(gameId, deltasArray, '');
    setDeltas({});
    await fetchData();
  };


  const handleUndo = async () => {
    await undo(id);
    await fetchData();
  };
  console.log(players);

  return (
    <div className="container" style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={4}>{game?.title || 'Game'} <small>({players.length} players)</small></Title>
        <Button type="link" onClick={() => { navigator.clipboard?.writeText(window.location.href); message.success('Link copied'); }}>Copy share link</Button>
      </div>
      <Row gutter={[12, 12]} className="scoreboard-row">
        {players.map(p => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <PlayerCard player={p} />
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={5}>Nhập điểm ván đấu tiếp theo:</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, paddingRight: "80px" }}>{players.map(p => (
              <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 100 }}>{p?.player?.name}</div>
                <InputNumber
                  style={{ flex: 1 }}
                  value={deltas[p?.player?.id]}
                  onChange={val => setDeltas(prev => ({ ...prev, [p?.player?.id]: val }))}
                  placeholder="Nhập điểm"
                />
              </div>
            ))}</div>
            <Button onClick={() => handleApply(game.id)} style={{ height: "100px", width: "100px" }}>Lưu điểm</Button>
          </div>



        </Space>
      </Card>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Title level={5}>Lịch sử</Title>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={handleUndo}>Undo last</Button>
          </div></div>
        <HistoryTable updates={updates} players={players} />
      </div>
    </div>
  );
}
