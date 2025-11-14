import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { subscribe } from '../services/loadingService'

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsub = subscribe(setLoading)
    return () => unsub()
  }, [])

  if (!loading) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <Spin size="large" />
    </div>
  )
}
