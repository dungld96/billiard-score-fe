import React from 'react';
import { Table } from 'antd';

export default function HistoryTable({ updates = [], players = [] }) {
  if (!players.length) return null;

  const perRow = players.length;
  const rows = [];
  for (let i = 0; i < updates.length; i += perRow) {
    const slice = updates.slice(i, i + perRow);
    const row = { key: i/perRow + 1, round: (i/perRow) + 1 };
    slice.forEach(s => { row[s.player_id] = s.delta; });
    rows.push(row);
  }

  const columns = [
    { title: 'Ván', dataIndex: 'round', key: 'round', width: 60 },
    ...players.map(p => ({
      title: p.name,
      dataIndex: p.id,
      key: p.id,
      render: (val) => val ?? ''
    }))
  ];

  return <Table dataSource={rows} columns={columns} pagination={false} />;
}
