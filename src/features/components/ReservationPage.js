import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    seatsAmount,
    closeSeat,
    seatsNextTo,
    numberOfSeats,
} from '../slices/ticketSlices';

import { fetchSeats } from '../slices/seatSlices';
import {
    message,
    Button,
    Space,
    Typography,
    InputNumber,
    Switch,
    
} from 'antd';
import 'antd/dist/antd.css';


export default function ReservationPage(props) {
    const dispatch = useDispatch();
    const isClose = useSelector(seatsNextTo);
    const amountOfSeats = useSelector(numberOfSeats);
    const { Title, Text } = Typography


    const onChange = (value) => {
        if (typeof value === "number") {

            dispatch(seatsAmount(value))

        }
        else {

            dispatch(closeSeat());

        }
    }

    const sendRequest = () => {

        if (amountOfSeats > 5 && isClose) {

            message.info('Maksymalna ilość miejsc w rzędzie obok siebie to : 5');

        } else {
            dispatch(fetchSeats());
            props.history.push('/seats-view');
        }
    };

    return (
        <div>
            <Space align="center" style={{ maxWidth: 1140, paddingTop: 200 }}>
                <Space direction="vertical" align="center" style={{ padding: 30, border: "1px solid #000", boxShadow: "0px 5px 20px 0px rgba(0, 0, 0, 0.61)" }}>
                    <Title level={3}>Strona rezerwacji biletów online</Title>
                    <Space direction="horizontal">
                        <Text>Ilość biletów:</Text>
                        <InputNumber min="1" defaultValue={amountOfSeats} onChange={onChange} />
                    </Space>
                    <Space>
                        <Text direction="horizontal">Czy miejsca mają być obok siebie? </Text>
                        <Switch defaultChecked={isClose} onChange={onChange}></Switch>
                    </Space>
                    <Button type="primary" style={{marginTop: "20px"}} onClick={sendRequest}>Wybierz miejsca</Button>

                </Space>
            </Space>
        </div>

    );
}


