import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    seatsAmount,
    closeSeat,
    seatsNextTo,
    numberOfSeats,
} from './slices/ticketSlices';
import '../styles/ReservationPage.css'
import {
    fetchSeats,
    setSelectedSeats,
    seatsTaken,
    seatsSelected,
    pendingFetch,
    removeSelectedSeat,
    setSeats
} from './slices/seatSlices';
import 'antd/dist/antd.css';


export default function ReservationPage(props) {
    const dispatch = useDispatch();
    const isClose = useSelector(seatsNextTo);
    const amountOfSeats = useSelector(numberOfSeats);




    const sendRequest = (e) => {
        e.preventDefault();
        dispatch(fetchSeats());
        props.history.push('/seats-view');

    };

    return (
        <div className="reservation-page">
            <span>Strona rezerwacji biletów online</span>
            <form className="reservation" onSubmit={sendRequest}>
                <div className="amount">
                    <label htmlFor="amount-seats">Ilość miejsc:</label>
                    <input type="number" id="amount-seats" min="1" value={amountOfSeats} onChange={(e) => dispatch(seatsAmount({ value: Number(e.target.value) }))} />
                </div>
                <div className="close-seats">
                    <input type="checkbox" id="closeSeats" defaultChecked={isClose} onChange={() => dispatch(closeSeat())} />
                    <label htmlFor="closeSeats">Czy miejsca mają być obok siebie? </label>
                </div>

                <button>Wybierz miejsca</button>
            </form>

        </div>
    );
}




export default function SeatsView(props) {
    const dispatch = useDispatch();

    const seats = useSelector(seatsTaken);
    const load = useSelector(pendingFetch);
    const selectedSeat = useSelector(seatsSelected);
    const amountOfSeats = useSelector(numberOfSeats);
    const isClose = useSelector(seatsNextTo);

    let cols = [...Array(15).keys()];
    let rows = [...Array(10).keys()];



    const styleFreeSeat = { background: '#0092ff', };
    const styleReserved = { background: 'grey', };
    const styleSelected = { background: 'orange', };
    const styleHidden = { background: '#fff', visibility: 'hidden' };

    

    const coordsCheck = (a, b) => {

        for (let i = 0; i < seats.length; i++) {
            if (a === seats[i].cords.x && b === seats[i].cords.y) {
                return true;
            }
        }
    }



    const reservationCheck = (a, b) => {

        for (let i = 0; i < seats.length; i++) {
            if (`s${a}${b}` === seats[i].id && seats[i].reserved) {
                return true;
            }
        }

    }

    const selectedSeatStyle = (a, b) => {
        for (let i = 0; i < selectedSeat.length; i++) {
            if (`s${a}${b}` === selectedSeat.map(obj => obj.id)[i]) {
                return true
            }
        }
    }


    const selectSeat = (value) => {
        if (selectedSeat.some(x => x.id === value)) {
            dispatch(removeSelectedSeat(value));
        } else if (selectedSeat.length < amountOfSeats) {
            dispatch(setSelectedSeats(value));
        }

    }

    const selectSeats = () => {
        let sequential = [];
        let freeSeats = seats.filter(obj => !obj.reserved);

        const isSequential = (x) => {

            if (sequential.length === 0) return true
            return x.cords.y - 1 === sequential[sequential.length - 1].cords.y

        }

        if (isClose) {

            for (let i = 0; i < freeSeats.length; i++) {

                if (sequential.length === amountOfSeats) break;

                if (isSequential(freeSeats[i])) {
                    sequential.push(freeSeats[i]);
                } else {
                    sequential = [freeSeats[i]]
                }
            }
            return sequential.length === amountOfSeats ? dispatch(setSeats(sequential)) : console.log(`not working`)
        } else {

            for (let i = 0; i < freeSeats.length; i++) {

                if (sequential.length === amountOfSeats) break;
                sequential.push(freeSeats[i]);

            }
            return sequential.length === amountOfSeats ? dispatch(setSeats(sequential)) : console.log(`not working`)
        }
    }

    const toSummary = () => {
        props.history.push('/summary')
        console.log(`dziala`);
    }

    useEffect(() => {

        selectSeats()

    }, [load])

    return (
        <div className="wrapper">

            { load ?
                <div className="seats">
                    <h1>Kierunek oglądania</h1>
                    {rows.map(item =>
                        
                        <div className="rows" key={item}>

                            <span className="tag">Rząd {item + 1}</span>
                            {
                                cols.map(obj => <div className="cols" key={obj}>
                                    {reservationCheck(item, obj) ?
                                        <div className="example" style={coordsCheck(item, obj) ? styleReserved : styleHidden}>

                                        </div>
                                        :
                                        <div className="example" id={`s${item}${obj}`}
                                            style={coordsCheck(item, obj) ? selectedSeatStyle(item, obj) ? styleSelected : styleFreeSeat : styleHidden}
                                            onClick={(e) => selectSeat(e.target.id)}>
                                        </div>
                                    }</div>)
                            }
                        </div>

                    )
                    }
                </div>
                : <h1>Ładuję</h1>}
            {load ? <div className="bottom-bar" >
                <div className="example" style={styleReserved}></div> <span>Miejsca zajęte</span>
                <div className="example" style={styleFreeSeat}></div><span> Miejsca wolne</span>
                <div className="example" style={styleSelected}></div><span>Miejsca wybrane</span>
                <button onClick={toSummary}>Rezerwuj</button>
            </div> : ''}
        </div>
    )

}

