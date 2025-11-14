import React, { useEffect, useState } from 'react'
import { Table, Spin, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../api'
import dayjs from 'dayjs'

export default function GamesTable() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getGames()
      .then(res => {
        if (res?.error) { message.error(res.error); setData([]); return }
        // ensure each row has a key for the table
        const list = Array.isArray(res) ? res : (res.games || [])
        setData(list.map(g => ({ ...g, key: g.id || g._id })))
      })
      .catch(err => { console.error(err); message.error('Failed to load games') })
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: t => t || '-' },
    { title: 'Players', dataIndex: 'players', key: 'players', render: p => (Array.isArray(p) ? p.length : (p?.length || 0)) },
    { title: 'Ngày', dataIndex: 'created_at', key: 'created_at', render: d => d ? dayjs(d).format("DD/MM/YYYY HH:mm") : '-' }
  ]

  return (
    <div>
      {loading ? <Spin /> : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => { navigate(`/game/${record.id || record._id || record.key}`) }
          })}
          rowClassName={() => 'clickable-row'}
        />
      )}
    </div>
  )
}
