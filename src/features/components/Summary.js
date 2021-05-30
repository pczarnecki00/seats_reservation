import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { seatsSelected } from '../slices/seatSlices';
import 'antd/dist/antd.css';
import {
    Space, List, Typography
} from "antd";



export default function Summary() {

    const selectedSeat = useSelector(seatsSelected);

    return (
        <div>
            {selectedSeat.length === 0 ? <Redirect path to="/error" /> :
                <Space direction="vertical" style={{ marginTop: 50, padding: 20 }}>
                    <Typography.Title level={2}>Twoja rezerwacja przebiegła pomyślnie!</Typography.Title>
                    <List
                        header={<div style={{ fontWeight: "500", fontSize: "18px"}}>{selectedSeat.length === 1 ? 'Twoje miejsce to:' : 'Twoje miejsca to: '}</div>}
                        dataSource={selectedSeat}
                        renderItem={item => (
                            <List.Item style={{ border: "none", padding: "0px" }}>
                                {`-rząd x${item.cords.x + 1}, miejsce y${item.cords.y + 1} (${item.id})`}
                            </List.Item>
                        )}
                    />
                    <Typography.Text style={{ fontSize: "16px" }} strong>Dziękujemy! W razie problemów prosimy o kontakt z działem administracji.</Typography.Text>
                </Space>}
        </div>
    )
}