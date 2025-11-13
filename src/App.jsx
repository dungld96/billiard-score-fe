import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Button } from 'antd';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function App(){
  return (
    <Layout className="page">
      <Header className="page-header">
        <Title level={4} style={{ color: '#fff', margin: 0 }}>Billiard 9-ball Score</Title>
      </Header>
      <Content className="page-content">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Title level={3}>Welcome</Title>
          <Text>Mobile-first score tracker for 9-ball. Create game, add players, share the URL.</Text>
          <div style={{ marginTop: 24 }}>
            <Link to="/create"><Button type="primary" size="large">Tạo game mới</Button></Link>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
