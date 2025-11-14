import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Button } from 'antd';
import GamesTable from './components/GamesTable';
import LoadingOverlay from './components/LoadingOverlay';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function App() {
  return (
    <Layout className="page">
      <Header className="page-header">
        <Title level={4} style={{ color: '#fff', margin: 0 }}>Đưa hết tiền đây!</Title>
      </Header>
      <Content className="page-content">
        <LoadingOverlay />
        <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: '16px' }}>
          <div style={{ marginBottom: "16px" }}>
            <Link to="/create"><Button type="primary" size="large">Tạo game mới</Button></Link>
          </div>
          <div >
            <Title level={3} style={{ marginBottom: "16px" }}>Các cuộc đã mất tiền</Title>
            <GamesTable />

          </div>

        </div>
      </Content>
    </Layout>
  );
}
