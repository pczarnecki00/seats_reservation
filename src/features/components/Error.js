import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Typography, Space } from "antd";


export default function Error() {


    return (
        <Space direction="vertical" align="center" style={{ marginTop: 200, width: "100%"}}>
            <Typography.Title level={3}>Coś poszło nie tak, wróć do<Link to="/"> wyboru biletów</Link>.</Typography.Title>
        </Space>
    )
}
