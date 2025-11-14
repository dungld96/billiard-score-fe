import React from 'react';
import { Table } from 'antd';

export default function HistoryTable({ updates = [], players = [] }) {
  if (!players.length) return null;
  const perRow = players.length;
  const rows = [];

  for (let i = 0; i < updates.length; i += perRow) {
    const slice = updates.slice(i, i + perRow);
    const row = { key: i / perRow + 1, round: (i / perRow) + 1 };
    slice.forEach(s => { row[s.player_id] = s.delta; row["created_at"] = s.created_at });
    rows.push(row);
  }

  const columns = [
    { title: 'Ván', dataIndex: 'round', key: 'round', width: 60 },
    ...players.map(p => ({
      title: p.player.name,
      dataIndex: p.player.id,
      key: p.player.id,
      render: (val) => val ?? ''
    })),
    { title: 'Thời gian', dataIndex: 'created_at', key: 'round' },
  ];

  return <Table dataSource={rows} columns={columns} pagination={false} />;
}
