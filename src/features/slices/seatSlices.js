import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';


let localstate = JSON.parse(localStorage.getItem('seats'));
let initialState = {
    seats: [],
    status: null,
    selectedSeats: [],
};

export const fetchSeats = createAsyncThunk(

    'seats/fetchSeats',

    async () => {
        
            const response = await Axios.get('http://localhost:3000/seats').catch((err) => {
                console.log('Err: ', err);
            });
            return  response.data
        
    }

);


export const seatSlice = createSlice({
    name: 'seats',
    initialState,
    reducers: {

        updateSeats: (state, action) => {
            state.seats = action.payload
        },

        setSelectedSeats: (state, action) => {
            state.selectedSeats = state.seats.filter(obj => obj.id === action.payload).concat(state.selectedSeats)


        },

        setSeats: (state, action) => {
            state.selectedSeats = action.payload
        },

        removeSelectedSeat: (state, action) => {
            state.selectedSeats = state.selectedSeats.filter(id => id.id !== action.payload)
        }

    },

    extraReducers: (builder) => {

        builder
            .addCase(fetchSeats.pending, (state) => {
                state.status = false;
            })
            .addCase(fetchSeats.fulfilled, (state, action) => {
                state.seats = localstate? localstate : action.payload;
                state.status = true;
            })
            .addCase(fetchSeats.rejected, (state) => {
                state.status = null
            })
    }
});

export const { setSelectedSeats, setSeats, updateSeats, removeSelectedSeat } = seatSlice.actions;

export const seatsTaken = (state) => state.seats.seats;
export const seatsSelected = (state) => state.seats.selectedSeats;
export const pendingFetch = (state) => state.seats.status;

export default seatSlice.reducer;
