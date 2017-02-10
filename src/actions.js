export const GET_ACTIVE_USER = 'GET_ACTIVE_USER';
export const CHANGE_VIEW_MODEL = 'CHANGE_VIEW_MODEL';

export function changeViewModel(payload) {
    return {
        type: CHANGE_VIEW_MODEL,
        payload: payload
    }
}

export function getActiveUser() {
    return {
        type: GET_ACTIVE_USER,
    }
}
