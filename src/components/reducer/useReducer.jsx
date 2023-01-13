
const initialState = {
    list: [],
    chart: [],
    country: [],
    country_name: ''
}

export const useReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'DATA': {
            // console.log(action);
            return {
                ...state,
                list: action.action
            }
        }
        case 'CHART': {
            // console.log(action);
            return {
                ...state,
                chart: action.action
            }
        }
        case 'COUNTRY': {
            // console.log(action);
            return {
                ...state,
                country: action.action
            }
        }
        case 'COUNTRY_NAME': {
            // console.log(action);
            return {
                ...state,
                country_name: action.action
            }
        }
        default: {
            return state;
        }
    }
};