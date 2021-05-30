import { createSlice } from '@reduxjs/toolkit';


let initialState = {
    closeSeats: false,
    seatsAmount: 1,
};


export const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {

       
        seatsAmount: (state, action) => {

            state.seatsAmount = action.payload;

        },

        
        closeSeat: (state) => {

            state.closeSeats = !state.closeSeats;

        },

    },
 
});

export const { seatsAmount, closeSeat } = ticketsSlice.actions;

export const numberOfSeats = (state) => state.tickets.seatsAmount;
export const seatsNextTo = (state) => state.tickets.closeSeats;


export default ticketsSlice.reducer;
