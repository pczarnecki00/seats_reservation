import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer  from '../features/slices/ticketSlices';
import seatReducer from '../features/slices/seatSlices';




export const store = configureStore({

    reducer: {

        tickets: ticketsReducer,
        seats: seatReducer

    },
});


