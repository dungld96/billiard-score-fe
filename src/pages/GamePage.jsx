import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGame, applyDelta, undo } from '../api';
import { Row, Col, Card, InputNumber, Button, Space, Typography, message } from 'antd';
import PlayerCard from '../components/PlayerCard';
import HistoryTable from '../components/HistoryTable';
import Logo from "../image/logo.png"
import { show, hide } from '../services/loadingService'
import LoadingOverlay from '../components/LoadingOverlay';

const { Title } = Typography;

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [deltas, setDeltas] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()

  const fetchData = async () => {
    show();
    const res = await getGame(id);
    hide();
    if (res?.error) { messageApi.error(res.error); return; }
    setGame(res.game);
    setPlayers(res.players || []);
    setUpdates(res.updates || []);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleApply = async (gameId) => {
    // validate sum of scores equals 0
    const total = Object.values(deltas).reduce((s, v) => s + (Number(v) || 0), 0);
    if (total !== 0) {
      messageApi.open({
        type: 'error',
        content: 'Tổng điểm phải bằng 0',
      });
      return;
    }

    show();
    const deltasArray = Object.entries(deltas).map(([playerId, delta]) => ({ playerId, delta: Number(delta) || 0 }));
    try {
      await applyDelta(gameId, deltasArray, '');
      setDeltas({});
      await fetchData();
    } finally {
      hide();
    }
  };


  const handleUndo = async () => {
    await undo(id);
    await fetchData();
  };

  return (
    <div className="container" style={{ marginTop: '16px', padding: '16px' }}>
      {contextHolder}
      <LoadingOverlay />
      <div style={{ display: "flex", justifyContent: 'center' }}>
        <img src={Logo} alt="Logo" style={{ height: 64 }} onClick={() => navigate("/")} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: "16px" }}>
        <Title level={5} style={{ fontSize: "20px" }}>{game?.title || 'Game'} <small>({players.length} players)</small></Title>
        {/* <Button type="link" onClick={() => { navigator.clipboard?.writeText(window.location.href); messageApi.success('Link copied'); }}>Copy share link</Button> */}
        <Button type="link" onClick={() => { fetchData() }}>Làm mới</Button>
      </div>
      <Row gutter={[12, 12]} className="scoreboard-row">
        {players.map(p => (
          <Col xs={8} sm={6} key={p.id}>
            <PlayerCard player={p} />
          </Col>
        ))}
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={5} style={{ fontSize: "18px" }} >Nhập điểm ván đấu tiếp theo:</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>{players.map(p => (
              <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ minWidth: 50 }}>{p?.player?.name}</div>
                <InputNumber
                  style={{ width: "100px" }}
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
        <div style={{ display: "flex", justifyContent: "space-between" }}><Title level={5} style={{ fontSize: "18px" }}>Lịch sử</Title>
          <div style={{ display: 'flex', gap: 8 }}>
          </div></div>
        <HistoryTable updates={updates} players={players} />
      </div>
    </div>
  );
}
