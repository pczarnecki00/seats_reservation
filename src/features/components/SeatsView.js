import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { seatsNextTo, numberOfSeats } from '../slices/ticketSlices';
import {
    setSelectedSeats,
    seatsTaken,
    seatsSelected,
    pendingFetch,
    removeSelectedSeat,
    setSeats,
    updateSeats
} from '../slices/seatSlices';
import { Redirect } from 'react-router-dom';
import loading from '../img/loading.gif'
import 'antd/dist/antd.css';
import {
    Space,
    Col,
    Row,
    Button,
    Typography,
    Layout,
    message,
} from "antd";

export default function SeatsView(props) {

    const [error, setError] = useState({
        status: false,
        message: ''
    });

    const dispatch = useDispatch();

    const seats = useSelector(seatsTaken);
    const load = useSelector(pendingFetch);
    const selectedSeat = useSelector(seatsSelected);
    const amountOfSeats = useSelector(numberOfSeats);
    const isClose = useSelector(seatsNextTo);

    let colsValue = seats?.map(obj=> obj.cords.y);
    let rowsValue = seats?.map(obj=> obj.cords.x);

    let colsAmount = Math.abs(Math.min(...colsValue) - Math.max(...colsValue)) + 1;
    let rowsAmount = Math.abs(Math.min(...rowsValue) - Math.max(...rowsValue)) + 1;
  

    let cols = [...Array(load? colsAmount : 1 ).keys()];
    let rows = [...Array(load? rowsAmount : 1 ).keys()];




    const styleFreeSeat = { background: '#0092ff', width: 50, height: 50, border: "1px solid #000" };
    const styleReserved = { background: 'grey', width: 50, height: 50, border: "1px solid #000" };
    const styleSelected = { background: 'orange', width: 50, height: 50, border: "1px solid #000" };
    const styleHidden = { background: '#fff', visibility: 'hidden', width: 50, height: 50, border: "1px solid #000" };



    const coordsCheck = (a, b) => {

        for (let i = 0; i < seats.length; i++) {
            if (a === seats[i].cords.x && b === seats[i].cords.y) {
                return true;
            };
        };
    };

    const reservationCheck = (a, b) => {

        for (let i = 0; i < seats.length; i++) {
            if (`s${a}${b}` === seats[i].id && seats[i].reserved) {
                return true;
            };
        };

    };

    const selectedSeatStyle = (a, b) => {

        for (let i = 0; i < selectedSeat.length; i++) {
            if (`s${a}${b}` === selectedSeat.map(obj => obj.id)[i]) {
                return true
            };
        };
    };

    const selectSeat = (value) => {

        if (selectedSeat.some(x => x.id === value)) {
            dispatch(removeSelectedSeat(value));
        } else if (selectedSeat.length < amountOfSeats) {
            dispatch(setSelectedSeats(value));
        };

    };

    const selectSeats = () => {
        let sequential = [];
        let freeSeats = seats.filter(obj => !obj.reserved);

        const isSequential = (x) => {

            if (sequential.length === 0) return true;
            return x.cords.y - 1 === sequential[sequential.length - 1].cords.y;

        };

        const lastCheck = (x) => {
            if (seats.filter(obj => !obj.reserved).length === 0) {
                setError({
                    status: true,
                    message: 'Brak wolnych miejsc'
                });
            } else if (seats.filter(obj => !obj.reserved).length < amountOfSeats) {
                setError({
                    status: true,
                    message: 'Brak wystarczającej ilości miejsc'
                });
            } else if (x.length < amountOfSeats) {
                setError({
                    status: true,
                    message: 'Brak możliwości wybrania miejsc obok siebie, proszę wybrać najbardziej odpowiadające miejsca ręcznie.'
                });
            };
        };

        if (isClose) {

            for (let i = 0; i < freeSeats.length; i++) {

                if (sequential.length === amountOfSeats) break

                // Wersja z miejsca oddzielnymi o które prosił Damian
                
                if (sequential.length === 0) {
                    sequential.push(freeSeats[i])
                } else if ( freeSeats[i].cords.y - sequential[sequential.length - 1].cords.y > 1 && freeSeats[i].cords.x === sequential[sequential.length - 1].cords.x) {
                    sequential.push(freeSeats[i])
                } else if (freeSeats[i].cords.x !== sequential[0].cords.x){
                    sequential = [freeSeats[i]]
                }
                // Wersja pierwotna z miejcami obok siebie
                // if (isSequential(freeSeats[i])) {
                //     sequential.push(freeSeats[i]);
                // } else {
                //     sequential = [freeSeats[i]];
                // };
            };

            return sequential.length === amountOfSeats
                ? dispatch(setSeats(sequential))
                : lastCheck(sequential)

        } else {

            for (let i = 0; i < freeSeats.length; i++) {

                if (sequential.length === amountOfSeats) break;
                sequential.push(freeSeats[i]);

            }

            return sequential.length === amountOfSeats
                ? dispatch(setSeats(sequential))
                : lastCheck(sequential)

        };
    };

    const toSummary = () => {
        if (selectedSeat.length !== amountOfSeats) {

            message.info('Liczba wybranych miejsc nie zgadza się z liczbą biletów.');

        } else {

            let newArr = seats.map(obj => obj)
            for (let seat of selectedSeat) {
                newArr = newArr.map(obj => obj.id === seat.id ? { ...obj, reserved: true } : obj);
            }

            dispatch(updateSeats(newArr));
            localStorage.setItem('seats', JSON.stringify(newArr));

            props.history.push('/summary');
        }
    };



    useEffect(() => {
        if (load) {
            selectSeats()
        }

    }, [load]);


    return (

        <div>

            {
                load === null ?
                    <Redirect path to="/error" />
                    : load
                        ?

                        <Space direction="vertical" align="center" style={{ maxWidth: 1140, paddingTop: 20 }}>

                            <Typography.Title level={2}>Kierunek oglądania</Typography.Title>
                            <Typography.Text>Aby zmienić wybór, klinij w wybrane miejsce po czym wybierz z miejsc dostępnych.</Typography.Text>

                            {error.status
                                ? <Typography.Text style={{ color: "red" }}>{error.message}</Typography.Text>
                                : ''
                            }
                            {rows.map(item =>
                                <Row key={item} justify="space-between">

                                    <Typography.Text style={{ display: "inline-block", width: "60px" }}>Rząd {item + 1}</Typography.Text>

                                    {
                                        cols.map(obj =>

                                            <Col key={obj + 1} style={{ padding: " 0 5px" }}>

                                                {
                                                    reservationCheck(item, obj)
                                                        ? <Col key={obj} style={coordsCheck(item, obj) ? styleReserved : styleHidden} />

                                                        : <Col key={obj} id={`s${item}${obj}`} style={coordsCheck(item, obj)
                                                            ? selectedSeatStyle(item, obj)
                                                                ? styleSelected
                                                                : styleFreeSeat
                                                            : styleHidden}
                                                            onClick={(e) => selectSeat(e.target.id)} />
                                                }

                                            </Col>
                                        )
                                    }

                                </Row>

                            )}

                            <Layout.Footer style={{ position: "fixed", bottom: "0px", left: "0px", width: "100%", display: "flex", justifyContent: "center" }}>
                                <Space>
                                    <Col style={styleReserved}></Col><Typography.Text>Miejsca zajęte</Typography.Text>
                                    <Col style={styleFreeSeat}></Col><Typography.Text>Miejsca wolne</Typography.Text>
                                    <Col style={styleSelected}></Col><Typography.Text>Miejsca wybrane</Typography.Text>

                                    {seats.filter(obj => !obj.reserved).length === 0 || seats.filter(obj => !obj.reserved).length < amountOfSeats
                                        ? <Button style={{ marginLeft: 30, padding: "0px 50px", height: 50 }} disabled>Rezerwuj</Button>
                                        : <Button style={{ marginLeft: 30, padding: "0px 50px", height: 50 }} onClick={toSummary}>Rezerwuj</Button>}
                                </Space>


                            </Layout.Footer>
                        </Space>

                        : <img src={loading} alt="Loader"></img>
            }
        </div>
    )
};
