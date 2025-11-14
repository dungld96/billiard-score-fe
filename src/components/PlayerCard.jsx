import React from 'react';
import { Card, Avatar, Typography } from 'antd';

const { Title, Text } = Typography;

export default function PlayerCard({ player }) {
  console.log( player );
  return (
    <Card className="player-card">
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        <Avatar size={48}>{player?.player?.name?.[0]?.toUpperCase() || 'U'}</Avatar>
        <Text strong style={{ marginTop: 8 }}>{player?.player?.name}</Text>
        <Title level={2} style={{ marginTop: 8 }}>{player?.score}</Title>
      </div>
    </Card>
  );
}
